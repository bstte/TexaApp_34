import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Dimensions, ActivityIndicator, Image, ImageBackground } from 'react-native';
import Video from 'react-native-video';
import Feather from "react-native-vector-icons/Feather";
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import RNFS from 'react-native-fs';
import { createThumbnail } from 'react-native-create-thumbnail';

const VideoView = ({ videoPath, bottomtitle }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [localVideoPath, setLocalVideoPath] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {
        const checkAndDownloadVideo = async () => {
            const localPath = `${RNFS.DocumentDirectoryPath}/${videoPath}`;

            // Check if the video already exists locally
            const fileExists = await RNFS.exists(localPath);
            if (fileExists) {
                setLocalVideoPath(localPath);
                setLoading(false);
                createVideoThumbnail(localPath);
            } else {
                // Download the video and save it locally
                try {
                    const result = await RNFS.downloadFile({
                        fromUrl: `https://texa.teamwebdevelopers.com/public/chatImage/${videoPath}`,
                        toFile: localPath,
                    }).promise;

                    if (result.statusCode === 200) {
                        setLocalVideoPath(localPath);
                        setLoading(false);
                        createVideoThumbnail(localPath);
                    } else {
                        setIsError(true);
                    }
                } catch (error) {
                    setIsError(true);
                }
            }
        };

        const createVideoThumbnail = async (path) => {
            try {
                const { path: thumbnailPath } = await createThumbnail({ url: `file://${path}` });
                setThumbnail(thumbnailPath);
            } catch (error) {
                console.error('Error creating thumbnail:', error);
                setIsError(true);
            }
        };

        checkAndDownloadVideo();
    }, [videoPath]);

    const togglePlayback = () => {
        setIsPlaying(!isPlaying);
    };

    const handleBuffer = ({ isBuffering }) => {
        setLoading(isBuffering);
    };

    const handleError = () => {
        setLoading(false);
        setIsError(true);
    };

    return (
        <View>
            <TouchableOpacity onPress={togglePlayback} style={styles.thumbnailContainer}>
                {thumbnail ? (
                    <ImageBackground source={{ uri: `file://${thumbnail}` }} style={styles.thumbnail}>
                        <Feather name="play-circle" size={responsiveFontSize(7)} color="white" style={styles.playIcon} />
                    </ImageBackground>
                ) : (
                    <Feather name="video" size={responsiveFontSize(5)} color="white" style={styles.iconPlaceholder} />
                )}
            </TouchableOpacity>
            <Text style={{ color: "black" }}>{bottomtitle}</Text>
            {
                isPlaying && localVideoPath ? (
                    <View style={styles.container}>
                        <Modal
                            visible={isPlaying}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setIsPlaying(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={{ flex: 1, justifyContent: "center", alignSelf: "center", alignItems: "center" }}>
                                    {loading && !isError && (
                                        <ActivityIndicator size="large" color="white" style={styles.loader} />
                                    )}
                                    {isError && (
                                        <Text style={styles.errorText}>Error loading video. Please try again later.</Text>
                                    )}
                                </View>

                                <Video
                                    source={{ uri: `file://${localVideoPath}` }}
                                    style={styles.video}
                                    resizeMode="contain"
                                    onBuffer={handleBuffer}
                                    onLoad={() => setLoading(false)}
                                    paused={!isPlaying}
                                    repeat={true}
                                    onError={handleError}
                                />
                                <TouchableOpacity style={styles.closeButton} onPress={togglePlayback}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                ) : null
            }
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        width: width,
        height: height,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    loader: {
        marginTop: 200,
    },
    thumbnailContainer: {
        backgroundColor: "#39A7FF",
        width: responsiveHeight(30), height: responsiveHeight(20),
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 50,
    },
    iconPlaceholder: {
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
    errorText: {
        color: 'white',
    },
});

export default VideoView;
