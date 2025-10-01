import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Textlabel from './Textlabel';
import Popup from './Popup';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import CommonCard from './Common/CommonCard';
import SuccessMessage from './Common/CustomTostMessage';

interface shopdataprops {
    props: any;
    index: number;
    onDelete: (deletedShopId: number) => void;
    navigation: any
}
const ShopCard: React.FC<shopdataprops> = ({ props, index, onDelete, navigation }) => {

    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [modalMessage, setModalMessage] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState(false);

    const isActive = props.status
    const statusText = isActive ? 'Active' : 'Inactive';
    const statusColor = isActive ? 'green' : 'red';

    const deleteshop = async (id: number) => {
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
                                const response = await api.delete_shop(id, token)
                                if (response.data.success === true) {
                                    setIsLoading(false)
                                    SuccessMessage({
                                        message: response.data.message
                                    })
                                    // setModalMessage(response.data.message);
                                    // setModalVisible(true);
                                    onDelete(id);

                                    return;

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

    const editShop = (id: number) => {

        navigation.navigate('EditShop', { shopId: id, navigation: navigation });
    }
    const closeModal = () => {
        setModalVisible(false);
    }

    const ViewShop = (id: number) => {
        navigation.navigate('ViewShop', { shopId: id });
    }
    return (
        <>
            <CommonCard>

                <Textlabel title="Shop Name:" value={props.shop_name} />
                <Textlabel title="Contact Person:" value={props.shop_contact_person} />
                <Textlabel title="Email:" value={props.email} />
                <Textlabel
                    title="Phone Number:"
                    value={props.country_code ? `(+${props.country_code}) ${props.phone || ''}` : props.phone || ''}
                />



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

                            <TouchableOpacity onPress={() => { editShop(props.id) }}>
                                <Text><EvilIcons name="pencil" size={responsiveHeight(4.5)} color="green" /></Text>
                            </TouchableOpacity>



                            <TouchableOpacity onPress={() => { deleteshop(props.id) }} style={{ marginTop: responsiveHeight(0.5) }}>
                                <Text><Icon name="delete" size={responsiveHeight(3)} color="green" /></Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { ViewShop(props.id) }}>
                                <Text><EvilIcons name="eye" size={responsiveHeight(4.5)} color="green" /></Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
                <Popup
                    visible={modalVisible}
                    message={modalMessage}
                    closeModal={closeModal}
                />

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

export default ShopCard


const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: responsiveHeight(0.5),
        padding: responsiveHeight(3), // Adjust the padding as needed
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