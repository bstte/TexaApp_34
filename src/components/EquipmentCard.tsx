import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../api/Api';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Textlabel from './Textlabel';
import CommonCard from './Common/CommonCard';
import SuccessMessage from './Common/CustomTostMessage';

interface Equipmetndataprops {
    props: any;
    index: number;
    onDelete: (deletedShopId: number) => void;
    navigation: any
}
const EquipmentCard: React.FC<Equipmetndataprops> = ({ props, index, onDelete, navigation }) => {
 
    const isActive = props.status
    const statusText = isActive ? 'Active' : 'Inactive';
    const statusColor = isActive ? 'green' : 'red';
    const [isLoading, setIsLoading] = React.useState(false);

    const deleteequipment = async (id: number) => {
        try {
            Alert.alert(
                'Confirm Deletion',
                'Are you sure you want to delete this record?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        onPress: async () => {
                            setIsLoading(true)
                            const token = await AsyncStorage.getItem('token');
                            if (token) {
                                try{
                                    const response = await api.delete_equipment(id, token)
                                    if (response.data.success === true) {
                                        SuccessMessage({
                                            message:response.data.message
                                        })
                                        onDelete(id);
                                        console.log("delete respone", response.data)
                                    }
                                }catch(error){
                                    console.log('delte equipment error',error)
                                }
                              
                            }
                        },
                    },
                ],
                { cancelable: false }
            );



        } catch (error) {
            console.log("shop delet:", error)
        }
    }

    const editEquipmet = (id: number) => {

        navigation.navigate('EditEquipment', { EquipmetnId: id, navigation: navigation });
    }
    const ViewEquipment = (id: number) => {
        navigation.navigate('ViewEquipment', { equipmentId: id });
    }
    return (
        <>
            <CommonCard>
                <Textlabel title="Shop Name:" value={props.shop_name} />
                {/* <Textlabel title="Model Name:" value={props.dosage ? props.dosage : props.other_dosage} /> */}

                <Textlabel title="Equipments:" value={props.equipment} />
                <Textlabel title="Brand Name:" value={props.brand_name} />
                <Textlabel title="Machine Name:" value={props.machine_name} />
                <Textlabel title="Model Name:" value={props.model_name} />
                <View style={styles.maincontainer} />

                <View style={{ flexDirection: "row", }}>
                    <View style={[styles.statusContainer]}>
                        {/* <TouchableOpacity style={[styles.statusButton, { backgroundColor: statusColor }]}> */}
                        <Icon name={isActive ? 'check' : 'check'} size={responsiveHeight(2)} color="white" />
                        {/* </TouchableOpacity> */}
                        <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
                    </View>

                    {/* for edit  */}



                    <View style={styles.actionContainer}>
                        <View style={{ flexDirection: "row" }}>

                            <TouchableOpacity onPress={() => { editEquipmet(props.id) }}>
                                <Text><EvilIcons name="pencil" size={responsiveHeight(4.5)} color="green" /></Text>
                            </TouchableOpacity>



                            <TouchableOpacity onPress={() => { deleteequipment(props.id) }} style={{ marginTop: responsiveHeight(0.5) }}>
                                <Text><Icon name="delete" size={responsiveHeight(3)} color="green" /></Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { ViewEquipment(props.id) }}>
                                <Text><EvilIcons name="eye" size={responsiveHeight(4.5)} color="green" /></Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </CommonCard>
            {
                isLoading ? (
                    <View style={styles.submitloader}>
                        <ActivityIndicator animating={isLoading} size="large" color="#89898frgba(0, 0, 0, 0.5)" />
                    </View>
                ) : null
            }
        </>
    )
}

export default EquipmentCard


const styles = StyleSheet.create({
    card: {
        borderRadius: responsiveHeight(0.5),
        padding: responsiveHeight(3), // Adjust the padding as needed
        margin: responsiveHeight(0.3), // Adjust the margin as needed
        marginLeft: responsiveHeight(2),
        marginRight: responsiveHeight(2),
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: responsiveWidth(0), height: responsiveHeight(0.5) },
        shadowOpacity: responsiveHeight(0.5),
        shadowRadius: responsiveHeight(0.6),
        elevation: responsiveHeight(0.4),
    },
    statusContainer: {
        flexDirection: 'row',
        // paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(1),
        width: responsiveWidth(25)
    },
    statusButton: {
        width: responsiveWidth(5),
        height: responsiveHeight(2.7),
        borderRadius: responsiveHeight(5),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: responsiveHeight(0.5),
    },
    statusText: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
    },
    actionContainer: {
        width: responsiveWidth(57), marginTop: responsiveHeight(1), alignItems: "flex-end", marginRight: responsiveHeight(1)
    },
    maincontainer: {
        width: "100%", height: responsiveHeight(0.2), backgroundColor: "gray", marginTop: responsiveHeight(2)
    },
    submitloader: {
        flex: 1, width: "100%", height: "100%", justifyContent: "center", position: "absolute", marginVertical: 10, zIndex: 999
    },

})