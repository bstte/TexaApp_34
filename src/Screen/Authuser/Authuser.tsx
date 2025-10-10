import { View, Text, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import api from '../../api/Api';
import { setUser } from '../../Reducer/slices/userSlice';
import { AxiosError } from 'axios';
import messaging from '@react-native-firebase/messaging';
import NavigationService from '../../navigation/NavigationService';


interface authuser {
  navigation: any
}
const Authuser: React.FC<authuser> = ({ navigation }) => {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  const dispatch = useDispatch()
  React.useEffect(() => {
    checkLoginStatus();
  }, []);


  const NotificationListeners = () => {

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // console.log('Message handled in the background!', remoteMessage.data);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      // console.log("app open time on backgrond state", remoteMessage)
      handleNotificationNavigation(remoteMessage?.data);
        })

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        // console.log("Notification caused app to open from quite state", remoteMessage.data)
        handleNotificationNavigation(remoteMessage?.data);      }
    })


  }


 
  // 🔁 Handle Navigation based on notification payload
  const handleNotificationNavigation = (data: any) => {
    if (!data) return;

    const {
      user_id,
      case_id,
      sender_id,
      receiver_id,
      sender_name,
      sender_profile,
      user_name,
      user_profile,
    } = data;

    if (sender_id?.toLowerCase().startsWith('admin')) {
      // console.log("➡️ Navigating to AdminChat (user side)");
      NavigationService.navigate('AdminChat', {
        user_id,
        case_id,
        adminId: sender_id,
        item: {
          name: sender_name || 'Unknown',
          profile_photo_path: `https://texa.teamwebdevelopers.com/public/images/user/${sender_profile}` || '',
        },
      });
    } else {
    //   console.log("➡️ Navigating to AdminChatPage (admin side)", data 
    //  );
      NavigationService.navigate('AdminChatPage', {
        user_id:sender_id,
        case_id,
        adminId: receiver_id,
        item: {
          name: sender_name || 'Unknown',
          profile_photo_path: `https://texa.teamwebdevelopers.com/public/images/user/${sender_profile}` || '',
        },
      });
    }
  };

  const checkLoginStatus = async () => {

    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        // setModalVisible(true)
        const response = await api.get_user(token)
        if (response.data.status === "success") {
          setModalVisible(false)
          NotificationListeners();
          dispatch(setUser(response.data.user))
         
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
          // navigation.navigate('Home');
        }
      } catch (error) {
        // Alert.alert("Somthing Wrong")
        setModalVisible(true)
        checkLoginStatus()
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          if (axiosError.response.data.message === "Unauthenticated.") {
            await AsyncStorage.removeItem('token');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
            // navigation.navigate('Login');
          }

        }
      }

    } else {
      setModalVisible(false)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  return (
    <View style={{ width: "100%", height: "100%", justifyContent: "center", backgroundColor: "#00aaf0" }}>
      {modalVisible ? (
        <Modal
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => console.log()}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <View>
                <ActivityIndicator size={'large'} color={"#00aaf0"} />
              </View>

              <Text style={{ alignSelf: "center", fontSize: 18, marginLeft: 30 }}>Authenticate </Text>

            </View>
          </View>


        </Modal>
      ) : null}
    </View>
  );
};

export default Authuser;


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row"
  },

})