import { View, Text, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import ImageResizer from 'react-native-image-resizer';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

interface ImagePicker {
    title: string
    handelImage: (text: string) => void

}
const CustomImagePicker: React.FC<ImagePicker> = ({ handelImage, title }) => {

    const compressAndResizeImage = async (imagePath: string) => {
        const compressedImage = await ImageResizer.createResizedImage(
            imagePath,
            200, // max width
            200, // max height
            'JPEG', // format
            70, // quality %
            0, // rotation
        );
        return compressedImage;
    };

    // 📷 CAMERA
    const Camera = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Camera permission denied');
                    return;
                }
            }

            const result = await launchCamera({
                mediaType: 'photo',
                quality: 0.8,
                saveToPhotos: false,
            });

            if (!result.didCancel && result.assets?.length > 0) {
                const uri = result.assets[0].uri!;
                const compressed = await compressAndResizeImage(uri);
                handelImage(compressed.uri);
            }
        } catch (error) {
            console.error('Camera Error:', error);
        }
    };

    // 🖼️ GALLERY
    const Gallery = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                selectionLimit: 1,
                quality: 0.8,
            });

            if (!result.didCancel && result.assets?.length > 0) {
                const uri = result.assets[0].uri!;
                const compressed = await compressAndResizeImage(uri);
                handelImage(compressed.uri);
            }
        } catch (error) {
            console.log('Image picking error:', error);
        }
    };




    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.imgcontainer}>{title}</Text>
            <TouchableOpacity onPress={Camera}>
                <Icon style={styles.icon} color="black" name="camera" size={responsiveHeight(4)} />
            </TouchableOpacity>

            <TouchableOpacity onPress={Gallery}>
                <Icon style={styles.icon} color="black" name="view-gallery" size={responsiveHeight(4)} />
            </TouchableOpacity>

        </View>
    )
}

export default CustomImagePicker

const styles = StyleSheet.create({
    imgcontainer: {
        fontSize: responsiveFontSize(2.5), marginVertical: responsiveHeight(1.3),
        marginHorizontal: responsiveHeight(1.2), color: "#333", fontWeight: "500"
    },
    selectedimgcontainer: {
        justifyContent: "center", alignItems: "center", marginBottom: responsiveHeight(1)
    },
    selectedimg: {
        width: responsiveWidth(25), height: responsiveHeight(11), marginLeft: responsiveHeight(1)
    },
    icon: {
        marginRight: responsiveHeight(1),
    },
})