import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/Api';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native';

import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MessagesList from './MessagesList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleApiError } from '../../Screen/utils/handleApiError';
const pusher = Pusher.getInstance();

const AdminChatPage = ({ route }) => {

  const { user_id, case_id, adminId, item } = route.params;
  // console.log( "admin chant cehkcin",user_id, case_id, adminId, item)
  const [messages, setMessages] = useState([]);
  const [runningmsg, setrunningmsg] = useState('')
  const [runningImage, setrunningImage] = useState<string[]>([]);
  const [RunningselectedDocuments, setRunningSelectedDocuments] = useState<string[]>([]);
  const [page, SetPage] = useState(1);
  const navigation = useNavigation(); // Initialize navigation
  useEffect(() => {

    const AdminChatUpdate = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await api.AdminChatUpdate(case_id, adminId, token)
          // console.log("response", response.data)

        } catch (error) {
          console.log("Update chat error:", error)
        }
      }
    }
    AdminChatUpdate()
    GetChat()

  }, [])

  const GetChat = async () => {
    const token = await AsyncStorage.getItem('token');
    const limit = 100;
    if (token) {
      try {
        const response = await api.GetChat(case_id, token, limit, page)
        if (response.data.success === true) {

          if (Object.keys(response.data.data.data).length !== 0) { // Check if there is any data in the response
            let newData = [...Object.values(response.data.data.data), ...messages];
            // console.log(newData.length)
            // console.log(response.data.data.data)
            setMessages(newData)
            SetPage(page + 1)

          }


        }

      } catch (error) {
        console.log("getchat error:", error)
      }
    }
  }

  useEffect(() => {


    const initializePusher = async () => {
      try {
        await pusher.init({
          apiKey: "59e63fb2ecc998c4680b",
          cluster: "ap2",
          authEndpoint: 'https://texa.teamwebdevelopers.com/pusher/auth',
        });
        await pusher.connect();
        const myChannel = await pusher.subscribe({
          channelName: 'public',
          onEvent: (event: PusherEvent) => {
            const messageData = JSON.parse(event.data);
            if (messageData.case_id === case_id) {
              // console.log("Received message:", messageData);
              const pusermsg = {
                "id": `${messageData.case_id}-${Date.now()}`,
                "sender_id": messageData.sender,
                "receiver_id": messageData.receive,
                "case_id": parseInt(messageData.case_id),
                "message": messageData.message,
                "file": messageData.file,
                "created_date": "",
                "status": 1
              }

           
              setMessages(prevMessages => [...prevMessages, pusermsg]);
              setrunningmsg('')
              setrunningImage([])
              setRunningSelectedDocuments([])
            }
          },
        });
        console.log("Subscribed to channel:", myChannel);
      } catch (error) {
        console.error("Error connecting to Pusher:", error);
      }
    };


    initializePusher();
    return () => {
      pusher.unsubscribe({ channelName: 'public', }); pusher.disconnect();
    };
  }, []);


  const onSendMessage = async (newMessage: string, selectedImages: string[], selectedVideos: string[], selectedDocuments: string[]) => {
    const token = await AsyncStorage.getItem('token');

    setrunningImage(selectedImages.concat(selectedVideos))
    setRunningSelectedDocuments(selectedDocuments)

    setrunningmsg(newMessage)
    if (token) {
      try {
        const sendMsg = new FormData();
        sendMsg.append('receiver_id', user_id);
        sendMsg.append('case_id', case_id);
        sendMsg.append('message', newMessage);

        // Append images
        selectedImages.forEach((imageUri, index) => {
          sendMsg.append(`file_name[${index}]`, {
            uri: imageUri,
            name: `image_${index}.jpg`, // Adjust the file name with a unique identifier
            type: 'image/jpeg', // Adjust the MIME type if needed
          });
        });

        // Append videos
        selectedVideos.forEach((videoUri, index) => {
          sendMsg.append(`file_name[${index}]`, {
            uri: videoUri,
            name: `video_${index}.mp4`, // Adjust the file name with a unique identifier
            type: 'video/mp4', // Adjust the MIME type if needed
          });
        });

        selectedDocuments.forEach((documentUri, index) => {
          sendMsg.append(`file_name[${index}]`, {
            uri: documentUri.uri,
            name: documentUri.name, // Adjust the file name with a unique identifier and appropriate extension
            type: documentUri.type, // Adjust the MIME type if needed
          });
        });

        // console.log("admin Sending data msg:", sendMsg);

        const response = await api.adminsendmsg(sendMsg, token, adminId);
        // console.log("Send message response:", response);
      } catch (error) {
        // Alert.alert("Somthing Wrong Try Again")
        handleApiError(error,"chat eror")
        setrunningmsg('')
        setrunningImage([])
        setRunningSelectedDocuments([])
        console.log("Send message error:", error);
      }
    } else {
      console.log("Token not available");
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
  
          <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ justifyContent: "center", alignSelf: "center", marginRight: 15, marginLeft: 5 }}>
              <Icon name="arrow-back" size={responsiveHeight(3.5)} color="white" />
            </TouchableOpacity>
            <View style={styles.profile}>
              <TouchableOpacity>
                 {item.profile_photo_path ? (
                  <Image
                    source={{ uri: `${item.profile_photo_path}` }}
                    style={styles.image}
                  />
                ) : (
                  <Image
                    source={require('../../assets/img/default_profile.jpg')}
                    style={styles.image}
                  />
                )}
                {/* <Image style={styles.image} source={require('../../assets/img/default_profile.jpg')} /> */}
              </TouchableOpacity>

              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.username}>{item.name}</Text>
                <Text style={styles.onlineStatus}>Online</Text>
              </View>
            </View>
          </View>

          <MessagesList
            messages={messages}
            onSendMessage={onSendMessage}
            userId={user_id}
            runningmsg={runningmsg}
            runningImage={runningImage}
            RunningselectedDocuments={RunningselectedDocuments}
            onReachTop={GetChat} // Pass the function as a prop
          />
       

    </SafeAreaView>
  )
}

export default AdminChatPage

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: '#39A7FF',
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(1.3)
  },

  profile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  image: {
    height: 50,
    width: 50,
    borderRadius: 100,
    marginRight: responsiveWidth(2.8)
  },

  username: {
    color: '#fff',
    fontSize: responsiveFontSize(2.5),
    fontWeight: "500",
  },

  onlineStatus: {
    color: '#fff',
    fontSize: responsiveFontSize(1.9),
  },
})