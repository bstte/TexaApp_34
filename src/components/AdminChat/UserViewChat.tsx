

import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import Video from 'react-native-video';

import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'rn-fetch-blob';

import Loader from "../Loader";
import VideoView from "../Common/VideoView";
import DocView from "../Common/DocView";


interface Message {
    message: string
    time: string,

}

const UserViewChat: React.FC<Message> = ({ time, message }) => {

    const [IsLoadin,SetIsLoading]=useState(false)
    const viewFullImage = async ({ fullImage }) => {
        try {
            SetIsLoading(true)
            const docUrl = fullImage;
            console.log("doc url",docUrl)
            const { config, fs } = RNFetchBlob;
            const { DocumentDir } = fs.dirs;
    
            const downloadDir = `${DocumentDir}/Downloads`;
            const fileName = fullImage.split('/').pop();
            const filePath = `${downloadDir}/${fileName}`;
    
            // Download the file if it doesn't exist
            const downloadTask = await config({ fileCache: true, path: filePath }).fetch('GET', docUrl);
            SetIsLoading(false)
            // Open the file immediately after initiating the download
            await FileViewer.open(filePath);
    
            // Note: We don't need to await the completion of the download task
    
        } catch (error) {
            if (error && error.message === 'No app associated with this mime type') {
                console.error('No app associated with this MIME type');
                // Handle this error case gracefully, e.g., display a message to the user
            } else {
                console.error('Error opening file:', error);
            }
        }
    };



    const renderFileItem = (fileItem: any, index: number) => {
        switch (fileItem.extention) { // Change from "extension" to "extention"
            case "png":
            case "jpg":
                return (
                    <TouchableOpacity key={index} onPress={() => viewFullImage({ fullImage: `https://texa.teamwebdevelopers.com/public/chatImage/${fileItem.filename}` })}>
                        <Image
                            source={{ uri: `https://texa.teamwebdevelopers.com/public/chatImage/${fileItem.filename}` }}
                            style={{ width: responsiveHeight(20), height: responsiveHeight(30), marginTop: 5, borderRadius: 5 }}
                        />
                    </TouchableOpacity>
                );
            case "webm":
            case "mp4":
                return <VideoView key={index} videoPath={fileItem.filename} />;
            case "pdf":
            case "doc":
            case "docx":
            case "tsx":
            case "xlsX":
                return <DocView key={index} docPath={fileItem.filename} name={getFileTypeName(fileItem.extention)} />;
            default:
                return null;
        }
    };

    const getFileTypeName = (extension: string) => {
        switch (extension) {
            case "pdf":
                return "Pdf File";
            case "doc":
                return "MsWord File";
            case "tsx":
                return "Text Type File";
            case "xlsx":
                return "Excel File";
            case "docx":
                return "MsWord File"
            default:
                return "";
        }
    };


    return (
        <View style={styles.container}>
            <View style={[styles.messageContainer, { alignSelf:  "flex-start" }]}>
                {message.message && message.file.length === 0 ? (
                    <View>
                        <View style={{ backgroundColor: "#efeff4", paddingVertical: 7, paddingHorizontal: 8, borderRadius: 5, maxWidth: responsiveWidth(70) }}>
                            <Text style={[styles.message, { color:"black", }]}>{message.message}</Text>
                           
                        </View>
                      

                        <View style={styles.timeView}>
                            <Text style={styles.time}>{time}</Text>
                        </View>
                    </View>


                ) :
                    null}
                {message &&
                    message.file &&
                    message.file.length > 0 &&
                    message.file.map((fileItem, index) => (
                        <View key={index}>

                            {renderFileItem(fileItem, index)}
                         

                            {index === 0 && message.message && (
                                <View>
                                    <View
                                        style={{
                                            backgroundColor: '#efeff4',
                                            paddingVertical: 7,
                                            paddingHorizontal: 8,
                                            borderRadius: 5,
                                            maxWidth: responsiveHeight(20),
                                        }}>
                                        <Text
                                            style={[
                                                styles.message,
                                                { color:  'black' },
                                            ]}>
                                            {message.message}
                                        </Text>
                                    </View>
                                </View>
                            )}
                            <View style={styles.timeView}>
                                <Text style={styles.time}>{time}</Text>
                            </View>
                        </View>
                    ))}


            </View>
            <Loader loading={IsLoadin} />
        </View>

    );
};

export default UserViewChat

const styles = StyleSheet.create({
    container: {
        paddingVertical: responsiveWidth(1),
        marginVertical: responsiveWidth(1),
    },

    messageContainer: {




        // flexDirection: "row",
        borderRadius: 15,
        paddingHorizontal: 12,
        marginHorizontal: 10,
        textAlign: 'justify',
        paddingTop: 5,
        // paddingBottom: 10,
    },

    timeView: {
        // justifyContent: "flex-end",
        paddingLeft: 10,

    },

    message: {


        fontSize: 16,
    },

    time: {
        fontSize: 10,
        color: "black"
    },
    vid: {
        height: 200,
        width: 300
    },
});
