import { View, Text, TextInput,TouchableOpacity, ScrollView, ActivityIndicator, Image, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect } from 'react';
import AgreeCheckbox from '../../components/AgreeCheckbox';
import CountryDropdown from '../../components/CountryDropdown';
import Popup from '../../components/Popup';
import api, { Image_Base_Url } from '../../api/Api';
import axios, { AxiosError } from 'axios';

import { useDispatch } from 'react-redux';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize
} from "react-native-responsive-dimensions";
import Icon from 'react-native-vector-icons/FontAwesome5';
import style from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuccessMessage from '../../components/Common/CustomTostMessage';


interface signup {
  navigation: any
}
interface AllCountries {
  id: string,
  name: string,
  flag: string,
  calling_code: string
}

const Signup: React.FC<signup> = (props) => {

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isAgreed, setIsAgreed] = React.useState(true);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<string>('');
  const [isAuthpassword, setIsAuthpassword] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [AllCountries, setAllCountries] = React.useState<AllCountries[]>([])

  const [isCountryDropdownVisible, setCountryDropdownVisible]=React.useState(false)
  // here agree checkbox handler function
  const handleCheckboxChange = (value: boolean) => {
    setIsAgreed(value);
  };

  const handleCountrySelect = (item: any) => {
    setSelectedItem(item)
  }


  useEffect(() => {
    get_contries()
  }, [])

  const get_contries = async () => {
    try {
      const response = await api.get_contries()
      setAllCountries(response.data.data)

    } catch (error) {
      console.log("countries error::", error)
    }
  }


  const CountriesOption = AllCountries.map((country) => ({
    label: country.name,
    value: country.id,
    flag: country.flag,
    calling_code: country.calling_code
  }))

  const defaultCountryValue = {
    label: 'Germany',
    value: '276',
    flag: 'DE.png',
  };
  // for password feedback
  const getPasswordFeedback = () => {
    const requirements = [
      { label: 'At least 8 characters', fulfilled: password.length >= 8 },
      { label: 'At least one uppercase letter', fulfilled: /[A-Z]/.test(password) },
      { label: 'At least one lowercase letter', fulfilled: /[a-z]/.test(password) },
      { label: 'At least one digit', fulfilled: /\d/.test(password) },
      { label: 'At least one special character', fulfilled: /[@$!%*?&]/.test(password) },
    ];

    return requirements.map((req, index) => (
      <Text key={index} style={req.fulfilled ? style.valid : style.invalid}>
        {req.fulfilled ? '✓' : '✗'} {req.label}
      </Text>
    ));
  };



  const submit = async () => {
    // const country_id=selectedCountry?selectedCountry:276;
    if (isAgreed) {
      if (name === '') {
        setModalMessage("Name is required");
        setModalVisible(true);
        return
      }
      if (email === '') {
        setModalMessage("Email is required");
        setModalVisible(true);
        return
      } else if (!isEmailValid(email)) {
        setModalMessage("Invalid email format");
        setModalVisible(true);
        return

      }
      if (password === '') {
        setModalMessage("Password is required");
        setModalVisible(true);
        return
      } else if (!isPasswordStrong(password)) {
        setModalMessage("Password is weak. Please choose a stronger password.");
        setModalVisible(true);

        return
      }

      const userData = {
        name: name,
        email: email,
        password: password,
        country_id: selectedItem ? selectedItem.value : defaultCountryValue.value,
      };
   
      try {
      
        setIsLoading(true)
        const response = await api.register(userData);
        console.log('Registration successful:', response.data);
        if (response.data.success === true) {
          SuccessMessage({
                      message: response.data.message
                    })
          setIsLoading(false)
          // dispatch(setUser(response.data.data.user))
          // const token = response.data.data.token;
          // await AsyncStorage.setItem("userId", `${response.data.data.user.id}`);
          // await AsyncStorage.setItem("token", token);
          // props.navigation.navigate('Home');

          props.navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }

      } catch (error) {
        setIsLoading(false)

        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 400) {
          setModalMessage("The email has already been taken.");
          setModalVisible(true);
          return
        } else {
          console.error('Registration error:', error);
        }
      }
    } else {
      setModalMessage("Please agree to the terms before logging in.");
      setModalVisible(true);
      return
    }
  };


  const navigatelogin = () => {
    props.navigation.replace('Login');
  }


  // here email validatioin code
  const isEmailValid = (email: string): boolean => {
    // Email validation regex pattern
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
  };

  // here password parten check
  const isPasswordStrong = (password: string): boolean => {
    // Password requirements: Minimum 8 characters, at least one uppercase letter,
    // at least one lowercase letter, at least one digit, and at least one special character.

    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return strongRegex.test(password);
  };

  const closeModal = () => {
    setModalVisible(false);
  }

 
  const setPasswordfunction = (password: string) => {
    setPassword(password)
    setIsAuthpassword(true)
  }
  const toggleModal = () => {
    setCountryDropdownVisible(!isCountryDropdownVisible);
  }
  return (
    <>
      <SafeAreaView style={style.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        

        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: "center" }}>
            <Text style={style.title}>T E X A P</Text>
            <Text style={style.title2}> Create an account</Text>
          </View>

          <View >
            <TextInput style={style.input} placeholder="Enter Your Name" autoCapitalize='none' autoCorrect={false} onChangeText={(name) => setName(name)}    placeholderTextColor={"#787a7c"}/>
            <TextInput style={style.input} placeholder="Enter Your Email" autoCapitalize='none' autoCorrect={false} onChangeText={(email) => setEmail(email)}    placeholderTextColor={"#787a7c"} />
            {/* <View>
              <TextInput style={style.input} placeholder="Enter Your Password" autoCapitalize='none' autoCorrect={false} secureTextEntry={true} onChangeText={(password) => setPassword(password)} />
         
            </View> */}
            <View style={style.inputView}>
              <TextInput placeholder="Enter Your Password" style={style.psswordtextinput}
                 placeholderTextColor={"#787a7c"}
                autoCapitalize='none'
                autoCorrect={false}
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={(password) => setPasswordfunction(password)} />
              {isAuthpassword ? getPasswordFeedback() : null}
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                style={style.viewicon}
                onPress={() => setShowPassword(!showPassword)}
              />
            </View>


            <View style={{ flex: 1 }}>

              <TouchableOpacity style={style.countryDropdownContainer} onPress={toggleModal} >
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <Image
                    source={{ uri: `${Image_Base_Url}/flags/${selectedItem ? selectedItem.flag : defaultCountryValue.flag}` }}
                    style={style.flagimg}
                  />
                  <Text style={style.dropdownText}>{selectedItem ? selectedItem.label : defaultCountryValue.label}</Text>
                </View>

                <Icon name="caret-down" size={responsiveFontSize(2)} style={style.dropdownIcon} />
              </TouchableOpacity>
              {/* Render the country dropdown */}
           
                <CountryDropdown
                onclose={toggleModal}
                togglevisible={isCountryDropdownVisible}
                  onSelectCountry={(item) => {
                    handleCountrySelect(item);
                    setCountryDropdownVisible(false);
                  }}
                />

            </View>





          <View style={style.registerbutton}>
            <AgreeCheckbox label="I agree to the Terms and Conditions" onChange={handleCheckboxChange} />
            <TouchableOpacity
              onPress={submit}
              disabled={!isAgreed}
              style={{
                paddingVertical: 15,
                paddingHorizontal: 30,
                backgroundColor: isAgreed ? '#00aaf0' : 'gray', // Change color based on the condition
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={style.registertext}>Register Now</Text>
            </TouchableOpacity>
          </View>

          <View style={style.ortextcontainer}>
          <Text style={style.ortext}>-------- or --------</Text>
          </View>
          <View style={style.sighnincontainer}>
            <Text style={style.notamember}>Already have an account ? </Text>
            <TouchableOpacity onPress={navigatelogin}>
              <Text style={style.signintext}>Sign In</Text>
            </TouchableOpacity>

          </View>

      </View>
      <Popup
        visible={modalVisible}
        message={modalMessage}
        closeModal={closeModal}
      />
    </ScrollView >
    </KeyboardAvoidingView>
      </SafeAreaView >
{
  isLoading?(
          <View style = { style.submitloader } >
      <ActivityIndicator animating={isLoading} size="large" color="white" />
          </View>
        ) : null
      }
    </>

  )
}

export default Signup

