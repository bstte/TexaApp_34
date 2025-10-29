import { View, Text, ActivityIndicator, TextInput, TouchableOpacity, Alert, ScrollView, Image, Modal, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api, { Image_Base_Url } from '../../../api/Api'
import styles from './styles'
import CustomHeader from '../../CustomHeader/CustomHeader'
import AntDesign from 'react-native-vector-icons/AntDesign';

import CountryDropdown from '../../../components/CountryDropdown'

import CustomTextInput from '../../../components/CustomTextInput'
import Loader from '../../../components/Loader'
import SuccessMessage, { ErrorMessage } from '../../../components/Common/CustomTostMessage'
import CustomMultipleImagemodal from '../../../components/Common/CustomMultipleImagemodal'
import { SafeAreaView } from 'react-native-safe-area-context';
interface editShopprops {
  route: any
}

const EditShop: React.FC<editShopprops> = ({ route }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedApplicationType, setSelectedApplicationType] = React.useState<string | null>(null);
  // const userData = useSelector((state: any) => state.user.userData)
  // const country_calling_code = userData ? userData.country.calling_code : '';
  const [isImageModalVisible, setImageModalVisible] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [isCountryDropdownVisible, setCountryDropdownVisible] = React.useState(false)

  useEffect(() => {
    fetchShopData()
  }, [])

  const openModal = (applicationType: string) => {
    setSelectedApplicationType(applicationType);
    setIsModalVisible(true);
  };

  const closeProductModel = () => {
    setSelectedApplicationType(null);
    setIsModalVisible(false);
  };

  const { shopId, navigation } = route.params;
  const [isLoading, setIsLoading] = React.useState(true);
  const [Loading, setLoading] = React.useState(false);
  const [shopData, setShopData] = React.useState<any>({});
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);
  const [selectedProductData, setSelectedProductData] = React.useState<{ [key: string]: string[] }>({});
  const [imageCounter, setImageCounter] = React.useState(0);

  const fetchShopData = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const response = await api.edit_shop(shopId, token)
      if (response.data.success === true) {

        setShopData(response.data)
        setIsLoading(false)
      }
    }

  }

  const applicationTypes = shopData.applicationType?.map((type) => ({
    label: type.application_type,
    value: type.id.toString(),
    products: type.products.map((product) => ({
      label: product.product_name,
      value: product.id.toString(),
    })),
  })) || [];

  useEffect(() => {
    if (shopData && shopData.shop_product) {
      const newSelectedProducts: string[] = [];
      const newSelectedProductData: { [key: string]: string[] } = {};

      shopData.shop_product.forEach((item: any) => {
        const key = Object.keys(item)[0];
        const products = item[key].map((productId: number) => productId.toString()); // Convert IDs to strings

        newSelectedProducts.push(key);
        newSelectedProductData[key] = products;
      });
      setSelectedProductData(newSelectedProductData);
    }
  }, [shopData]);


  const renderProductItem = (item, applicationType) => {
    const isSelected = selectedProductData[applicationType.value]?.includes(item.value);

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
          {isSelected && <Text>✓</Text>}
        </View>
      </View>
    );
  };


  // here email validatioin code
  const isEmailValid = (email: string): boolean => {
    // Email validation regex pattern
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
  };

  // console.log("shopData", shopData)
  const submit = async () => {
    const updateshopData = new FormData();

    // if (shopData.shop.shop_name === '' || shopData.shop.shop_contact_person === '' || shopData.shop.email === '' || shopData.shop.phone === '') {
    //   ErrorMessage({
    //     message: "All field are required"
    //   })

    //   return false
    // } else if (!isEmailValid(shopData.shop.email)) {
    //   ErrorMessage({
    //     message: "The shop email must be valid email address"
    //   })
    //   return false;
    // }

    if (shopData.shop.shop_name === '') {

      ErrorMessage({
        message: "Shop name is required"
      })

      return false
    }

    if (shopData.shop.shop_contact_person === '') {

      ErrorMessage({
        message: "Contact person name is required"
      })

      return false
    }


    if (shopData.shop.email === '') {

      ErrorMessage({
        message: "Shop Email is required"
      })

      return false
    } else if (!isEmailValid(shopData.shop.email)) {
      ErrorMessage({
        message: "Invalid shop email format"
      })

      return false

    }

    if (shopData.shop.phone === '') {

      ErrorMessage({
        message: "Contact person number is required"
      })

      return false
    }

    // if (Object.keys(selectedProductData).length === 0) {

    //   ErrorMessage({
    //     message: "The application type field is required"
    //   })

    //   return false

    // }
    // Check if selectedProductData is empty or all values are empty arrays
    const isEmptySelection =
      !selectedProductData ||
      Object.keys(selectedProductData).length === 0 ||
      Object.values(selectedProductData).every((arr) => !arr || arr.length === 0);

    if (isEmptySelection) {
      ErrorMessage({
        message: "application type is required"
      });
      return false;
    }

    // console.log("selectedProductData", selectedProductData)
    updateshopData.append('id', shopId);
    updateshopData.append('shop_name', shopData.shop.shop_name);
    updateshopData.append('shop_contact_person', shopData.shop.shop_contact_person);
    updateshopData.append('email', shopData.shop.email);
    updateshopData.append('phone', shopData.shop.phone);
    updateshopData.append('country_code', selectedItem ? selectedItem.calling_code : shopData.shop.country_code);
    updateshopData.append('status', 'true'); // Ensure status is a string

    if (selectedImages) {
      Object.keys(selectedImages).forEach((key) => {
        const imageUri = selectedImages[key];
        updateshopData.append(`images[${key}]`, {
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
          updateshopData.append(`products[${key}][${index}]`, product);
        });
      });
    }



    const token = await AsyncStorage.getItem('token');


    if (token) {
      try {
        setLoading(true)
        const respone = await api.update_shop(shopId, token, updateshopData)
        SuccessMessage({
          message: respone.data.message
        })
        setLoading(false)
        navigation.navigate('Manage Shops', { updatedShopData: true });
      } catch (error) {
        setIsLoading(false)
        console.log("update shop error", error)
      }
    }

  }






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

  const handleselectedDeleteImage = async (imageId) => {
    // Show a warning alert
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this image?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            // User canceled, do nothing
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');

            if (token) {
              try {
                const response = await api.delete_shop_image(imageId, token);
                if (response.data.success === true) {
                  setShopData((prevImages) => ({
                    ...prevImages,
                    image: prevImages.image.filter((image) => image.id !== imageId),
                  }));
                  setLoading(false);
                }
              } catch (error) {
                console.log('delete shop image error:', error);
              }
            }
          },
        },
      ],
      { cancelable: true }
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
        <CustomHeader title="Edit Shop" imgSource={require('../../../assets/img/profile_img.png')} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <View style={styles.maincontainer}>
            {isLoading ? <View style={styles.loader}>
              <ActivityIndicator size="large" color="gray" />
            </View> :
              <>
                <ScrollView keyboardShouldPersistTaps="handled">

                  <CustomTextInput title='Shop Name' value={shopData.shop.shop_name} placeholder='Shop Name' onChangeText={shop_name => {
                    setShopData(prevShopData => ({
                      ...prevShopData,
                      shop: {
                        ...prevShopData.shop,
                        shop_name: shop_name
                      }
                    }))
                  }} required={true} />

                  <CustomTextInput title='Contact Person Name' value={shopData.shop.shop_contact_person} placeholder='Contact Person Name' onChangeText={shop_contact_person => {
                    setShopData(prevShopData => ({
                      ...prevShopData,
                      shop: {
                        ...prevShopData.shop,
                        shop_contact_person: shop_contact_person
                      }
                    }))
                  }} required={true}/>

                  <CustomTextInput title='Shop Email' value={shopData.shop.email} placeholder='Shop Email' onChangeText={email => {
                    setShopData(prevShopData => ({
                      ...prevShopData,
                      shop: {
                        ...prevShopData.shop,
                        email: email
                      }
                    }))
                  }} required={true}/>

                  <View style={styles.numbercontainer}>
                    <Text style={styles.textinputlabel}>Contact Person Number <Text style={{color:"red"}}>*</Text></Text>
                    <View style={{ width: "100%" }}>
                      <TouchableOpacity style={styles.country_calling_code} onPress={handlecalling_code}>
                        <Text style={styles.country_calling_code_text}>
                          +{selectedItem ? selectedItem.calling_code : shopData.shop.country_code}
                        </Text>
                      </TouchableOpacity>

                      <TextInput
                        placeholderTextColor={'#787a7c'}
                        style={styles.country_calling_code_textinput}
                        placeholder="Contact Person Number"
                        maxLength={10}
                        keyboardType="phone-pad"
                        value={shopData.shop.phone ? shopData.shop.phone.toString() : ''}
                        onChangeText={phone => {
                          setShopData(prevShopData => ({
                            ...prevShopData,
                            shop: {
                              ...prevShopData.shop,
                              phone: phone
                            }
                          }))
                        }}
                      />
                    </View>
                  </View>


                  <View style={{ flex: 1 }}>
                    <CountryDropdown
                      onclose={handlecalling_code}
                      togglevisible={isCountryDropdownVisible}
                      onSelectCountry={(item) => {
                        handleCountrySelect(item);
                        setCountryDropdownVisible(false);
                      }}
                    />
                  </View>
                  {/* application type with producs */}
                  {isLoading ? <View style={styles.loader}>
                    <ActivityIndicator size="large" color="gray" />
                  </View> :
                    <View style={{ marginTop: 20 }}>
                      <Text style={styles.applicationlabel}>Application Type <Text style={{ color: "red" }}>*</Text></Text>
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
                                    placeholderTextColor={'#787a7c'}
                                    style={styles.searchprodutsinput}
                                    placeholder="Search Products"
                                    value={searchTerm}
                                    autoFocus={true}
                                    onChangeText={(text) => setSearchTerm(text)}
                                  />

                                </View>

                                {/* Wrap the product list inside a ScrollView */}
                                <ScrollView style={{ maxHeight: 300 }}>
                                  <View style={{ display: "flex", flexDirection: "row", flexWrap: 'wrap', width: "100%", justifyContent: 'space-between', marginTop: 15 }}>
                                    {applicationType.products.filter((produts) =>
                                      produts.label.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((product) => (
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
                                            {selectedProductData[applicationType.value]?.includes(product.value) && <Text>✓</Text>}
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

                  }
                  {/* 

              <View style={styles.imgcontainer}>

                {shopData.image.map((imageUrl, index) => (
                  <Image source={{ uri: `${Image_Base_Url}/${imageUrl.image}` }} style={styles.selectedimg} />
                  
                ))}
              </View> */}

                  <View style={styles.imgcontainer}>
                    {shopData.image.map((imageUrl, index) => (
                      <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri: `${Image_Base_Url}/${imageUrl.image}` }} style={styles.selectedimg} />
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleselectedDeleteImage(imageUrl.id)}
                        >
                          <Text style={styles.deleteButtonText}>X</Text>
                        </TouchableOpacity>
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
                  {/* <View style={styles.uploadimgcontainer}>
                  <TouchableOpacity onPress={handleshopimages}>
                    <Text style={styles.uploadimgtext}>Add Shop Images</Text>
                  </TouchableOpacity>

                </View> */}
                  <TouchableOpacity onPress={handleshopimages} style={styles.ImageContainer}>
                    <Text style={{ fontSize: 17, color: "#333" }}>Add Shop Images</Text>
                    <Text style={{ fontSize: 23, color: "#00aaf0" }}>+</Text>
                  </TouchableOpacity>

                </ScrollView>
                <TouchableOpacity onPress={submit} style={styles.addtext}>
                  <Text style={styles.addshoptext}>Update Shop</Text>
                </TouchableOpacity>
              </>
            }

          </View>
        </KeyboardAvoidingView>
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
      </SafeAreaView>


      <Loader loading={Loading} />
    </>

  )
}

export default EditShop
