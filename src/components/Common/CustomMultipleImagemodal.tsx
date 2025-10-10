import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, PermissionsAndroid, PermissionStatus } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import ImageResizer from 'react-native-image-resizer';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import { TouchableWithoutFeedback } from 'react-native';
import { themeFamily } from '../../theme';
interface ImageModal {
  togglevisible: any;
  handelMultipleImage: any;
  onclose: any;
}

const CustomMultipleImagemodal: React.FC<ImageModal> = ({ togglevisible, onclose, handelMultipleImage }) => {

  const toggleModal = () => {
    onclose(false);
  };
  const compressAndResizeImage = async (imagePath) => {
    const compressedImage = await ImageResizer.createResizedImage(
      imagePath,
      800, // Set your desired maximum width
      800, // Set your desired maximum height
      'JPEG', // Image format
      100, // Image quality (adjust as needed)
      0 // Image rotation (0, 90, 180, or 270)
    );

    return compressedImage;
  };

  const selectImageFromCamera = async () => {
    try {

      const cameraPermission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA;

      const permissionResult = await request(cameraPermission);

      if (permissionResult === RESULTS.GRANTED) {
        console.log('Camera permission granted');

        const response = await ImagePicker.openCamera({
          multiple: false, // Set multiple to false to select only one image
        });

        console.log('Image picker response:', response);
        if (response) {

          const compressedImage = await compressAndResizeImage(response.path);
          handelMultipleImage(compressedImage.uri)
        }

      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.error('Camera Error:', error);
    }
  };



  const selectImageFromGallery = async () => {
    let imagelist: string[] = [];


    // const hasGalleryPermission = await requestGalleryPermission();
    // if (hasGalleryPermission) {
    try {
      const response = await ImagePicker.openPicker({
        multiple: true,
        waitAnimationEnd: false,
        includeExif: true,
        compressImageQuality: 0.8,
        maxFiles: 10,
        mediaType: 'photo',
      });
      if (response && response.length > 0) {
        await Promise.all(response.map(async (image) => {
          const compressedImage = await compressAndResizeImage(image.path);
          imagelist.push(compressedImage.uri);
        }));
      }
      //   setSelectedImages((prevImages) => [...prevImages, ...imagelist]);
      handelMultipleImage(imagelist)

    } catch (error) {
      console.error('Gallery Error:', error);
    }
    // }else{
    //   console.log('Gallery permission not granted. Unable to pick images.');
    // }

  };


  return (
    <View style={styles.container}>
      <Modal
        visible={togglevisible}
        animationType="slide"
        transparent={true}

      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <View style={styles.separator} />

              <TouchableOpacity onPress={selectImageFromCamera} style={styles.cameraContainer}>
                <Icon color="#00aaf0" name='camera' size={33} style={{ width: 40 }} />
                <Text style={styles.text}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={selectImageFromGallery} style={styles.GalleryContainer}>
                <Icon color="#00aaf0" name='image' size={33} style={{ width: 40 }} />
                <Text style={styles.text}>Select From Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                <Text style={{ color: "#00aaf0", fontSize: responsiveFontSize(2), fontFamily: themeFamily.fontFamily }}>Close</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default CustomMultipleImagemodal

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: "center",
    justifyContent: "flex-end",
  },
  modal: {
    width: responsiveWidth(100),
    height: responsiveHeight(30),
    backgroundColor: 'white',
    paddingHorizontal: responsiveHeight(2.3),
    borderTopLeftRadius: responsiveHeight(2),
    borderTopRightRadius: responsiveHeight(2),
    paddingBottom: responsiveHeight(2.3),
  },
  separator: {
    width: '17%',
    height: responsiveHeight(0.4),
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#ccc',

    marginTop: 10,
    marginBottom: 20,
  },
  cameraContainer: {
    flexDirection: "row", alignItems: "center", marginBottom: 14
  },
  GalleryContainer: {
    flexDirection: "row", alignItems: "center"
  },
  text: {
    fontSize: 18, color: "#000", fontFamily: themeFamily.fontFamily
  },
  closeButton: {
    marginTop: responsiveHeight(3.2),
    padding: responsiveHeight(1.3),
    borderWidth: 1,
    borderRadius: responsiveHeight(0.5),
    alignItems: "center",
    borderColor: '#ccc',
  },
})