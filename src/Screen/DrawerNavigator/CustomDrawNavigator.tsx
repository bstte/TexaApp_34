import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import api from '../../api/Api';
import { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUser } from '../../Reducer/slices/userSlice';
import { Image_Base_Url } from '../../api/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import Loader from '../../components/Loader';
import SuccessMessage from '../../components/Common/CustomTostMessage';

interface customeprops {
  navigation: any,
}

interface userData {
  name: string,
  email: string,
  image: string
}
const CustomDrawNavigator: React.FC<customeprops> = (props) => {


  // const userData = useSelector((state: any) => state.user.userData)
  const dispatch = useDispatch()
  // const [userData, setUserData] = React.useState<userData>({ name: '', email: '' ,image:''});
  const userData = useSelector((state: any) => state.user.userData)
  const profileImage = userData ? userData.profile_photo_path : '';
  const [isLoading, setIsLoading] = React.useState(false);


  const logout = async () => {

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Yes',
          onPress: async () => {
            setIsLoading(true)
            const token = await AsyncStorage.getItem('token');
            if (token) {
              try {
                const response = await api.logout(token);
               
                if (response.data.success === true) {
                  setIsLoading(false)
                  SuccessMessage({
                    message: response.data.message
                  })
                  await AsyncStorage.removeItem('token');
                  const resetAction = CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                  props.navigation.dispatch(resetAction);
                }
              } catch (error) {
                console.log('Logout error:', error);
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  }
  const TruncateEmail = (email, length) => {
    if (email.length <= length) return email;
    return email.substring(0, length) + '...';
  };
  const profile = () => {
    props.navigation.navigate("Profile")
  }
  return <View style={{ flex: 1 }}>
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <View style={{}}>
          <Text style={styles.title}>{userData ? userData.name : ""}</Text>
          <Text style={styles.email}>{ TruncateEmail(userData ? userData.email:"",19)}</Text>
        </View>
        <TouchableOpacity onPress={profile}>
          {profileImage ? (
            <Image source={{ uri: `${Image_Base_Url}/${profileImage}` }} style={styles.profile_img} />
          ) :
            <Image source={require('../../assets/img/default_profile.jpg')} style={styles.profile_img} />}
          <Text style={{marginTop:10,fontSize:16,color:"#00aaf0"}}>
            Edit Profile
          </Text>
        </TouchableOpacity>


      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
    <TouchableOpacity style={styles.footer} onPress={logout}>
      <View style={{ flexDirection: "row", }}>
        <Icon name="logout" size={responsiveHeight(3.3)} color="#000" />
        <Text style={styles.logtext}>Log Out</Text>
      </View>

    </TouchableOpacity>

    <Loader loading={isLoading} />
  </View>

}

export default CustomDrawNavigator