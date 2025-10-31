// import { View, Text, ActivityIndicator, PermissionsAndroid } from 'react-native'
// import React, { useEffect } from 'react'
// import WebView from 'react-native-webview'

// const VideoCall = () => {

//     useEffect(() => {
//         requestPermissions()
//     }, [])

//     const requestPermissions = async () => {
//         try {
//             const granted = await PermissionsAndroid.requestMultiple([
//                 PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//                 PermissionsAndroid.PERMISSIONS.CAMERA,
//             ]);

//             if (
//                 granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED &&
//                 granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
//             ) {
//                 console.log('Microphone and camera permissions granted');
//             } else {
//                 console.log('Microphone and camera permissions denied');
//             }
//         } catch (error) {
//             console.log('Error requesting permissions: ', error);
//         }
//     };
//     return (

//         <View style={{ height: '100%', width: '100%' }}>
//             <WebView

//                 source={{ uri: 'https://texa.teamwebdevelopers.com/joinMeeting/SIJ91xiS' }}
//                 startInLoadingState={true}
//                 renderLoading={() => (
//                     <ActivityIndicator
//                         color='black'
//                         size='large'
//                     />
//                 )}
//                 scalesPageToFit={true}
//                 javaScriptEnabled={true}
//                 showsVerticalScrollIndicator={true}
//                 mediaPlaybackRequiresUserAction={false} // Allow autoplay of media elements
//                 allowFileAccess={true} // Enable file access for microphone permission
//                 allowUniversalAccessFromFileURLs={true} // Enable universal access from file URLs
//                 allowFileAccessFromFileURLs={true} // Allow file access from file URLs
//             />
//         </View>
//     )
// }

// export default VideoCall