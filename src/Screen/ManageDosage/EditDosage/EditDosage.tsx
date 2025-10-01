import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Image, Alert, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import styles from './styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api, { Image_Base_Url } from '../../../api/Api'
import CustomHeader from '../../CustomHeader/CustomHeader'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import {
    responsiveHeight,
} from "react-native-responsive-dimensions";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomImageModal from '../../../components/CustomImageModal'
import CustomTextInput from '../../../components/CustomTextInput'
import Loader from '../../../components/Loader'
import SuccessMessage, { ErrorMessage } from '../../../components/Common/CustomTostMessage'
import { useSelector } from 'react-redux'
import CustomEditDropdown from '../../../components/CustomEditDropdown'
import CustomMultipleImagemodal from '../../../components/Common/CustomMultipleImagemodal'
import { AxiosError } from 'axios'
import { MultiSelect } from 'react-native-element-dropdown'

interface Editdosage {
    route: any
}
interface UpdateDosageType {
    model_name: any;
    model_no: any;
    product_no: any;
    washers_no: any;
    pupmps_no: any;
    status: number;
    front_image?: string; // Make sure to adjust the type if necessary
    back_image?: string; // Make sure to adjust the type if necessary
}
const EditDosage: React.FC<Editdosage> = ({ route }) => {

    const { dosageId, navigation } = route.params
    const [isLoading, setIsLoading] = React.useState(true);
    const [DosageData, setDosageData] = React.useState<any>({});
    const [selectmultipleProductNo, setselectmultipleProductNo] = React.useState<string[]>([]);
    const [Loading, setLoading] = React.useState(false);

    const [selectedImages, setSelectedImages] = React.useState<string[]>([]);

    const [isImageModalVisible, setImageModalVisible] = React.useState(false)
    const [deletedImageIds, setDeletedImageIds] = React.useState<number[]>([]);


    const dosageItemList = useSelector((state: any) => state.DosageItemList); // Use 'dosageItems' instead of 'DosageItemList'




    // Ensure DosageItemList and dosageNumber are not null or undefined before filtering
    const filteredDosageNumbers = (dosageItemList && dosageItemList.dosageNumber)
        ? dosageItemList.dosageNumber.filter(item => item.dosageName_id === DosageData.model_name)
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


    useEffect(() => {
        fetchDosageData()
    }, [])

    useEffect(()=>{
        if(DosageData && DosageData.product){
            const productIds =DosageData.product.map(product => product.id)
            setselectmultipleProductNo(productIds)
            console.log("productIds",productIds)
        }

    },[DosageData])

    const fetchDosageData = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            try {
                const response = await api.edit_dosage(dosageId, token)

                if (response.data.success === true) {
                    setDosageData(response.data.data)
                    console.log("here edit", response.data.data)
                    setIsLoading(false)
                }

            } catch (error) {
                console.log("get dosage error", error)
            }

        }

    }


    const submit = async () => {

        if (!selectmultipleProductNo || selectmultipleProductNo.length === 0) {
            ErrorMessage({
                message:"Please select at least one product Name."
            })
            return;
          
        }

        
        const UpdateDosage = new FormData();

        UpdateDosage.append('model_name', DosageData.model_name);
        UpdateDosage.append('model_no', DosageData.model_no);
        // UpdateDosage.append('product_no', DosageData.product_no);
        UpdateDosage.append('washers_no', DosageData.washers_no.toString());
        UpdateDosage.append('pupmps_no', DosageData.pupmps_no.toString());
        UpdateDosage.append('status', '1');
        selectmultipleProductNo.forEach((product, index) => {
            UpdateDosage.append(`product_no[${index}]`, product);
        });


        if (selectedImages) {
            Object.keys(selectedImages).forEach((key) => {
                const imageUri = selectedImages[key];
                UpdateDosage.append(`front_image[${key}]`, {
                    uri: imageUri,
                    name: `front_image_${key}.jpg`, // Adjust the file name with a unique identifier
                    type: 'image/jpeg', // Adjust the file type if necessary
                });
            });
        }
        const token = await AsyncStorage.getItem('token');

        if (token) {
            try {
                setLoading(true);

                const response = await api.update_dosage(dosageId, token, UpdateDosage);
                if (deletedImageIds.length > 0) {
                    const token = await AsyncStorage.getItem('token');
                    for (const id of deletedImageIds) {
                        try {
                            await api.delete_dosage_front_image(id, token);
                        } catch (err) {
                            console.log("Image delete failed for id", id, err);
                        }
                    }
                }
                
                SuccessMessage({
                    message: response.data.message
                })
                setLoading(false);

                // navigation.navigate('Manage Dosages', { updatedDosageData: response.data.data });
                navigation.navigate('Manage Dosages', { updatedDosageData: true });
            } catch (error) {
                console.log("here add dosage error", error);
                setLoading(false);
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 400) {
                    if (typeof axiosError.response.data === 'object') {
                        const responseData = axiosError.response.data as { message: { model_name: string, model_no: string, product_no: string, pupmps_no: string, washers_no: string } };

                        if (responseData.message.model_name) {
                            ErrorMessage({
                                message: responseData.message.model_name
                            })
                            return;
                        }
                        if (responseData.message.model_no) {
                            ErrorMessage({
                                message: responseData.message.model_no
                            })
                            return
                        }
                        if (responseData.message.product_no) {
                            ErrorMessage({
                                message: responseData.message.product_no
                            })
                            return;
                        }
                        if (responseData.message.pupmps_no) {
                            ErrorMessage({
                                message: responseData.message.pupmps_no
                            })
                            return;
                        }
                        if (responseData.message.washers_no) {
                            ErrorMessage({
                                message: responseData.message.washers_no
                            })
                            return;
                        }
                    }
                }
            }
        }
    };

    const handleselectedDeleteImage = (imageId: number) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this image?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setDeletedImageIds((prev) => [...prev, imageId]);
                        setDosageData((prevData) => ({
                            ...prevData,
                            images: prevData.images.filter((img) => img.id !== imageId)
                        }));
                    }
                }
            ],
            { cancelable: true }
        );
    };
    

    // const handleselectedDeleteImage = async (imageId) => {
    //     // Show a warning alert
    //     Alert.alert(
    //         'Confirm Delete',
    //         'Are you sure you want to delete this image?',
    //         [
    //             {
    //                 text: 'Cancel',
    //                 style: 'cancel',
    //                 onPress: () => {
    //                     // User canceled, do nothing
    //                 },
    //             },
    //             {
    //                 text: 'Delete',
    //                 style: 'destructive',
    //                 onPress: async () => {
    //                     setLoading(true);
    //                     const token = await AsyncStorage.getItem('token');

    //                     if (token) {
    //                         try {
    //                             const response = await api.delete_dosage_front_image(imageId, token);
    //                             if (response.data.success === true) {
    //                                 setDosageData((prevImages) => ({
    //                                     ...prevImages,
    //                                     images: prevImages.images.filter((image) => image.id !== imageId),
    //                                 }));
    //                                 setLoading(false);
    //                             }
    //                         } catch (error) {
    //                             console.log('delete shop image error:', error);
    //                         }
    //                     }
    //                 },
    //             },
    //         ],
    //         { cancelable: true }
    //     );
    // };

    const handleDeleteImage = (indexToRemove) => {
        setSelectedImages((prevImages) =>
            prevImages.filter((image, index) => index !== indexToRemove)
        );
    };
    const handledosageimages = () => {
        setImageModalVisible(!isImageModalVisible)
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
                <CustomHeader title="Edit Dosage" imgSource={require('../../../assets/img/profile_img.png')} />

                <View style={styles.maincontainer}>
                    {isLoading ? <View style={styles.loader}>
                        <ActivityIndicator size="large" color="gray" />
                    </View> :
                        <View style={{ flex: 1, backgroundColor: "white" }}>
                            <ScrollView keyboardShouldPersistTaps="handled">
                                <CustomEditDropdown title='Manufacturer' data={dosageItem} placeholder='Select Manufacturer' iconName='shopping' onSelect={(item) => setDosageData(prevData => ({
                                    ...prevData,
                                    model_name: item,
                                }))} selectedValue={DosageData.model_name} isDisabled={false} required={true}/>

                                <CustomEditDropdown title='Model Name' data={dosageNumber} placeholder='Select Model Name' iconName='shopping' onSelect={(item) => setDosageData(prevData => ({
                                    ...prevData,
                                    model_no: item,
                                }))} selectedValue={parseInt(DosageData.model_no)} isDisabled={false} />

                                <Text style={styles.textinputlabel}>Product Name <Text style={{color:"red"}}>*</Text></Text>
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

                                <CustomEditDropdown title='No. of Pumps' data={numberArray} placeholder='Select No. of Pumps' iconName='shopping' onSelect={(item) => setDosageData(prevData => ({
                                    ...prevData,
                                    pupmps_no: item,
                                }))} selectedValue={DosageData.pupmps_no?DosageData.pupmps_no.toString():''} isDisabled={false} />



                                <CustomEditDropdown title='No. of Washers' data={numberArray} placeholder='Select No. of Washers' iconName='shopping' onSelect={(item) => setDosageData(prevData => ({
                                    ...prevData,
                                    washers_no: item,
                                }))} selectedValue={DosageData.washers_no?DosageData.washers_no.toString():''} isDisabled={false} />


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

                                <View style={styles.imgcontainer}>
                                    {DosageData.images.map((imageUrl, index) => (
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

                            </ScrollView>
                            <TouchableOpacity onPress={submit} style={styles.addtext}>
                                <Text style={styles.updatedosagetext}>Update Dosage</Text>
                            </TouchableOpacity>
                        </View>
                    }

                </View>
            </SafeAreaView>

            <View >
            <CustomMultipleImagemodal
                        togglevisible={isImageModalVisible}
                        onclose={handledosageimages}
                        handelMultipleImage={(item) => {
                            handledosageimages()
                            if (Array.isArray(item)) {
                                setSelectedImages((PrevImage) => [...PrevImage, ...item])
                            }else{
                                setSelectedImages((PrevImage) => [...PrevImage,item])
                            }
                            
                        }}

                    />

            </View>
         
            <Loader loading={Loading} />
        </>


    )
}

export default EditDosage