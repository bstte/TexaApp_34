import firebase from '@react-native-firebase/app';

const firebaseinitialize = () => {
    const RNfirebaseConfig = {
        apiKey: "AIzaSyCj6yDLKb5EJYbqhlLGK08KeHawhkhzlTw",
        authDomain: "texa-app-61ec3.firebaseapp.com",
        projectId: "texa-app-61ec3",
        storageBucket: "texa-app-61ec3.appspot.com",
        messagingSenderId: "476858224533",
        appId: "1:476858224533:web:30cf0eb0ab9e445be8309c",
        measurementId: "G-QTRLFG1PCJ",
        databaseURL: "https://texa-app-61ec3-default-rtdb.firebaseio.com/"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(RNfirebaseConfig);
    } else {
        firebase.app();
    }
}

export default firebaseinitialize;
