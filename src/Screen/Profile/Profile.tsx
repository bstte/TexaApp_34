import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import CustomHeader from '../CustomHeader/CustomHeader';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import api, { Image_Base_Url } from '../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUser } from '../../Reducer/slices/userSlice';
import CountryDropdown from '../../components/CountryDropdown';
import CustomImageModal from '../../components/CustomImageModal';
import {
    responsiveFontSize, responsiveHeight
} from "react-native-responsive-dimensions";
import SuccessMessage from '../../components/Common/CustomTostMessage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleApiError } from '../utils/handleApiError';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Profile = (props) => {
    const userData = useSelector((state: any) => state.user.userData)
    const country_calling_code = userData && userData.country && userData.country.calling_code ? userData.country.calling_code : '';
    const calling_code = userData && userData.calling_code ? userData.calling_code : '';
    const country_flag = userData && userData.country && userData.country.flag ? userData.country.flag : '';
    const country_label = userData && userData.country && userData.country.name ? userData.country.name : '';
    const [editedName, setEditedName] = useState(userData ? userData.name : '');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isCountryDropdownVisible, setCountryDropdownVisible] = React.useState(false)
    const [isCountryCallingCodeDropdownVisible, setCountryCallingCodeDropdownVisible] = React.useState(false)
    const [isImageModalVisible, setImageModalVisible] = React.useState(false)
    const profileImage = userData ? userData.profile_photo_path : '';
    const [editprofileimg, seteditprofileimg] = React.useState('');
    const [phone, setphone] = useState(userData ? (userData.phone ? userData.phone.toString() : '') : '');
    const role = userData && userData.role;
// console.log("user ",userData)
    const [successmsg, setsuccessmsg] = React.useState<string>('');
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [selectedCallingCode, setselectedCallingCode] = React.useState(null);
    const dispatch = useDispatch()
    const submit = async () => {

        if (!userData) {
            // Handle the case where userData is null or undefined
            console.log("User data is null or undefined");
            return;
        }

        // === ✅ Phone number validation ===
        if (!phone || phone.trim() === '') {
            Alert.alert("Validation Error", "Phone number should not be empty.");
            return;
        }

        if (phone.length < 8 || phone.length > 15) {
            Alert.alert("Validation Error", "Phone number must be between 8 and 15 digits.");
            return;
        }
        const updateprofile = new FormData;
        updateprofile.append('name', editedName)
        updateprofile.append('phone', phone)
        updateprofile.append('role', role)

        updateprofile.append('country_id', selectedItem ? selectedItem.value : '')
        if (selectedCallingCode) {
            updateprofile.append('calling_code', selectedCallingCode ? selectedCallingCode : '')
        }

        if (editprofileimg) {
            updateprofile.append('image', {
                uri: editprofileimg,
                name: "image",
                type: "image/jpg"
            })
        }

        const userId = userData ? userData.id : 0;


       
        const token = await AsyncStorage.getItem('token');
        if (userId && token) {

            try {
                setIsLoading(true)
                const response = await api.user_update(userId, token, updateprofile);
                setIsLoading(false);
                console.log("update profile",response.data)
                if (response.data.success === true) {
                    
                    SuccessMessage({
                        message: response.data.message
                    })
                    const updatedUserData = {
                        ...userData,
                        ...response.data.data,
                        // country: userData.country,
                    };

                    dispatch(setUser(updatedUserData));
                    props.navigation.navigate('Home', { screen: 'Dashboard' });

                    return;
                }
            } catch (error) {
                setIsLoading(false);
                handleApiError(error, "porifle udpate error :")
                console.log("update profile error:", error);
            }
        }
    };
   

    const handleCountrySelect = (item: any) => {
        setSelectedItem(item)
    }
    const handlecalling_code = () => {
        setCountryCallingCodeDropdownVisible(!isCountryCallingCodeDropdownVisible)
    }

    const handlecountry_code = () => {
        setCountryDropdownVisible(!isCountryDropdownVisible);
    }
    const handleImageModalVisible = () => {
        setImageModalVisible(!isImageModalVisible)
    }
    return (
        <>
            <SafeAreaView style={styles.container}>

                <CustomHeader title="Complete Your Profile" imgSource={require('../../assets/img/default_profile.jpg')} />
               
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

                    <View style={styles.maincontainer}>

                        <KeyboardAwareScrollView
                            keyboardShouldPersistTaps="handled"
                            enableOnAndroid={true}
                            extraScrollHeight={20}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: responsiveHeight(2) }}
                            showsVerticalScrollIndicator={false}
                        >

                            <View style={{ alignItems: "center" }}>
                                {successmsg ? <Text style={styles.successmsg}>{successmsg}</Text> : ''}
                            </View>
                            <View>
                                <View>
                                    <TouchableOpacity onPress={handleImageModalVisible} style={styles.updateprofileimg}>
                                        {editprofileimg || profileImage ? (
                                            <Image
                                                source={editprofileimg ? { uri: editprofileimg } : { uri: `${Image_Base_Url}/images/user/${profileImage}` }}
                                                style={styles.profileimg}
                                            />
                                        ) : (
                                            <Image source={require('../../assets/img/default_profile.jpg')} style={styles.profileimg} />)}

                                    </TouchableOpacity>

                                </View>
                                <TouchableOpacity onPress={handleImageModalVisible} style={{ justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: 17, color: "#333" }}>Edit Profile</Text>
                                </TouchableOpacity>

                                <TextInput
                                    style={styles.Textinput}
                                    placeholderTextColor={"#787a7c"}
                                    placeholder="Enter Your Name"
                                    autoCapitalize='none'
                                    value={editedName}
                                    autoCorrect={false}
                                    onChangeText={(text) => setEditedName(text)} // Update editedName as the user types
                                />
                                {/* <TextInput style={styles.Textinput} placeholder="Enter Your Name" autoCapitalize='none' value={userData ? userData.name : ""} autoCorrect={false} /> */}
                                <TextInput style={styles.Textinput} placeholder="Enter Your email" autoCapitalize='none' value={userData ? userData.email : ""} autoCorrect={false} editable={false} placeholderTextColor={"#787a7c"} />


                                <View style={{ flex: 1 }}>

                                    <TouchableOpacity style={styles.countryDropdownContainer} onPress={handlecountry_code} >
                                        <View style={{ flexDirection: "row", flex: 1 }}>
                                            <Image
                                                source={{ uri: `${Image_Base_Url}/flags/${selectedItem ? selectedItem.flag : country_flag}` }}
                                                style={styles.flagimg}
                                            />
                                            <Text style={styles.dropdownText}>{selectedItem ? selectedItem.label : country_label}</Text>
                                        </View>

                                        <FontAwesome5 name="caret-down" size={responsiveFontSize(2)} color="black" style={styles.dropdownIcon} />

                                    </TouchableOpacity>
                                    {/* Render the country dropdown */}

                                </View>
                                <View style={{ width: "100%", marginBottom: 10 }}>

                                    <TouchableOpacity style={styles.country_calling_code} onPress={handlecalling_code}>
                                        <Text style={styles.country_calling_code_text}>
                                            +{selectedCallingCode ? selectedCallingCode : calling_code ? calling_code : country_calling_code}
                                        </Text>

                                    </TouchableOpacity>




                                    <TextInput style={styles.country_calling_code_textinput} placeholder="Enter Phone Number" value={phone?.toString()} maxLength={10} keyboardType="phone-pad" onChangeText={(phonenumber) => setphone(phonenumber)} placeholderTextColor={"#787a7c"} />
                                </View>

                                <TouchableOpacity onPress={submit} style={styles.updatebutton} >
                                    <Text style={styles.addtext}>Update Profile</Text>
                                </TouchableOpacity>

                                <View style={{ flex: 1 }}>
                                    <CountryDropdown
                                        togglevisible={isCountryDropdownVisible}
                                        onclose={handlecountry_code}
                                        onSelectCountry={(item) => {
                                            handleCountrySelect(item);
                                            setCountryDropdownVisible(false);
                                        }}
                                    />

                                    <CountryDropdown
                                        togglevisible={isCountryCallingCodeDropdownVisible}
                                        onclose={handlecalling_code}
                                        onSelectCountry={(item) => {
                                            setselectedCallingCode(item.calling_code)
                                            setCountryCallingCodeDropdownVisible(false);
                                        }}
                                    />

                                    <CustomImageModal
                                        togglevisible={isImageModalVisible}
                                        onclose={handleImageModalVisible}
                                        handelImage={(item) => {
                                            handleImageModalVisible()
                                            seteditprofileimg(item)
                                        }}

                                    />

                                </View>
                            </View>

                        </KeyboardAwareScrollView>

                    </View>
                </TouchableWithoutFeedback>
                {/* </KeyboardAvoidingView> */}
            </SafeAreaView>

            {
                isLoading ? (
                    <View style={styles.submitloader}>
                        <ActivityIndicator animating={isLoading} size="large" color="white" />
                    </View>
                ) : null
            }
        </>

    )
}

export default Profile