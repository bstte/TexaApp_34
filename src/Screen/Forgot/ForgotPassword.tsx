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
import ChangePassword from './ChangePassword';



interface props {
  navigation: any
}

const ForgotPassword: React.FC<props> = (props) => {
  // const navigation = useNavigation();

  const [email, setEmail] = useState('');


  // here required error
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false)



  // here email validatioin code
  const isEmailValid = (email: string): boolean => {
    // Email validation regex pattern
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
  };


const resetpassword=async()=>{
    if (email === '') {
        setModalMessage('Email is required');
        setModalVisible(true);
        return
      } else if (!isEmailValid(email)) {
        setModalMessage('Invalid email format');
        setModalVisible(true);
        return;
      }

      const credentials = {
        email: email,
       
      }
  
      try{
        setIsLoading(true)
        // console.log(credentials)
        const response =await api.forget_password(credentials);
        if(response.data.success===true){
            setIsLoading(false);
            const { email } = response.data.data[0]; 
           props.navigation.navigate("ChangePassword",{email,msg:response.data.msg});
        }else{
            setIsLoading(false);
            setModalMessage(response.data.msg);
            setModalVisible(true);
            return;
        }
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
        <Text style={styles.title2}>RESET PASSWORD</Text>
        <Text style={styles.resettext}>
            Enter your email address and we'll help reset your password
        </Text>
        </View>
        
        <View style={styles.inputView}>
          <TextInput
           placeholderTextColor={'#787a7c'}
            style={styles.inputText}
            autoCapitalize='none'
            autoCorrect={false}
            value={email}
            placeholder="Email Address"
            onChangeText={(email) => setEmail(email)} />
        </View>
    


        <TouchableOpacity
          onPress={resetpassword}
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

export default ForgotPassword;