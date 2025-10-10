import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Image, Keyboard, Modal, Platform, ProgressBarAndroid, ScrollView, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { TextInput, TouchableOpacity, View } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import ImagePicker from 'react-native-image-crop-picker';
import Message from "./Message.tsx";
import ImageResizer from "react-native-image-resizer";
import Video from 'react-native-video';
import DocumentPicker from "react-native-document-picker";
import FileViewer from 'react-native-file-viewer';
// import { ErrorMessage } from "./CustomTostMessage";
import RNFetchBlob from 'rn-fetch-blob';
// import CustomMultipleImagemodal from "./CustomMultipleImagemodal";


interface MessagesList {
    messages: any[],
    onSendMessage: (newMessage: any, selectedImages: any, selectedVideos: any, selectedDocuments: any) => void,
    userId: number,
    runningmsg: string,
    onReachTop: any,
    runningImage: any,
    RunningselectedDocuments: any
}

const MessagesList: React.FC<MessagesList> = ({ messages, onSendMessage, userId, runningmsg, onReachTop, runningImage, RunningselectedDocuments }) => {
    const [textmessage, setTextMessage] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
    const [docModalVisible, setdocModalVisible] = React.useState(false)

    const [isImageModalVisible, setImageModalVisible] = React.useState(false)

    const handleSendMessage = () => {


        onSendMessage(textmessage, selectedImages, selectedVideos, selectedDocuments);
        setTextMessage("");
        setSelectedImages([])
        setSelectedVideos([])
        setSelectedDocuments([])
    };
    const compressAndResizeImage = async (imagePath) => {
        const compressedImage = await ImageResizer.createResizedImage(
            imagePath,
            200, // Set your desired maximum width
            200, // Set your desired maximum height
            'JPEG', // Image format
            50, // Image quality (adjust as needed)
            0 // Image rotation (0, 90, 180, or 270)
        );

        return compressedImage;
    };
    const takeImage = async () => {
        try {
            const image = await ImagePicker.openCamera({ width: 300, height: 300 });
            const compressedImage = await compressAndResizeImage(image.path);
            setdocModalVisible(false)
            setSelectedImages([compressedImage.uri])
            // setSelectedImages([image.path]); // Set the selected image path
        } catch (error) {
            console.log("Error capturing image:", error);
        }
    };


    const selectedImage = async () => {
        let imageList: string[] = [];
        let videoList: string[] = [];
        try {
            const media = await ImagePicker.openPicker({
                multiple: true,
                waitAnimationEnd: false,
                includeExif: true,
                compressImageQuality: 0.8,
                maxFiles: 10,
                mediaType: 'any', // Allow both images and videos
            });

            media.forEach(item => {
                if (item.path.endsWith('.mp4')) {
                    videoList.push(item.path);
                } else {
                    imageList.push(item.path);
                }
            });
            handledoc()
            setSelectedImages(imageList);
            setSelectedVideos(videoList);
        } catch (error) {
            console.error('Gallery Error:', error);
        }
    };




    // const sortedMessages = [...messages].sort(
    //     (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    // );
    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    const selectDocuments = async () => {
        try {
            const pickedDocuments = await DocumentPicker.pick({
                allowMultiSelection: true,
                type: [
                    DocumentPicker.types.doc,
                    DocumentPicker.types.pdf,
                    DocumentPicker.types.xlsx,
                    DocumentPicker.types.docx
                ],
            });

            handledoc()

            setSelectedDocuments(pickedDocuments);


        } catch (e) {
            console.error('Error selecting documents:', e);
        }
    };

    const handledoc = () => {
        setdocModalVisible(!docModalVisible)
    }


    const truncatePlaceholder = (maxLength: number): string => {
        const text = 'Type ...'
        if (text?.length > maxLength) {
            return text.slice(0, maxLength + 3) + '...';
        }
        return text;
    };
    const maxLength = 25;


    const displayMessage = ({ item: message }) => (
        <Message
            key={message.id}
            time={message.created_date}
            isRight={parseInt(message.sender_id)}
            message={message}
        />
    );



    const cancelImage = () => {
        setSelectedImages([])
    }

    const handleshopimages = () => {
        setImageModalVisible(!isImageModalVisible)
    }
    const handleDeleteImage = (indexToRemove) => {
        setSelectedImages((prevImages) =>
            prevImages.filter((image, index) => index !== indexToRemove)
        );
        setSelectedVideos((prevVideos) =>
            prevVideos.filter((video, index) => index !== indexToRemove - selectedImages.length)
        );
    };

    const Opendocfile = async (uri, name) => {

        await FileViewer.open(uri, { displayName: name });
    }
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            (e) => setKeyboardHeight(e.endCoordinates.height)
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => setKeyboardHeight(0)
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);


    return (
        <>
            <View style={{ flex: 1, backgroundColor: "white" }}>


                <FlatList
                    // ref={flatListRef}

                    data={sortedMessages}
                    renderItem={displayMessage}
                    keyExtractor={(item, index) => `${item.id}-${index}`}

                    inverted contentContainerStyle={{ flexDirection: 'column-reverse' }}
                    onEndReached={() => {
                        console.log('onend reach')
                        onReachTop()
                    }}
                    onEndReachedThreshold={0.5}
                />
                {
                    runningmsg && runningImage.length === 0 ? (
                        <View >
                            <View style={{ backgroundColor: "#00aaf0", alignSelf: "flex-end", paddingVertical: 7, paddingHorizontal: 8, borderRadius: 5, marginHorizontal: 10, maxWidth: responsiveWidth(70) }}>
                                <Text style={{ color: "white", }}>{runningmsg}</Text>


                            </View>
                            <View style={{ alignSelf: "flex-end", marginHorizontal: 10 }}>
                                <Text style={{ alignSelf: "flex-end", color: "black", marginHorizontal: 10 }}>Sending ...</Text>
                                <ProgressBarAndroid styleAttr="Horizontal" />

                            </View>
                        </View>
                    ) : null
                }
                {selectedDocuments.length > 0 ? (
                    <View style={styles.documentContainer}>
                        {selectedDocuments.map((document, index) => (
                            <TouchableOpacity key={index} style={styles.documentItem} onPress={() => Opendocfile(document.uri, document.name)}>
                                <Text style={styles.documentName}>{document.name}</Text>
                                <Text style={styles.documentSize}>{(document.size / 1024).toFixed(2)} KB</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    RunningselectedDocuments.length > 0 ? (
                        <View style={styles.documentContainer}>
                            {RunningselectedDocuments.map((document, index) => (
                                <View key={index}>
                                    <TouchableOpacity style={[styles.documentItem, { justifyContent: "flex-end" }]} onPress={() => Opendocfile(document.uri, document.name)}>
                                        <Text style={styles.documentName}>{document.name}</Text>
                                        <Text style={styles.documentSize}>{(document.size / 1024).toFixed(2)} KB</Text>
                                    </TouchableOpacity>
                                    <View style={{ alignSelf: "flex-end", marginHorizontal: 10 }}>
                                        <Text style={{ alignSelf: "flex-end", color: "black", marginHorizontal: 10 }}>Sending ...</Text>
                                        <ProgressBarAndroid styleAttr="Horizontal" />

                                    </View>
                                </View>


                            ))}
                        </View>
                    ) : null
                )}
                <View style={styles.inputcontainer}>




                    {selectedImages.length > 0 || selectedVideos.length > 0 ? (
                        <View style={{}}>

                            <FlatList
                                data={selectedImages.concat(selectedVideos)}
                                renderItem={({ item, index }) => (
                                    selectedVideos.length > 0 ? (
                                        <View style={styles.imageContainer}>
                                            <Video
                                                source={{ uri: item }}
                                                style={{
                                                    width: responsiveWidth(30),
                                                    height: responsiveHeight(15),
                                                    margin: 5,
                                                    borderRadius: 10,
                                                }}
                                                resizeMode="cover"
                                                paused={false}
                                            />
                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={() => handleDeleteImage(index)}
                                            >
                                                <Text style={styles.deleteButtonText}>X</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={styles.imageContainer}>
                                            <Image
                                                source={{ uri: item }}
                                                style={{
                                                    width: responsiveWidth(30),
                                                    height: responsiveHeight(15),
                                                    margin: 5,
                                                    borderRadius: 10,
                                                }}
                                                resizeMode="cover"
                                            />
                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={() => handleDeleteImage(index)}
                                            >
                                                <Text style={styles.deleteButtonText}>X</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                            />


                        </View>

                    ) : (
                        <View style={{ flexDirection: "row" }}>

                            {runningImage.length > 0 ? (
                                <FlatList
                                    data={runningImage}
                                    renderItem={({ item, index }) => (
                                        <View key={index} style={{ flex: 1, alignSelf: "flex-end" }}>
                                            <Image
                                                source={{ uri: item }}
                                                style={{
                                                    width: responsiveWidth(50),
                                                    height: responsiveHeight(30),

                                                    borderRadius: 10,
                                                }}
                                                resizeMode="cover"
                                            />
                                            <Text style={{ color: "black" }}>Sending ...</Text>
                                            <ProgressBarAndroid styleAttr="Horizontal" />
                                        </View>
                                    )}
                                />

                            ) : null

                            }



                        </View>

                    )

                    }





                </View>

            </View>
            <View style={[styles.inputView, { marginBottom: keyboardHeight }]}>
                <View style={{ position: 'relative' }}>
                    <TextInput
                        multiline
                        numberOfLines={2}
                        style={[
                            styles.inputText,
                            {
                                width:
                                    textmessage === '' && selectedImages.concat(selectedVideos).length === 0 && selectedDocuments.length === 0
                                        ? responsiveWidth(91)
                                        : responsiveWidth(81),
                                paddingRight: responsiveHeight(
                                    textmessage === '' && selectedImages.concat(selectedVideos).length === 0 && selectedDocuments.length === 0 ? 9 : 13
                                ), // Adjust the padding based on the presence of icons
                            },
                        ]}
                        value={textmessage}
                        cursorColor="#3154e0"
                        onChangeText={(textmessage) => setTextMessage(textmessage)}
                        placeholderTextColor="#787a7c"
                        placeholder={truncatePlaceholder(maxLength)}
                    />
                </View>
                <TouchableOpacity
                    onPress={handledoc}
                    style={{
                        position: 'absolute',
                        right:
                            textmessage === '' && selectedImages.concat(selectedVideos).length === 0 && selectedDocuments.length === 0
                                ? responsiveHeight(9)
                                : responsiveHeight(16),
                        top: 12,
                    }}>
                    <Entypo name={'attachment'} size={responsiveFontSize(3.4)} color={"#000"} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={takeImage}
                    style={{
                        position: 'absolute',
                        top: 12,
                        right:
                            textmessage === '' && selectedImages.concat(selectedVideos).length === 0 && selectedDocuments.length === 0
                                ? responsiveHeight(3)
                                : responsiveHeight(10),
                    }}>
                    <FontAwesome name={'camera'} size={responsiveFontSize(3.4)} color={"#000"} />
                </TouchableOpacity>
                {textmessage !== '' || selectedImages.concat(selectedVideos).length !== 0 || selectedDocuments.length > 0 ? (
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                        <FontAwesome name={'send'} size={24} color="#fff" style={styles.icon} />
                    </TouchableOpacity>
                ) : null}
            </View>


            <Modal
                animationType="slide"
                transparent={true}
                visible={docModalVisible}
                onRequestClose={() => setdocModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={handledoc}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                onPress={selectedImage}
                                style={styles.row}>
                                <Entypo name={'attachment'} size={responsiveFontSize(3.4)} color={"#000"} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.row} onPress={takeImage}>
                                <FontAwesome name={'camera'} size={responsiveFontSize(3.4)} color={"#000"} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.row} onPress={selectDocuments}>
                                <FontAwesome name={'file-pdf-o'} size={responsiveFontSize(3.4)} color={"#000"} />
                            </TouchableOpacity>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </>

    );
};

export default MessagesList;

const styles = StyleSheet.create({
    container: {
        paddingVertical: responsiveWidth(1),
        marginVertical: responsiveWidth(1),
    },
    mediaItem: {
        width: responsiveWidth(30),
        height: responsiveHeight(15),
        margin: 5,
        borderRadius: 10,
    },
    messageContainer: {
        backgroundColor: '#dbee28',
        maxWidth: "80%",
        alignSelf: "flex-end",
        flexDirection: "row",
        borderRadius: 15,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        textAlign: 'justify',
        paddingTop: 5,
        paddingBottom: 10,
    },

    messageView: {
        maxWidth: "80%",
    },

    timeView: {
        justifyContent: "flex-end",
        paddingLeft: 10,
    },

    message: {
        color: "#000",
        alignSelf: "flex-start",
        fontSize: 15,
    },

    time: {
        color: "#000",
        alignSelf: "flex-end",
        justifyContent: 'flex-end',
        fontSize: 10,
    },

    inputcontainer: {
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: responsiveWidth(1.3),
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },

    inputView: {
        flexDirection: "row",
        marginRight: 7,
        borderRadius: 30,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 7
    },

    inputText: {
        paddingLeft: responsiveWidth(5),

        height: responsiveHeight(7),
        fontSize: responsiveFontSize(2),
        marginHorizontal: responsiveHeight(0.2),
        // backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : 'white',
        borderColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
        borderWidth: 1,
        alignSelf: "center",
        // elevation: 3,
        borderRadius: 30,
        marginBottom: 5,
        color: "#000",
    },

    inputicon: {
        position: "absolute",
        right: responsiveHeight(2),

        top: responsiveHeight(-1.5)
    },

    attachicon: {
        position: "absolute",
        right: responsiveHeight(4),
        top: responsiveHeight(-1.5),
        color: "#000",
        fontSize: 17


    },

    inputField: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#878787',
        flex: 1,
        marginRight: 7,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "space-between",
    },

    sendButton: {
        backgroundColor: '#39A7FF',
        borderRadius: 100,
        alignSelf: "center",
        marginLeft: 5
    },

    icon: {
        position: 'relative',
        height: 50,
        width: 50,
        left: 11,
        top: 12,
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    imageContainer: {
        marginRight: 10,
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: '#000',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 20,
        position: "absolute",
        top: -4,
        right: -6,

    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,

    },
    documentContainer: {
        flexDirection: 'column',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    documentItem: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 5,
    },
    documentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#000"
        // marginRight: 10,
    },
    documentSize: {
        fontSize: 14,
        color: '#000',

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
        marginTop: 10,
        // backgroundColor:"red",
        padding: 15,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 20

    },
    text: {
        fontSize: 18,
    },
    closeButton: {
        backgroundColor: 'red',
        padding: 15,
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },

});