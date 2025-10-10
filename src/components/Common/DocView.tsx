import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FileViewer from 'react-native-file-viewer';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import RNFetchBlob from 'rn-fetch-blob';
import Loader from '../Loader';

const DocView = ({ docPath, name ,bottomtitle}) => {
    const [IsLoadin,SetIsLoading]=useState(false)
   
    const viewDocument = async (docPthaUrl) => {
        try {
            SetIsLoading(true)
            const docUrl = `https://texa.teamwebdevelopers.com/public/chatImage/${docPthaUrl}`;
            // console.log("doc url",docUrl)
            const { config, fs } = RNFetchBlob;
            const { DocumentDir } = fs.dirs;
    
            const downloadDir = `${DocumentDir}/Downloads`;
            const fileName = docPthaUrl.split('/').pop();
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

    return (
        <>
            <TouchableOpacity onPress={() => viewDocument(docPath)} style={styles.container}>
                <Text style={styles.name}>{name}</Text>
                <FontAwesome5 name={'file-pdf'} size={responsiveFontSize(5)} color={"white"} style={styles.Icon} />
            </TouchableOpacity>
            <Text style={{color:"black"}}>{bottomtitle}</Text>
            <Loader loading={IsLoadin} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#39A7FF", 
        width: 120, 
        height: 120 
    },
    Icon:{
        justifyContent: "center", 
        alignSelf: "center", 
        marginTop: 20 
    },
    name:{
        color: "white", 
        justifyContent: "center", 
        alignSelf: "center", 
        marginTop: 9, 
        fontSize: 17, 
        fontWeight: "bold" 
    }
});

export default DocView;
