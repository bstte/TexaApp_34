import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Image, PermissionsAndroid, Platform, SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import store from './src/Reducer/rootReducer';
import { toastConfig } from './toastConfig';
import NetInfo from '@react-native-community/netinfo';
import SuccessMessage from './src/components/Common/CustomTostMessage';
import firebaseinitialize from './src/components/Common/firebaseinitialize';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);

  // Request permission for notifications
// const requestUserPermission = async () => {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//   }
// };

// Request Android specific permission
// const DefaultRequestPermission = async () => {
//   if (Platform.OS === 'android' && Platform.Version >= 33) {
//     try {
//       const result = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//         {
//           title: 'Notification Permission',
//           message: 'This app needs notification permissions to send you updates.',
//           buttonPositive: 'Allow',
//           buttonNegative: 'Deny',
//         }
//       );

//       if (result === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('Notification permission granted');
//       } else {
//         console.log('Notification permission denied');
//       }
//     } catch (err) {
//       console.warn('Permission request error:', err);
//     }
//   } else {
//     console.log('Notification permission not required for this Android version');
//   }
// };

  useEffect(() => {
    let unsubscribe; // Declare unsubscribe in the outer scope

    const initializeFirebase = async () => {
      try {
        const firebaseApp = await firebaseinitialize();
        // console.log('Firebase initialized successfully:', firebaseApp);
        // Setup listener for FCM messages in the foreground
        unsubscribe = messaging().onMessage(async remoteMessage => {
          // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
          console.log("here leteast data", remoteMessage)
     
        });
        // requestUserPermission()
        // DefaultRequestPermission()



      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };

    initializeFirebase();

    const timeout = setTimeout(() => {
      SplashScreen.hide();
    }, 1000);

    const netInfoSubscription = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Cleanup function
    return () => {
      clearTimeout(timeout);
      netInfoSubscription(); // Call the subscription function to unsubscribe
      if (unsubscribe) {
        unsubscribe(); // Unsubscribe from FCM messages
      }
    };
  }, []);

  const webViewRef = useRef(null);

  return (
    <Provider store={store}>
      <View style={styles.container}>
        {isConnected ? (
          <>
          
            <AppNavigator />
          </>
        ) : (
          <SafeAreaView style={styles.noConnectionContainer}>
            <Text style={styles.connectionStatus}>No Internet Connection</Text>
            <View style={styles.imageContainer}>
              <Image
                source={require('./src/assets/img/No_Internet.jpg')}
                style={styles.image}
              />
            </View>
          </SafeAreaView>
        )}
        <Toast config={toastConfig} />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  connectionStatus: {
    textAlign: 'center',
    padding: 10,
    color: 'white',
    backgroundColor: 'red',
  },
  noConnectionContainer: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default App;