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
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Linking,
  KeyboardAvoidingView,

} from 'react-native';
import styles from './Styles';
import AgreeCheckbox from '../../components/AgreeCheckbox';
import Popup from '../../components/Popup';
import api from '../../api/Api';
import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../../Reducer/slices/userSlice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../components/Loader';
import SuccessMessage from '../../components/Common/CustomTostMessage';
import messaging from '@react-native-firebase/messaging';



interface loginprops {
  navigation: any
}

const Login: React.FC<loginprops> = (props) => {
  // const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // here required error
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [remember, setIsRemember] = React.useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checksaveCredentials();
      await requestUserPermission();
    };
    init();
  }, []);


  const checksaveCredentials = async () => {
    try {
      const saveCredentials = await AsyncStorage.getItem("saveCredentials");
      if (saveCredentials) {
        const { email, password } = JSON.parse(saveCredentials);
        setEmail(email);
        setPassword(password)
      }

    } catch (error) {
      console.log(error)
    }

  }
  const dispatch = useDispatch();
  const navigatesignup = () => {
    props.navigation.navigate("Signup");
  }

  // here email validatioin code
  const isEmailValid = (email: string): boolean => {
    // Email validation regex pattern
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
  };


  // Get the device token
  const getDeviceToken = async () => {
    let deviceToken = '';
    try {
      deviceToken = await messaging().getToken();
    } catch (error) {
      console.error('Error getting device token:', error);
    }
    return deviceToken;
  };


  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        Alert.alert(
          'Notification Permission',
          'Please allow notifications from settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => Linking.openURL('app-settings:'),
            },
          ]
        );
      }
    } else {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Notification Disabled',
            'Please enable notifications from settings.',
            [
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        }
      }
    }
  }
  const handleLogin = async () => {
    const deviceToken = await getDeviceToken();
    // console.log("devie token",deviceToken);
    if (email === '') {
      setModalMessage('Email is required');
      setModalVisible(true);
      return
    } else if (!isEmailValid(email)) {
      setModalMessage('Invalid email format');
      setModalVisible(true);
      return;
    }

    if (password === '') {
      setModalMessage('Password is required');
      setModalVisible(true);
      return
    }

    const credentials = {
      email: email,
      password: password,
      device_token: deviceToken ? deviceToken : "IosdeviceToken",
    }

    try {
      setIsLoading(true)

      // here check remember auth
      if (remember) {
        const saveCredentials = JSON.stringify(credentials);
        await AsyncStorage.setItem("saveCredentials", saveCredentials);

      } else {
        await AsyncStorage.removeItem("saveCredentials")

      }





      // here check login credential
      const response = await api.login(credentials);

      if (response.data.success === true) {

        // dispatch(setUser(response.data.data.user))
        const token = response.data.data.token;
        const userresponse = await api.get_user(token)
        if (userresponse.data.status === "success") {
          SuccessMessage({
            message: 'Login successful'
          })
          dispatch(setUser(userresponse.data.user))
          setIsLoading(false)
          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("userId", `${response.data.data.user.id}`);


          props.navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });

        }

      }

    } catch (error) {
      setIsLoading(false)
      // handleApiError(error, "login War!:")


      const axioserror = error as AxiosError;
      if (axioserror.response && axioserror.response.status === 400) {
        setModalMessage(axioserror.response.data.message);
        setModalVisible(true);
        return

      } else if (axioserror.response && axioserror.response.status === 404) {
        setModalMessage(axioserror.response.data.message);
        setModalVisible(true);
        return
      }

    }
   
  };


  const onPressForgotPassword = () => {
    props.navigation.navigate("ForgotPassword")
  };

  // here remember me function value set function
  const handleCheckboxChange = (value: boolean) => {
    setIsRemember(value);
  };

  // for close popup modal
  const closeModal = () => {
    setModalVisible(false);
  };



  // here user  login code

  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <ScrollView keyboardShouldPersistTaps="handled" >
            <View style={{ alignItems: "center" }}>

              <Text style={styles.title}>T E X A P</Text>
              <Text style={styles.title2}>Login to your account</Text>
            </View>

            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                autoCapitalize='none'
                autoCorrect={false}
                value={email}
                placeholder="Enter Your Email"
                placeholderTextColor={"#787a7c"}
                onChangeText={(email) => setEmail(email)} />
            </View>
            <View style={styles.inputView}>
              <TextInput placeholder="Enter Your Password" style={styles.psswordtextinput}
                autoCapitalize='none'
                autoCorrect={false}
                value={password}
                placeholderTextColor={"#787a7c"}
                secureTextEntry={!showPassword}
                onChangeText={(password) => setPassword(password)} />
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                style={styles.icon}
                onPress={() => setShowPassword(!showPassword)}
              />
            </View>
            <View style={styles.forgotmainContainer}>

              <AgreeCheckbox label="Remember me" onChange={handleCheckboxChange} />
              <TouchableOpacity
                style={styles.forgotContainer}
                onPress={onPressForgotPassword}>
                <Text style={styles.forgotAndSignUpText}>Forgot Password?</Text>
              </TouchableOpacity>



            </View>


            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginBtn}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <View style={{ alignItems: "center", }}>
              <Text style={styles.ortext}>------- or -------</Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 17, justifyContent: "center", width: "100%" }}>
              <Text style={styles.notamember}>Not a member ?</Text>
              <TouchableOpacity onPress={navigatesignup}>
                <Text style={{ color: "#00aaf0", fontSize: 17 }}>  Create an account </Text>
              </TouchableOpacity>

            </View>

            <Popup
              visible={modalVisible}
              message={modalMessage}
              closeModal={closeModal}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Loader loading={isLoading} />

    </>

  );
};

export default Login;