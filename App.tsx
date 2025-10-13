import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Image, PermissionsAndroid, Platform, SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import store from './src/Reducer/rootReducer';
import { toastConfig } from './toastConfig';
import NetInfo from '@react-native-community/netinfo';
import firebaseinitialize from './src/components/Common/firebaseinitialize';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let unsubscribe; 
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


  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        await firebaseinitialize();
  
      } catch (error) {
        console.error('❌ Error initializing Firebase:', error);
      }
    };
  
    initializeFirebase();
  }, []);

  
  

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