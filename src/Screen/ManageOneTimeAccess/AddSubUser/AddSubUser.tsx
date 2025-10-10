import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import styles from '../styles';
import CustomHeader from '../../CustomHeader/CustomHeader';

import axios, { AxiosError } from 'axios';
import api from '../../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDropdown from '../../../components/CustomDropdown';
import Popup from '../../../components/Popup';
import CustomTextInput from '../../../components/CustomTextInput';
import Loader from '../../../components/Loader';
import SuccessMessage from '../../../components/Common/CustomTostMessage';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    navigation: any,
    route: any
}


const AddSubUser: React.FC<Props> = ({ route, navigation }) => {
    const [UserShop, setUserShop] = useState<any[]>([]);

    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [modalMessage, setModalMessage] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [ShopName, setShopName] = useState('');
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');



    useEffect(() => {
        get_shop_data()
    }, [])


    const get_shop_data = async () => {
        const userId = await AsyncStorage.getItem('userId')
        const token = await AsyncStorage.getItem('token');
        if (token && userId) {
            const response = await api.equipment_data(userId, token);

            if (response.data.success === true) {
                setUserShop(response.data.shop)
            }
        }
    }

    const shopOption = UserShop.map((shop) => ({
        label: shop.shop_name,
        value: shop.id
    })) || []

    const handleSelectshop = (item) => {
        setShopName(item.value);
    };

    const submit = async () => {
        const userId = await AsyncStorage.getItem('userId')
        const token = await AsyncStorage.getItem('token');
        const subuser = {
            head_user_id: userId,
            name: name,
            email: email,
            shop_id: ShopName,
            user_type: "1",
            password: password
        }
        if (token) {
            try {
                setIsLoading(true)
                const response = await api.add_subUser(subuser, token);
                SuccessMessage({
                    message: response.data.message
                })
                setIsLoading(false)
                route.params.onOneTimeAdd()
                navigation.goBack();

            } catch (error) {
                setIsLoading(false)
                console.log(error)
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 400) {
                    if (typeof axiosError.response.data === 'object') {
                        const responseData = axiosError.response.data as { message: { email: string, name: string, password: string, shop_id: string } };
                        if (responseData.message.shop_id) {
                            setModalMessage("The Shop name field is required");
                            setModalVisible(true);
                            return;
                        }
                        if (responseData.message.name) {
                            setModalMessage(responseData.message.name);
                            setModalVisible(true);
                            return;
                        }
                        if (responseData.message.email) {
                            setModalMessage(responseData.message.email);
                            setModalVisible(true);
                            return;
                        }
                        if (responseData.message.password) {
                            setModalMessage(responseData.message.password);
                            setModalVisible(true);
                            return;
                        }

                    }
                }
            }
        }

    }
    const closeModal = () => {
        setModalVisible(false);
    }

    return (

        <>
            <SafeAreaView style={styles.container}>

                <CustomHeader title="Add New Sub User" imgSource={require('../../../assets/img/profile_img.png')} />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >

                    <View style={styles.maincontainer}>

                        <ScrollView keyboardShouldPersistTaps="handled">
                            <View>
                                <CustomDropdown title='Shop Name' data={shopOption} placeholder='Select Shop Name' onSelect={handleSelectshop} />

                                <CustomTextInput title='Name' value={name} placeholder='Name' onChangeText={(name) => setName(name)} keyboardType='default' />
                                <CustomTextInput title='Email' value={email} placeholder='Email' onChangeText={(email) => setEmail(email)} keyboardType='default' />
                                <CustomTextInput title='Password' value={password} placeholder='Password' onChangeText={(password) => setPassword(password)} keyboardType='default' secureTextEntry={true} />

                                <TouchableOpacity onPress={submit} style={styles.usersubmit} >
                                    <Text style={styles.addsubuser}>Add Sub User</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>

                    </View>
                </KeyboardAvoidingView>
                <Popup
                    visible={modalVisible}
                    message={modalMessage}
                    closeModal={closeModal}
                />
            </SafeAreaView>

          
            <Loader loading={isLoading} />
        </>

    )
}

export default AddSubUser