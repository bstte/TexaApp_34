import React, { useEffect, useId, useState } from 'react';
import { View, TextInput, StatusBar, TouchableOpacity, Text, ScrollView, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import styles from '../styles';
import CustomHeader from '../../CustomHeader/CustomHeader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios, { AxiosError } from 'axios';
import api from '../../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDropdown from '../../../components/CustomDropdown';
import { MultiSelect } from 'react-native-element-dropdown';
import ImagePicker from 'react-native-image-crop-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImageResizer from 'react-native-image-resizer';
import Popup from '../../../components/Popup';
import {
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { useSelector } from 'react-redux';
import CustomImageModal from '../../../components/CustomImageModal';
import CustomTextInput from '../../../components/CustomTextInput';
import Loader from '../../../components/Loader';
import SuccessMessage, { ErrorMessage } from '../../../components/Common/CustomTostMessage';
interface Props {
  navigation: any,
  route:any
}


const AddRaiseQuery: React.FC<Props> = ({route, navigation }) => {

  const [UserShop, setUserShop] = useState<any[]>([]);
  const [UserEquipment, setEquipment] = useState<any[]>([]);
  const [Userproducts, setUserproducts] = useState<any[]>([]);
  const userData = useSelector((state: any) => state.user.userData)
  const [isFrontImageModalVisible, setFrontImageModalVisible] = React.useState(false)
  const [isBackImageModalVisible, setBackImageModalVisible] = React.useState(false)
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);

  const [ShopName, setShopName] = useState('');
  const [applicationType, setapplicationType] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [querytitle, setquerytitle] = useState('');
  const [querydes, setquerydes] = useState('');
  const [frontBase64Image, setFrontBase64Image] = React.useState<string | null>(null);
  const [backimgBase64, setBackimgBase64] = React.useState<string | null>(null);

  useEffect(() => {
    get_query_shop()
  }, [])


  const get_query_shop = async () => {
    const userId = await AsyncStorage.getItem('userId')
    const token = await AsyncStorage.getItem('token');
    if (token && userId) {
      // console.log("get query data id token",token,userId)
      const response = await api.get_query_shop(userId, token);
      // console.log("here get_query_shop", response.data.data)

      if (response.data.success === true) {
        setUserShop(response.data.data)
      }
    }
  }

  const submit = async () => {
    const userId = await AsyncStorage.getItem('userId');
  
    if (ShopName === '' || selectedProducts.length === 0 || querytitle === '' || querydes === '') {
      ErrorMessage({ message: "All fields are required" });
      return;
    }

    const raisequery = new FormData();
    raisequery.append('user_id', userId);
    raisequery.append('country_id', userData.country_id);
    raisequery.append('shop_id', ShopName);
  
    selectedProducts.forEach((product, index) => {
      raisequery.append(`product_name[${index}]`, product);
    });
  
    raisequery.append('query_title', querytitle);
    raisequery.append('description', querydes);
  
    if (frontBase64Image) {
      raisequery.append('front_image', {
        uri: frontBase64Image,
        name: 'front_image.jpg',
        type: 'image/jpg',
      });
    }
  
    if (backimgBase64) {
      raisequery.append('back_image', {
        uri: backimgBase64,
        name: 'back_image.jpg',
        type: 'image/jpeg',
      });
    }
  
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        ErrorMessage({ message: "Token not found. Please login again." });
        return;
      }
  
      setIsLoading(true);
      console.log("hit api",raisequery)
      const response = await api.query(raisequery, token);
  
      if (response?.data?.status === true) {
        SuccessMessage({ message: response.data.message });
        route.params?.onQueryAdd?.(response.data.data);
        navigation.goBack();
      } else {
        // Handle unexpected false status with message
        ErrorMessage({ message: response?.data?.message || "Something went wrong" });
      }
  
    } catch (error: any) {
      console.log("add equipment error:", JSON.stringify(error, null, 2));
      setIsLoading(false);
  
      if (error.response) {
        const statusCode = error.response.status;
        const responseData = error.response.data;
  
        if (statusCode === 400 && typeof responseData.message === 'object') {
          const { shop_id, description, query_title } = responseData.message;
  
          if (shop_id) {
            setModalMessage("The Shop name field is required");
            setModalVisible(true);
            return;
          }
          if (description) {
            setModalMessage(description);
            setModalVisible(true);
            return;
          }
          if (query_title) {
            setModalMessage(query_title);
            setModalVisible(true);
            return;
          }
        } else {
          ErrorMessage({ message: responseData.message || "Something went wrong on the server." });
        }
      } else if (error.request) {
        // request was made but no response
        ErrorMessage({ message: "Server did not respond. Please try again." });
      } else {
        // Something else happened
        ErrorMessage({ message: "Network error occurred. Please check your connection." });
      }
    } finally {
      setIsLoading(false); // Always reset loading
    }
  };
  
  const shopOption = UserShop.map((shop) => ({
    label: shop.shop_name,
    value: shop.id
  })) || []

  const EquipmetnOption = UserEquipment.map((equipment) => ({
    label: equipment.application_type,
    value: equipment.id
  })) || []


  const ProductOption = Userproducts.map((product) => ({
    label: product.product_name,
    value: product.product_name,
  })) || []

  const handleSelectshop = async (item) => {
    // setIsLoading(true)
    const token = await AsyncStorage.getItem('token');
    const shopId = item.value;
    if (shopId && token) {
      try {
        const response = await api.get_query_equipment(shopId, token);
        if (response.data.success === true) {
         
          // console.log("here equipmetn tye", response.data.data)
          setEquipment(response.data.data)
        }

      } catch (error) {
        setIsLoading(false)
        console.log(error)
      }
    }
    setShopName(item.value);
  };

  const handleSelectequipment = async (item) => {
    // setIsLoading(true);
    const token = await AsyncStorage.getItem('token');
    const shopId = ShopName; // This should be the value of shopName state

    const equipmentId = item.value;

    // console.log("shopId id", shopId)

    // console.log("equipmentId id", equipmentId)

    if (equipmentId && token && shopId) {
      try {
        const response = await api.get_query_product(shopId, equipmentId, token);
        if (response.data.success === true) {
          // setIsLoading(false);
          // console.log("here equipment products type", response.data.data);
          setUserproducts(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    setapplicationType(item.value);
  }

  const closeModal = () => {
    setModalVisible(false);
  }
  const handleTextChange = (newText) => {
    setquerydes(newText);
  };


  const renderMultiSelect = () => {
    if (Userproducts.length > 0) {
      return (
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={ProductOption}
          labelField="label"
          valueField="value"
          placeholder="Select Products"
          value={selectedProducts}
          search
          searchPlaceholder="Search..."
          containerStyle={{
            width: "100%", height: "70%", zIndex: 60,
          }}
          onChange={(selectedItems) => {
            setSelectedProducts(selectedItems);
          }}
          // renderLeftIcon={() => (
          //   <AntDesign
          //     style={styles.icon}
          //     color="black"
          //     name="Safety"
          //     size={20}
          //   />
          // )}
          renderItem={(item) => renderProductItem(item, ProductOption)}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
              <View style={styles.selectedStyle}>
                <Text style={styles.textSelectedStyle}>{item.label}</Text>
                <AntDesign color="red" name="delete" size={17} />
              </View>
            </TouchableOpacity>
          )}
        />
      );
    } else {
      return (
        null
      );
    }
  };
  const renderProductItem = (item, applicationType) => {
    const isSelected = selectedProducts.includes(item.value);

    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: isSelected ? 'green' : 'gray',
            marginRight: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isSelected && <Text style={{color:"#000"}}>✓</Text>}
        </View>
      </View>
    );
  };
  const handlefrontImage = (img) => {
    setFrontBase64Image(img)
  }


  const handleBackImage = (img) => {
    setBackimgBase64(img)
  }

  const handleDeletefrontImage = () => {
    setFrontBase64Image('')
  }

  const handleDeletebackImage = () => {
    setBackimgBase64('')
  }

  const handleFrontImageModalVisible = () => {
    setFrontImageModalVisible(!isFrontImageModalVisible);
  };

  const handleBackImageModalVisible = () => {
    setBackImageModalVisible(!isBackImageModalVisible);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>

        <CustomHeader title="Raise a Query" imgSource={require('../../../assets/img/profile_img.png')} />

        <View style={styles.maincontainer}>

          <ScrollView keyboardShouldPersistTaps="handled">
            <View>

              <CustomDropdown title="Shop Name" data={shopOption} placeholder='Select Shop Name' onSelect={handleSelectshop} />

              <CustomDropdown title='Application Type' data={EquipmetnOption} placeholder='Select Application Type' onSelect={handleSelectequipment} />
              {renderMultiSelect()}
              <CustomTextInput title='Query Title' value={querytitle} placeholder='Query Title' onChangeText={(query) => setquerytitle(query)} keyboardType='default'/>

              <TextInput
                style={styles.textarea}
                placeholder="Describe Your Query"
                multiline={true} // Enables multiline mode
                numberOfLines={4} // Number of lines to display (adjust as needed)
                onChangeText={handleTextChange}
                value={querydes}
                placeholderTextColor={"#787a7c"}
              />

              <TouchableOpacity onPress={handleFrontImageModalVisible} style={styles.ImageContainer}>
                <Text style={{ fontSize: 17, color: "#333" }}>Add Label Image 1</Text>
                <Text style={{ fontSize: 23, color: "#00aaf0" }}>+</Text>
              </TouchableOpacity>
              <View style={styles.selectedimgcontainer}>
                {frontBase64Image ? (
                  <View>
                    <Image source={{ uri: frontBase64Image }} style={styles.selectedimg} />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeletefrontImage()}
                    >
                      <Text style={styles.deleteButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>

              <TouchableOpacity onPress={handleBackImageModalVisible} style={styles.ImageContainer}>
                <Text style={{ fontSize: 17, color: "#333" }}>Add Label Image 2</Text>
                <Text style={{ fontSize: 23, color: "#00aaf0" }}>+</Text>
              </TouchableOpacity>
              <View style={styles.selectedimgcontainer}>
                {backimgBase64 ? (
                  <View >
                    <Image source={{ uri: backimgBase64 }} style={styles.selectedimg} />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeletebackImage()}
                    >
                      <Text style={styles.deleteButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>

              
            </View>

          </ScrollView>
          <TouchableOpacity onPress={submit} style={styles.usersubmit} >
                <Text style={styles.addquerytext}>Submit Query</Text>
              </TouchableOpacity>

        </View>

        <View >
          <CustomImageModal
            togglevisible={isFrontImageModalVisible}
            onclose={handleFrontImageModalVisible}
            handelImage={(item) => {
              handleFrontImageModalVisible();
              handlefrontImage(item);
            }}
          />

          <CustomImageModal
            togglevisible={isBackImageModalVisible}
            onclose={handleBackImageModalVisible}
            handelImage={(item) => {
              handleBackImageModalVisible();
              handleBackImage(item);
            }}
          />


        </View>
        <Popup
          visible={modalVisible}
          message={modalMessage}
          closeModal={closeModal}
        />
      </SafeAreaView>

      {/* {
        isLoading ? (
          <View style={styles.submitloader}>
            <ActivityIndicator animating={isLoading} size="large" color="white" />
          </View>
        ) : null
      } */}
      <Loader loading={isLoading}/>
    </>
  )
}

export default AddRaiseQuery