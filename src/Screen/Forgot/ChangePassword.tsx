import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ActivityIndicator
} from 'react-native';
import styles from '../Login/Styles';
// import Textinput from '../../components/Textinput';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import AgreeCheckbox from '../../components/AgreeCheckbox';
import Popup from '../../components/Popup';
import api from '../../api/Api';
import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../../Reducer/slices/userSlice';



interface props {
    route:any;
}

const ChangePassword: React.FC<props> = ({route}) => {
  // const navigation = useNavigation();


const {email,msg}=route.params
  // here required error
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [otp,setOtp]=useState<string>('');
  const [password,setpassword]=useState<string>('');
  const [cpassword,setcpassword]=useState<string>('');
  const [successmsg,setsuccessmsg]=useState<string>('');

useEffect(()=>{
    if(msg){
        setModalMessage(msg);
        setModalVisible(true);
        return;
    }
},[])


const ChangePswrd=async()=>{
 
    if (password === '') {
        setModalMessage('password is required');
        setModalVisible(true);
        return
      }

      if (cpassword === '') {
        setModalMessage('Confirm password is required');
        setModalVisible(true);
        return
      }
    if (password !== cpassword) {
        setModalMessage('Passwords Confirm Password do not match');
        setModalVisible(true);
        return;
      }
      if (otp === '') {
        setModalMessage('OTP is required');
        setModalVisible(true);
        return
      }
      const credentials = {
        email: email,
        otp:otp,
        password:password,
        cpassword:cpassword

       
      }
      console.log(credentials)
  
      try{
        setIsLoading(true)
        const respone=await api.update_password(credentials)
        if(respone.data.success===true){
            setIsLoading(false);
            setsuccessmsg("Password Update Successfull Please Login Again")
        }else{
            setIsLoading(false);
            setModalMessage(respone.data.msg);
            setModalVisible(true);
            return;
        }
        console.log("responese reset",respone.data)
      }catch(error){
        console.log("reset password error:",error)
      }

}
  // for close popup modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // here user  login code

  return (
    <>
      <View style={styles.container}>

        {/* <Image source={require('../../assets/img/food.jpeg')} style={style.loginimg}/> */}
        <View style={{alignItems:"center"}}>
        <Text style={styles.title}>T E X A</Text>
        <Text style={styles.title2}>CHANGE PASSWORD</Text>
        {successmsg?<Text style={styles.successmsg}>Password Update Successfull Please Login Again</Text>:''}
        </View>
     
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            autoCapitalize='none'
            autoCorrect={false}
            value={email}
            placeholderTextColor={'#787a7c'}
            editable={false} 
             />
        </View>
        <View style={styles.inputView}>
        <TextInput
         placeholderTextColor={'#787a7c'}
            style={styles.inputText}
            autoCapitalize='none'
            autoCorrect={false}
            value={otp}
            placeholder="#OTP"
            onChangeText={(otp) => setOtp(otp)}
             />
        </View>

        <View style={styles.inputView}>
          <TextInput placeholder="New Password" style={styles.inputText}
           placeholderTextColor={'#787a7c'}
            autoCapitalize='none'
            autoCorrect={false}
            value={password}
            secureTextEntry={true}
            onChangeText={(password) => setpassword(password)} />
        </View>

        <View style={styles.inputView}>
          <TextInput placeholder="Confirm Password" style={styles.inputText}
           placeholderTextColor={'#787a7c'}
            autoCapitalize='none'
            autoCorrect={false}
            value={cpassword}
            secureTextEntry={true}
            onChangeText={(password) => setcpassword(password)} />
        </View>


        <TouchableOpacity
          onPress={ChangePswrd}
          style={styles.loginBtn}>
          <Text style={styles.loginText}>RESET</Text>
        </TouchableOpacity>
     

        <Popup
          visible={modalVisible}
          message={modalMessage}
          closeModal={closeModal}
        />
      </View>

      {
        isLoading ? (
          <View style={styles.submitloader}>
            <ActivityIndicator animating={isLoading} size="large" color="white" />
          </View>
        ) : null
      }

    </>

  );
};

export default ChangePassword;