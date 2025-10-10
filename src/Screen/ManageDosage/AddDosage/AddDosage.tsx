import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Image} from 'react-native';
import styles from './styles';
import CustomHeader from '../../CustomHeader/CustomHeader';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import api from '../../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Popup from '../../../components/Popup';
import { AxiosError } from 'axios';
import Loader from '../../../components/Loader';
import SuccessMessage, { ErrorMessage } from '../../../components/Common/CustomTostMessage';
import { useDispatch, useSelector } from 'react-redux';
import CustomDropdown from '../../../components/CustomDropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomMultipleImagemodal from '../../../components/Common/CustomMultipleImagemodal';
import CustomDropdownWithAddItem from '../../../components/CustomDropdownWithAddItem';
import { setDosageItems } from '../../../Reducer/slices/dosageItemsSlice';

interface AddShopProps {
    route: any;
    navigation: any;
}

const AddDosage: React.FC<AddShopProps> = ({ route, navigation }) => {

    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [modalMessage, setModalMessage] = React.useState<string>('');
    const [ModelName, setModelName] = useState('');
    const [ModelNo, setModelNo] = useState('');
    const [addmanufacturerId, SetaddmanufacturerId] = useState('')
    const [addmodelnameId, SetaddmodelnameId] = useState('')
    const [selectmultipleProductNo, setselectmultipleProductNo] = useState<string[]>([]);
    const [PumpsnNo, setPumpsnNo] = useState('');
    const [WashersNo, setWashersNo] = useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isImageModalVisible, setImageModalVisible] = React.useState(false)
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const dosageItemList = useSelector((state: any) => state.DosageItemList); // Use 'dosageItems' instead of 'DosageItemList'
    const dispatch = useDispatch()
 
    const filteredDosageNumbers = (dosageItemList && dosageItemList.dosageNumber)
        ? dosageItemList.dosageNumber.filter(item => item.dosageName_id === ModelName)
        : [];

    const dosageNumber = filteredDosageNumbers.map((dosageNumber) => ({
        label: dosageNumber.dosage_number,
        value: dosageNumber.id
    }));

    const dosageItem = (dosageItemList && dosageItemList.dosageItem)
        ? dosageItemList.dosageItem.map((dosageItem) => ({
            label: dosageItem.dosage_name,
            value: dosageItem.id
        }))
        : [];

    const ProductNumber = (dosageItemList && dosageItemList.dosageProduct)
        ? dosageItemList.dosageProduct.map((dosageProduct) => ({
            label: dosageProduct.product_name,
            value: dosageProduct.id
        }))
        : [];

    const numberOptions = Array.from({ length: 13 }, (_, index) => index + 1);

    const numberArray = numberOptions.map((number) => ({
        label: number.toString(),
        value: number.toString()
    }))

    const closeModal = () => {
        setModalVisible(false);
    }

    const submit = async () => {
        console.log(selectmultipleProductNo)
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                console.log("userId not found");
                return;
            }
            if (ModelName === '') {
                ErrorMessage({
                    message: "The manufacturer field is required"
                })

                return false
            }

            if (selectmultipleProductNo.length === 0) {
                ErrorMessage({
                    message: "The Product Name field is required"
                })

                return false
            }
            // const formData = new FormData();
            const formData = new FormData();

            formData.append('user_id', userId);
            formData.append('model_name', ModelName);
            formData.append('model_no', ModelNo);
            // formData.append('product_no', ProductNo);
            formData.append('washers_no', WashersNo.toString());
            formData.append('pupmps_no', PumpsnNo.toString());
            formData.append('status', '1'); // Ensure status is a string

            selectmultipleProductNo.forEach((product, index) => {
                formData.append(`product_no[${index}]`, product);
            });

            if (selectedImages) {
                Object.keys(selectedImages).forEach((key) => {
                    const imageUri = selectedImages[key];
                    formData.append(`front_image[${key}]`, {
                        uri: imageUri,
                        name: `front_image_${key}.jpg`, // Adjust the file name with a unique identifier
                        type: 'image/jpeg', // Adjust the file type if necessary
                    });
                });
            }
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setIsLoading(true)
                const response = await api.add_dosage(formData, token);

                if (response.data.success === true) {
                    SuccessMessage({
                        message: response.data.message
                    })
                    route.params.onDosageAdded(response.data.data); // Assuming 'data' contains the new shop object
                    setIsLoading(false)
                    navigation.setOptions({
                        onDosageAdded: route.params.onDosageAdded, // Pass the function using setOptions
                    });
                    navigation.goBack();
                }
            }
        } catch (error) {
            console.log("here add dosage error", error.response);
            setIsLoading(false)
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 400) {
                if (typeof axiosError.response.data === 'object') {
                    const responseData = axiosError.response.data as { message: { model_name: string, model_no: string, product_no: string, pupmps_no: string, washers_no: string } };

                    if (responseData.message.model_name) {
                        setModalMessage(responseData.message.model_name);
                        setModalVisible(true);
                        return;
                    }
                    if (responseData.message.model_no) {
                        setModalMessage(responseData.message.model_no);
                        setModalVisible(true);
                        return;
                    }
                    if (responseData.message.product_no) {
                        setModalMessage(responseData.message.product_no);
                        setModalVisible(true);
                        return;
                    }
                    if (responseData.message.pupmps_no) {
                        setModalMessage(responseData.message.pupmps_no);
                        setModalVisible(true);
                        return;
                    }
                    if (responseData.message.washers_no) {
                        setModalMessage(responseData.message.washers_no);
                        setModalVisible(true);
                        return;
                    }
                }
            }
        }
    };


    const handleDeleteImage = (indexToRemove) => {
        setSelectedImages((prevImages) =>
            prevImages.filter((image, index) => index !== indexToRemove)
        );
    };

    const handledosageimages = () => {
        setImageModalVisible(!isImageModalVisible)
    }

    const AddModelName = async (item) => {


        try {
            const token = await AsyncStorage.getItem('token');
            const dosage_number = {
                dosage_number: item
            }
            if (token) {
                const response = await api.dosage_model_number(token, dosage_number, ModelName)
                if (response.data.success === true) {
                    SetaddmodelnameId(response.data.data.id)
                    // Alert.alert("Success",response.data.message)
                    get_dosage_items()
                }
                // console.log(response)
            }


        } catch (error) {
            console.error("addnewItem error:", error)
        }

    }
    const addNewItem = async (item) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const dosage_name = {
                dosage_name: item
            }
            if (token) {
                const response = await api.dosage_items_add(token, dosage_name)
                if (response.data.success === true) {
                    SetaddmanufacturerId(response.data.data.id)
                    // console.log(response.data.data.id)
                    // setModelName(response.data.data.id)
                    // Alert.alert("Success",response.data.message)
                    get_dosage_items()
                }
                // console.log(response)
            }


        } catch (error) {
            console.error("addnewItem error:", error)
        }

    }

    const get_dosage_items = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            setIsLoading(true)
            try {
                const response = await api.dosage_items(token)
                if (response.data.success === true) {
                    // console.log("dosage item response",response.data)
                    dispatch(setDosageItems(response.data.data))
                    setIsLoading(false)

                }


            } catch (error) {
                console.log("dosage items error", error)
            }
        }

    }
    const renderProductItem = (item, applicationType) => {
        const isSelected = selectmultipleProductNo.includes(item.value);

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
                    {isSelected && <Text style={{ color: "#000" }}>✓</Text>}
                </View>
            </View>
        );
    };

    return (

        <>
            <SafeAreaView style={styles.container}>

                <CustomHeader title="Add New Dosage" imgSource={require('../../../assets/img/profile_img.png')} />

                <View style={styles.maincontainer}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View>
                            {/* <CustomTextInput  title='Model Name' value={ModelName} placeholder="Model Name" onChangeText={(Modelname) => setModelName(Modelname)}/> */}

                            <CustomDropdownWithAddItem title='Manufacturer' data={dosageItem} placeholder='Select Manufacturer' onSelect={(item) => {
                                setModelName(item.value)
                                SetaddmanufacturerId('')
                            }} addNewItem={addNewItem} required={true} selectedValue={addmanufacturerId} />

                            <CustomDropdownWithAddItem title='Model Name' data={dosageNumber} placeholder='Select Model Name' onSelect={(item) => {
                                setModelNo(item.value)
                                SetaddmodelnameId('')
                            }} addNewItem={AddModelName} selectedValue={addmodelnameId} />
                            {/* <CustomTextInput title='Model No' value={ModelNo} placeholder="Model No" onChangeText={(ModelNo) => setModelNo(ModelNo)} /> */}
                            {/* <CustomTextInput title='Product No' value={ProductNo} placeholder="Product No" onChangeText={(ProductNo) => setProductNo(ProductNo)} /> */}

                            {/* <CustomDropdown title='Product No' data={ProductNumber} placeholder='Select Product No' onSelect={(item) => setProductNo(item.value)} /> */}
                            <Text style={styles.textinputlabel}>Product Name <Text style={{ color: "red" }}>*</Text></Text>
                            <MultiSelect
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={ProductNumber}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Product Name"
                                value={selectmultipleProductNo}
                                search
                                searchPlaceholder="Search..."
                                containerStyle={{
                                    width: "100%", height: "70%", zIndex: 60,
                                }}
                                onChange={(selectedItems) => {
                                    setselectmultipleProductNo(selectedItems);
                                }}
                                // renderLeftIcon={() => (
                                //   <AntDesign
                                //     style={styles.icon}
                                //     color="black"
                                //     name="Safety"
                                //     size={20}
                                //   />
                                // )}
                                renderItem={(item) => renderProductItem(item, ProductNumber)}
                                renderSelectedItem={(item, unSelect) => (
                                    <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                                        <View style={styles.selectedStyle}>
                                            <Text style={styles.textSelectedStyle}>{item.label}</Text>
                                            <AntDesign color="red" name="delete" size={17} />
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />

                            <CustomDropdown title='No. of Pumps' data={numberArray} placeholder='Select No. of Pumps' onSelect={(item) => setPumpsnNo(item.value)} />

                            <CustomDropdown title='No. of Washers' data={numberArray} placeholder='Select No. of Washers' onSelect={(item) => setWashersNo(item.value)} />

                            <TouchableOpacity onPress={handledosageimages} style={styles.ImageContainer}>
                                <Text style={{ fontSize: 17, color: "#333" }}>Add Image</Text>
                                <Text style={{ fontSize: 23, color: "#00aaf0" }}>+</Text>
                            </TouchableOpacity>

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
                            {/* 
                            <TouchableOpacity onPress={handleFrontImageModalVisible} style={styles.ImageContainer}>
                                <Text style={styles.addimagecontainer}>Add Front Image</Text>
                                <Text style={{ fontSize: 23, color: "#00aaf0" }}>+</Text>
                            </TouchableOpacity> */}
                            {/* <View style={styles.selectedimgcontainer}>
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
                            </View> */}
                            {/* 
                            <TouchableOpacity onPress={handleBackImageModalVisible} style={styles.ImageContainer}>
                                <Text style={styles.addimagecontainer}>Add Back Image</Text>
                                <Text style={{ fontSize: 23, color: "#00aaf0" }}>+</Text>
                            </TouchableOpacity> */}
                            {/* <View style={styles.selectedimgcontainer}>
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
                            </View> */}


                        </View>
                    </ScrollView>
                    <TouchableOpacity onPress={submit} style={styles.addtext}>
                        <Text style={styles.adddosagetext}>Add Dosage</Text>
                    </TouchableOpacity>
                </View>
                <View >

                    <CustomMultipleImagemodal
                        togglevisible={isImageModalVisible}
                        onclose={handledosageimages}
                        handelMultipleImage={(item) => {
                            handledosageimages()
                            if (Array.isArray(item)) {
                                setSelectedImages((PrevImage) => [...PrevImage, ...item])
                            } else {
                                setSelectedImages((PrevImage) => [...PrevImage, item])
                            }

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
            <Loader loading={isLoading} />
        </>

    );
};

export default AddDosage;
