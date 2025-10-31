import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import ImageResizer from 'react-native-image-resizer';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { themeFamily } from '../../theme';

// Android Photo Picker (for Android 13+)
import { NativeModules } from 'react-native';
const { RNPhotoPickerModule } = NativeModules || {};

interface ImageModal {
  togglevisible: boolean;
  handelMultipleImage: (images: string[] | string) => void;
  onclose: (val: boolean) => void;
}

const CustomMultipleImagemodal: React.FC<ImageModal> = ({
  togglevisible,
  onclose,
  handelMultipleImage,
}) => {
  const toggleModal = () => {
    onclose(false);
  };

  const compressAndResizeImage = async (imagePath: string) => {
    const compressedImage = await ImageResizer.createResizedImage(
      imagePath,
      800,
      800,
      'JPEG',
      90,
      0
    );
    return compressedImage;
  };

  const selectImageFromCamera = async () => {
    try {
      const cameraPermission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA;

      const permissionResult = await request(cameraPermission);

      if (permissionResult === RESULTS.GRANTED) {
        const result = await launchCamera({
          mediaType: 'photo',
          quality: 0.8,
        });

        if (result?.assets && result.assets.length > 0) {
          const compressedImage = await compressAndResizeImage(
            result.assets[0].uri || ''
          );
          handelMultipleImage(compressedImage.uri);
        }
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.error('Camera Error:', error);
    }
  };

  const selectImageFromGallery = async () => {
    try {
      // Android 13+ → use system photo picker
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        if (RNPhotoPickerModule && RNPhotoPickerModule.pickImages) {
          const uris = await RNPhotoPickerModule.pickImages(); // returns array of URIs
          handelMultipleImage(uris);
          return;
        }
      }

      // iOS or older Android → fallback to react-native-image-picker
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 10,
        quality: 0.8,
      });

      if (result?.assets && result.assets.length > 0) {
        const imageUris: string[] = [];
        for (const item of result.assets) {
          if (item.uri) {
            const compressedImage = await compressAndResizeImage(item.uri);
            imageUris.push(compressedImage.uri);
          }
        }
        handelMultipleImage(imageUris);
      }
    } catch (error) {
      console.error('Gallery Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={togglevisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <View style={styles.separator} />

              <TouchableOpacity
                onPress={selectImageFromCamera}
                style={styles.cameraContainer}
              >
                <Icon
                  color="#00aaf0"
                  name="camera"
                  size={33}
                  style={{ width: 40 }}
                />
                <Text style={styles.text}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={selectImageFromGallery}
                style={styles.GalleryContainer}
              >
                <Icon
                  color="#00aaf0"
                  name="image"
                  size={33}
                  style={{ width: 40 }}
                />
                <Text style={styles.text}>Select From Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                <Text
                  style={{
                    color: '#00aaf0',
                    fontSize: responsiveFontSize(2),
                    fontFamily: themeFamily.fontFamily,
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default CustomMultipleImagemodal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  GalleryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#000',
    fontFamily: themeFamily.fontFamily,
  },
  closeButton: {
    marginTop: responsiveHeight(3.2),
    padding: responsiveHeight(1.3),
    borderWidth: 1,
    borderRadius: responsiveHeight(0.5),
    alignItems: 'center',
    borderColor: '#ccc',
  },
});
