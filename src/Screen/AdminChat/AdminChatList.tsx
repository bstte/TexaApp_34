import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { Image_Base_Url } from '../../api/Api';
import CustomHeader from '../CustomHeader/CustomHeader';
import { RefreshControl } from 'react-native';
import { Image } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native'; // Import navigation hooks
const AdminChatList = ({ route }) => {

    const { user_id, case_id, shop_id } = route.params;

    const [adminList, SetadminList] = useState([])
    const [isLoading, SetIsLoading] = useState(true)

    const navigation = useNavigation(); // Initialize navigation
    useEffect(() => {

        getadminlist()
    }, [])

    const getadminlist = async () => {
        const token = await AsyncStorage.getItem('token');
  

        try {
            if (token) {
                const response = await api.Getadminlist(case_id, token);
                if (response.data.success === true) {

                    SetadminList(response.data.data)
                    SetIsLoading(false)
                    console.log("total respnse",response)
                    if(response.data.data.length<2){
                        console.log("only admin",response.data.data[0])
                        navigation.replace("AdminChat", { 
                            user_id: user_id, 
                            case_id: case_id, 
                            shop_id: shop_id, 
                            adminId: `admin_${response.data.data[0].id}` ,
                            item:response.data.data[0]
                        })

                    }else{
                        console.log("with rep",response.data.data)
                    }
                }
                console.log("response", response.data)
            }

        } catch (error) {
            console.log("getadminlist", error)
        }

    }
    const AdminChat = (user_id: number, case_id: number, shop_id: number, adminId: number,item:any) => {
        navigation.navigate('AdminChat', { 
            user_id: user_id, 
            case_id: case_id, 
            shop_id: shop_id, 
            adminId: `admin_${adminId}` ,
            item:item
        });
    }

    const ViewItem = ({ item }) => {
        return (
            <View style={{ flex: 1, backgroundColor: "white" ,marginVertical:10,marginHorizontal:10, borderRadius: 10,}}>
                <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",}} onPress={()=>AdminChat(user_id,case_id,shop_id,item.id,item)}>
                    <View style={styles.profileimg}>
                        {item.profile_photo_path ? (
                        <Image
                            source={{ uri: `${item.profile_photo_path}` }}
                            style={{
                                width: responsiveHeight(7),
                                height: responsiveHeight(7),
                            }}
                        />
                    ) : (
                        <Image
                            source={require('../../assets/img/default_profile.jpg')}
                            style={{
                                width: responsiveHeight(7),
                                height: responsiveHeight(7),
                            }}
                        />
                     )}
                    </View>
                    <View style={{marginRight:20}}>
                        <Text style={{fontSize:18,color:"#000"}}>{item.email}</Text>
                    </View>

                </TouchableOpacity>
            </View>

        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader title="Admin List For Chat" imgSource={require('../../assets/img/profile_img.png')} />

            <View>
                <FlatList
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => getadminlist()} />}
                    data={adminList}
                    renderItem={ViewItem}
                />
            </View>
        </SafeAreaView>
    )
}

export default AdminChatList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#00aaf0",
    },
    profileimg: {
        width: responsiveHeight(10),
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        display: "flex",
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 0,
        height: responsiveHeight(10),
        marginBottom: 10,
        resizeMode: 'contain',
        backgroundColor: "white",
        borderRadius: responsiveHeight(7.9),
        marginVertical: 3,
        marginLeft: 20


    },
})