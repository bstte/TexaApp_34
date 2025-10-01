import { View, Text, StyleSheet,TouchableOpacity,Platform } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import ImageResizer from 'react-native-image-resizer';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';

interface ImagePicker{
    title:string
    handelImage:(text:string)=>void
   
}
const CustomImagePicker:React.FC<ImagePicker>= ({handelImage,title}) => {

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

    // here img picker code
    const Camera = async () => {
        try {
            const cameraPermission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA;

            const permissionResult = await request(cameraPermission);

            if (permissionResult === RESULTS.GRANTED) {
                console.log('Camera permission granted');

                const response = await ImagePicker.openCamera({
                    width: 300,
                    height: 400,
                    cropping: true,
                });

                console.log('Image picker response:', response);
                const compressedImage = await compressAndResizeImage(response.path);
                handelImage(compressedImage.uri)
          

            } else {
                console.log('Camera permission denied');
            }
        } catch (error) {
            console.error('Camera Error:', error);
        }
    };
const Gallery = async () => {
        try {
            const response = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
            });

            // const imageBase64 = await imageToBase64(response.path);
            // console.log('here img base64', imageBase64)
            const compressedImage = await compressAndResizeImage(response.path);
            handelImage(compressedImage.uri)
        } catch (error) {
            console.log('Image picking error:', error);
        }
    }




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

const styles=StyleSheet.create({
  imgcontainer:{
        fontSize: responsiveFontSize(2.5), marginVertical:responsiveHeight(1.3),
        marginHorizontal: responsiveHeight(1.2),color: "#333",fontWeight:"500"
    },
    selectedimgcontainer:{
        justifyContent: "center", alignItems: "center", marginBottom: responsiveHeight(1)
    },
    selectedimg:{
        width: responsiveWidth(25), height: responsiveHeight(11), marginLeft:responsiveHeight(1) 
    },
    icon: {
        marginRight: responsiveHeight(1),
    },
})