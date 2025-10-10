import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Image, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import styles from './styles';
import CustomHeader from '../../CustomHeader/CustomHeader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import api from '../../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Popup from '../../../components/Popup';
import { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import CountryDropdown from '../../../components/CountryDropdown';
import CustomTextInput from '../../../components/CustomTextInput';
import Loader from '../../../components/Loader';
import SuccessMessage, { ErrorMessage } from '../../../components/Common/CustomTostMessage';
import CustomMultipleImagemodal from '../../../components/Common/CustomMultipleImagemodal';

import { SafeAreaView } from 'react-native-safe-area-context';



interface AddShopProps {
  route: any;
  navigation: any;
}

const AddShop: React.FC<AddShopProps> = ({ route, navigation }) => {

  const [isCountryDropdownVisible, setCountryDropdownVisible] = React.useState(false)
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [Shopname, setShopname] = useState('');
  const [Contactperson, setContactperson] = useState('');
  const [Contacnumber, setContacnumber] = useState('');
  const [Email, setEmail] = useState('');
  // const [selectedImages, setSelectedImages] = useState<{ [key: string]: string[] }>({});
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isImageModalVisible, setImageModalVisible] = React.useState(false)
  // const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedProductData, setSelectedProductData] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [applicationData, setapplicationData] = useState<any>({})
  const [selectedApplicationType, setSelectedApplicationType] = useState<string | null>(null);
  const [imageCounter, setImageCounter] = useState(0);
  const userData = useSelector((state: any) => state.user.userData)
  const [selectedItem, setSelectedItem] = React.useState(null);
  const country_calling_code = userData && userData.country && userData.country.calling_code ? userData.country.calling_code : '';



  useEffect(() => {
    get_applicationType()
  }, [])

  const get_applicationType = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        const response = await api.application_type(token)
        if (response.data.status === true) {

          setapplicationData(response.data)
          setIsLoading(false)
        }

      } catch (error) {
        console.log("applicaion type error:", error)
      }
    }
  }


  const applicationTypes = applicationData.applicationType?.map((type) => ({
    label: type.application_type,
    value: type.id.toString(),
    products: type.products.map((product) => ({
      label: product.product_name,
      value: product.id.toString(),
    })),
  })) || [];


  const isEmailValid = (email: string): boolean => {
    // Email validation regex pattern
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
  };


  const closeModal = () => {
    setModalVisible(false);
  }
  const submit = async () => {
    if (Shopname === '') {
     
      ErrorMessage({
        message: "The shop name field is required"
      })

      return false
    }

    if (Shopname) {
      if (Email === '') {
       
        ErrorMessage({
          message: "Shop Email is required"
        })
  
        return false
      } else if (!isEmailValid(Email)) {
        ErrorMessage({
          message: "Invalid shop email format"
        })
  
        return false
     
      }
    }

    if (Object.keys(selectedProductData).length === 0) {
     
      ErrorMessage({
        message: "The application type field is required"
      })

      return false

    }
 
    
    // console.log("here application data with produts", selectedProductData);
    const userId = await AsyncStorage.getItem('userId')

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('shop_name', Shopname);
    formData.append('shop_contact_person', Contactperson);
    formData.append('email', Email);
    formData.append('phone', Contacnumber);
    formData.append('country_code', selectedItem ? selectedItem.calling_code : country_calling_code);
    formData.append('status', '1');

    if (selectedImages) {
      Object.keys(selectedImages).forEach((key) => {
        const imageUri = selectedImages[key];
        formData.append(`images[${key}]`, {
          uri: imageUri,
          name: `images_${key}.jpg`, // Adjust the file name with a unique identifier
          type: 'image/jpeg', // Adjust the file type if necessary
        });
      });
    }

    if (selectedProductData) {
      Object.keys(selectedProductData).forEach((key) => {
        const products = selectedProductData[key];
        products.forEach((product, index) => {
          formData.append(`products[${key}][${index}]`, product);
        });
      });
    }




    try {
      setIsLoading(true)
      console.log("here above shop")
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await api.add_Shop(formData, token)

        if (response.data.success === true) {
          SuccessMessage({
            message: response.data.message
          })
          setIsLoading(false)
          route.params.onShopAdded(response.data.data);
          navigation.goBack();
        }


      }

    } catch (error) {
      setIsLoading(false)
      console.log(error.response)
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 400) {
        if (typeof axiosError.response.data === 'object') {
          const responseData = axiosError.response.data as { message: { shop_name: string, email: string, shop_contact_person: string, phone: string, } };
          if (responseData.message.shop_name) {
            setModalMessage(responseData.message.shop_name);
            setModalVisible(true);
            return;
          }
          if (responseData.message.shop_contact_person) {
            setModalMessage(responseData.message.shop_contact_person);
            setModalVisible(true);
            return;
          }

          if (responseData.message.email) {
            setModalMessage(responseData.message.email);
            setModalVisible(true);
            return;
          }
          if (responseData.message.phone) {
            setModalMessage(responseData.message.phone);
            setModalVisible(true);
            return;
          }


        }
      }
    }

  }



  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = (applicationType: string) => {
    setSelectedApplicationType(applicationType);
    setIsModalVisible(true);
  };

  const closeProductModel = () => {
    setSelectedApplicationType(null);
    setIsModalVisible(false);
    setSearchTerm('')
  };

  const handleCheckboxChange = (productId, applicationTypeId) => {
    setSelectedProductData((prevSelectedData) => {
      const updatedData = { ...prevSelectedData };

      if (!updatedData[applicationTypeId]) {
        updatedData[applicationTypeId] = [productId];
      } else {
        const index = updatedData[applicationTypeId].indexOf(productId);
        if (index === -1) {
          updatedData[applicationTypeId].push(productId);
        } else {
          updatedData[applicationTypeId].splice(index, 1);
        }
      }

      return updatedData;
    });
  };

  const handleRemoveSelectedItem = (applicationTypeId, productId) => {
    setSelectedProductData((prevSelectedData) => {
      const updatedData = { ...prevSelectedData };
      const index = updatedData[applicationTypeId].indexOf(productId);
      if (index !== -1) {
        updatedData[applicationTypeId].splice(index, 1);
      }
      return updatedData;
    });
  };


  const handleDeleteImage = (indexToRemove) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((image, index) => index !== indexToRemove)
    );
  };

  const handleCountrySelect = (item: any) => {
    setSelectedItem(item)
  }
  const handlecalling_code = () => {
    setCountryDropdownVisible(!isCountryDropdownVisible);
  }
  const handleshopimages = () => {
    setImageModalVisible(!isImageModalVisible)
  }
  return (

    <>
      <SafeAreaView style={styles.container}>

        <CustomHeader title="Add New Shop" imgSource={require('../../../assets/img/profile_img.png')} />
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >

        <View style={styles.maincontainer}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}>
            <View >
              <CustomTextInput title='Shop Name' value={Shopname} placeholder='Shop Name' onChangeText={(Shopname) => setShopname(Shopname)} required={true}/>

              <CustomTextInput title='Contact Person Name' value={Contactperson} placeholder='Contact Person Name' onChangeText={(Contactperson) => setContactperson(Contactperson)} />
              <CustomTextInput title='Shop Email' value={Email} placeholder='Shop Email' onChangeText={(email) => setEmail(email)} />
              <View style={styles.numbercontainer}>
                <Text style={styles.textinputlabel}>Contact Person Number</Text>

                <View style={{ width: "100%", }}>

                  <TouchableOpacity style={styles.country_calling_code} onPress={handlecalling_code}>
                    <Text style={styles.country_calling_code_text}>+{selectedItem ? selectedItem.calling_code : country_calling_code}</Text>
                  </TouchableOpacity>



                  <TextInput placeholderTextColor={'#787a7c'} style={styles.country_calling_code_textinput} placeholder="Contact Person Number" maxLength={10} keyboardType="phone-pad" onChangeText={(Contacnumber) => setContacnumber(Contacnumber)} />
                </View>
              </View>


              <View style={{ marginTop: 20 }}>
                <Text style={styles.applicationlabel}>Application Type <Text style={{color:"red"}}>*</Text></Text>
                {applicationTypes.map((applicationType) => (
                  <View key={applicationType.value}>
                    <TouchableOpacity onPress={() => openModal(applicationType.value)}>
                      <View style={styles.applicationtypeContainer}>
                        <Text style={styles.applicationTypelabel}>{applicationType.label} </Text>
                        <Text style={{ fontSize: 23, color: "#00aaf0" }}> +</Text>
                      </View>
                    </TouchableOpacity>
                    <Modal
                      visible={isModalVisible && selectedApplicationType === applicationType.value}
                      animationType="slide"
                      transparent={true}
                    >
                      {/* <TouchableWithoutFeedback onPress={closeProductModel}> */}
                      <View style={styles.modelContainer}>
                        <View style={styles.modelView}>
                          <View style={{ alignItems: "center" }}>
                            <Text style={styles.modelapplicationlable}>{applicationType.label}</Text>
                          </View>

                          <View>
                            <TextInput
                              style={styles.searchprodutsinput}
                              placeholderTextColor={'#787a7c'}
                              placeholder="Search Products"
                              value={searchTerm}
                              autoFocus={true}
                              onChangeText={(text) => setSearchTerm(text)}
                            />

                          </View>

                          {/* Wrap the product list inside a ScrollView */}

                          <ScrollView style={{ maxHeight: 300 }}>
                            <View style={{ display: "flex", flexDirection: "row", flexWrap: 'wrap', width: "100%", justifyContent: 'space-between', marginTop: 15 }}>
                              {applicationType.products
                                .filter((product) =>
                                  product.label.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((product) => (
                                  <View key={product.value} style={{ width: "45%" }}>
                                    <TouchableOpacity
                                      onPress={() => handleCheckboxChange(product.value, applicationType.value)}
                                      style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
                                    >
                                      <View
                                        style={{
                                          width: 20,
                                          height: 20,
                                          borderRadius: 5,
                                          borderWidth: 1,
                                          borderColor: selectedProductData[applicationType.value]?.includes(product.value)
                                            ? 'green'
                                            : 'gray',
                                          marginRight: 10,
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}
                                      >
                                        {selectedProductData[applicationType.value]?.includes(product.value) && <Text style={{ color: "green" }}>✓</Text>}
                                      </View>
                                      <Text style={styles.productlabel}>{product.label}</Text>
                                    </TouchableOpacity>
                                  </View>
                                ))}
                            </View>
                          </ScrollView>
                          <TouchableOpacity style={{ marginTop: 10, alignItems: "flex-end", justifyContent: "flex-end", marginRight: 30 }} onPress={closeProductModel}>
                            <Text style={styles.oktext}>OK</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {/* </TouchableWithoutFeedback> */}
                    </Modal>

                    {/* Display selected products for this application type */}
                    {selectedProductData[applicationType.value]?.length > 0 && (
                      <View style={{ marginTop: 10, display: "flex", width: "100%", justifyContent: "center", flexDirection: "row", flexWrap: "wrap" }}>
                        {selectedProductData[applicationType.value].map((productId) => {
                          const product = applicationType.products.find((p) => p.value === productId);
                          return (
                            <View key={productId} style={{ width: "50%" }}>
                              <View style={styles.selectedStyle}>
                                <Text style={styles.textSelectedStyle}>{product?.label}</Text>

                                <TouchableOpacity onPress={() => handleRemoveSelectedItem(applicationType.value, productId)}>
                                  <AntDesign color="red" name="delete" size={17} />
                                </TouchableOpacity>
                              </View>

                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                ))}
              </View>



              {/* here selectd img view code */}
              <View style={styles.imgcontainer}>
                {selectedImages.map((imageUri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.selectedimg} />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteImage(index)}
                    >
                      <Text style={styles.deleteButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>



              <TouchableOpacity onPress={handleshopimages} style={styles.ImageContainer}>
                <Text style={{ fontSize: 17, color: "#333" }}>Add Shop Images</Text>
                <Text style={{ fontSize: 23, color: "#00aaf0" }}>+</Text>
              </TouchableOpacity>


            </View>
          </ScrollView>
      
          <TouchableOpacity onPress={submit} style={styles.addtext}>
            <Text style={styles.addshoptext}>Add Shop</Text>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>

        {/* here modal  */}

        <View >
          <View >

            <CustomMultipleImagemodal
              togglevisible={isImageModalVisible}
              onclose={handleshopimages}
              handelMultipleImage={(item) => {
                handleshopimages()
                if (Array.isArray(item)) {
                  setSelectedImages((PrevImage) => [...PrevImage, ...item])
                } else {
                  setSelectedImages((PrevImage) => [...PrevImage, item])
                }

              }}

            />


          </View>
          <CountryDropdown
            onclose={handlecalling_code}
            togglevisible={isCountryDropdownVisible}
            onSelectCountry={(item) => {
              handleCountrySelect(item);
              setCountryDropdownVisible(false);
            }}
          />
        </View>



        <Popup
          visible={modalVisible}
          message={modalMessage}
          closeModal={closeModal}
        />
      </SafeAreaView>
      <Loader loading={isLoading} />


    </>
  );
};

export default AddShop;

