import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo';
import api from '../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Textlabel from './Textlabel';
import CommonCard from './Common/CommonCard';
import SuccessMessage from './Common/CustomTostMessage';
import { useFocusEffect } from '@react-navigation/native';

interface RaiseQuerydprops {
    props: any;
    index: number;
    onDelete: (deletedShopId: number) => void;
    onViewQuery: (user_id: number, case_id: number, shop_id: number) => void;
    onOpenChatBot: (user_id: number, case_id: number, shop_id: number) => void;
}
const RaiseQueryCard: React.FC<RaiseQuerydprops> = ({ props, index, onDelete, onViewQuery, onOpenChatBot }) => {

    const [ChatConting, SetChatCounting] = useState(0)
    const [isLoading, setIsLoading] = React.useState(false);
    
    const GetCounting = async () => {
        const token = await AsyncStorage.getItem('token');
        // console.log("case id",props.case_id, props.user_id)
        if (token) {
            try {
                const response = await api.ChatCount(props.case_id, props.user_id, token)
                // console.log("response chat", response.data)
                SetChatCounting(response.data)
            } catch (error) {
                console.log("getchatcount error:", error)
            }
        }

    }

    useFocusEffect(
        React.useCallback(() => {
            GetCounting()
            return () => {
                // Clean up if needed
            };
        }, [])
    );
    const deleteraisequery = async (id: number) => {
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
                                try {
                                    const response = await api.delete_query(id, token);
                                    if (response.data.success === true) {
                                        SuccessMessage({
                                            message: response.data.message
                                        })
                                        onDelete(id);
                                        // console.log("delete response", response.data);
                                    }
                                } catch (error) {
                                    console.log("Error deleting query:", error);
                                    // Handle error here, for example:
                                    Alert.alert('Error', 'Failed to delete the query.');
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


    const viewquery = (user_id: number, case_id: number, shop_id: number) => {
        navigation.navigate('ViewQuery', { user_id: user_id, case_id: case_id, shop_id: shop_id });
    }

   
    return (
        <>
            <CommonCard>
            <Textlabel title="Ticket:" value={props.case_id} />
                <Textlabel title="Query Title:" value={props.query_title} />
                {/* <Textlabel title="Description:" value={props.description} /> */}
                <Textlabel title="Product:" value={props.product_name} />
                <Textlabel title="Submited At:" value={props.created_at} />
                <View style={styles.maincontainer} />

                <View style={{ flexDirection: "row", }}>

                    <View style={styles.actionContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ position: "relative" }}>
                                <TouchableOpacity style={{ marginRight: 10, marginTop: 4 }} onPress={() => onOpenChatBot(props.user_id, props.case_id, props.shop_id)}>
                                    <Text><Entypo name="chat" size={responsiveHeight(3.5)} color="green" /></Text>
                                </TouchableOpacity>
                                {
                                    ChatConting > 0 ? (
                                        <View style={{ position: "absolute", right: -3, backgroundColor: "white", width: 18, height: 25, alignItems: "center", borderColor: "#FFFFFF", borderWidth: 1, borderRadius: 50, top: -10 }}>

                                            <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>{ChatConting}</Text>
                                        </View>

                                    ) : null
                                }

                            </View>

                            <TouchableOpacity onPress={() => { deleteraisequery(props.case_id) }} style={{ marginTop: responsiveHeight(0.5) }}>
                                <Text><Icon name="delete" size={responsiveHeight(3)} color="green" /></Text>
                            </TouchableOpacity>

                            <TouchableOpacity   onPress={() => onViewQuery(props.user_id, props.case_id, props.shop_id)}>
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

export default RaiseQueryCard


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
        paddingHorizontal: responsiveWidth(2),
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
        width: responsiveWidth(80), marginTop: responsiveHeight(1), alignItems: "flex-end", marginRight: responsiveHeight(1)
    },
    maincontainer: {
        width: "100%", height: responsiveHeight(0.2), backgroundColor: "gray", marginTop: responsiveHeight(2)
    },
    submitloader: {
        flex: 1, width: "100%", height: "100%", justifyContent: "center", position: "absolute", marginVertical: 10, zIndex: 999
    },

})