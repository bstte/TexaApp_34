import React, { useEffect, useState } from 'react';
import { View, TextInput, StatusBar, TouchableOpacity, Text, ScrollView, Image, ActivityIndicator, Alert, Modal } from 'react-native';
import CustomHeader from '../../CustomHeader/CustomHeader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import api, { Image_Base_Url } from '../../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomEditDropdown from '../../../components/CustomEditDropdown';
import styles from '../AddEquipment/styles';
import CustomImageModal from '../../../components/CustomImageModal';
import {
    responsiveHeight,
} from "react-native-responsive-dimensions";
import { Picker } from '@react-native-picker/picker';
import ImageResizer from 'react-native-image-resizer';
import CustomTextInput from '../../../components/CustomTextInput';
import Loader from '../../../components/Loader';
import SuccessMessage, { ErrorMessage } from '../../../components/Common/CustomTostMessage';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native';
interface EditEquipment {
    route: any
}
const EditEquipment: React.FC<EditEquipment> = ({ route }) => {

    // for show text acor machine type
    const [showmachinetype, setshowmachinetype] = useState(false)
    const [showcleaningmachine, setshowcleaningmachine] = useState(false)
    const [showfishingequipment, setshowfishingequipment] = useState(false)
    const [showDryer, setshowDryer] = useState(false)
    const [Loading, setLoading] = React.useState(false);
    const [isFrontImageModalVisible, setFrontImageModalVisible] = React.useState(false)
    const [isBackImageModalVisible, setBackImageModalVisible] = React.useState(false)
    const [dosagemodalVisible, setDosagemodalVisible] = React.useState<boolean>(false);
    const [otherdosageequipment, setotherdosageequipment] = useState('');
    const [BranName, setBranName] = React.useState([]);
    const [mchine_name, setmchine_name] = React.useState([]);
    const { EquipmetnId, navigation } = route.params
    const [isLoading, setIsLoading] = React.useState(true);
    const [EditEquipmetnData, setEditEquipmetn] = React.useState<any>({});
    const [equipmentdata, setEquipmentdata] = useState<any>({});
    const [frontBase64Image, setFrontBase64Image] = React.useState<string | null>(null);
    const [backimgBase64, setBackimgBase64] = React.useState<string | null>(null);


    const DosageEquipmentList = useSelector((state: any) => state.DosageEquipmentList);

    // console.log("here reducet equipment items", DosageEquipmentList);

    // const machionName = (DosageEquipmentList && DosageEquipmentList.machionName)
    //     ? DosageEquipmentList.machionName.map((machionName) => ({
    //         label: machionName.machion_name,
    //         value: machionName.id
    //     }))
    //     : [];

    // const brand = (DosageEquipmentList && DosageEquipmentList.brand)
    //     ? DosageEquipmentList.brand.map((brand) => ({
    //         label: brand.brand,
    //         value: brand.id
    //     }))
    //     : [];


    const getBrand = async (machineType) => {
        try {
            // console.log(item.value)
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const response = await api.equipment_brand_items(machineType, token)
                // console.log("response brand name",response.data)
                setBranName(response.data.data)
            }



        } catch (error) {
            console.log("get brand error:", error)
        }
    }

    const getMachineName = async (machineType) => {
        try {
            // console.log("machine type",machineType)
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const response = await api.equipment_machine_name(parseInt(machineType), token)
                // console.log("response machine name", response.data)
                setmchine_name(response.data.data)
            }



        } catch (error) {
            console.log("get brand error:", error)
        }
    }
    useEffect(() => {
        fetchDosageData();
        get_equipment_data();
    }, []);

    useEffect(() => {
        if (EditEquipmetnData.machine_type) {
            getBrand(EditEquipmetnData.machine_type);
            getMachineName(EditEquipmetnData.machine_type);
            setIsLoading(false);
        }
    }, [EditEquipmetnData.machine_type]);

    useEffect(() => {
        switch (EditEquipmetnData.machine_type) {
            case 1:
                setshowmachinetype(true);
                setshowcleaningmachine(false);
                setshowfishingequipment(false);
                setshowDryer(false);
                break;
            case 2:
                setshowmachinetype(false);
                setshowcleaningmachine(true);
                setshowfishingequipment(false);
                setshowDryer(false);
                break;
            case 3:
                setshowmachinetype(false);
                setshowcleaningmachine(false);
                setshowfishingequipment(true);
                setshowDryer(false);
                break;
            case 4:
                setshowmachinetype(false);
                setshowcleaningmachine(false);
                setshowfishingequipment(false);
                setshowDryer(true);
                break;
            default:
                setshowmachinetype(false);
                setshowcleaningmachine(false);
                setshowfishingequipment(false);
                setshowDryer(false);
        }
    }, [EditEquipmetnData.machine_type]);

    const fetchDosageData = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            try {
                const response = await api.edit_equipment(EquipmetnId, token)


                if (response.data.success === true) {
                    setEditEquipmetn(response.data.data)
                    setIsLoading(false)
                }

            } catch (error) {
                setIsLoading(false)
                console.log("get dosage error", error)
            }

        }

    }

    const get_equipment_data = async () => {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId')
        if (token && userId) {
            const response = await api.equipment_data(userId, token);


            if (response.data.success === true) {

                setEquipmentdata(response.data)
            }
        }


    }
    // Create an array of weights from 1 kg to 60 kg
    const weights = Array.from({ length: 60 }, (_, index) => (index + 1) + ' kg');
    const numberOptions = Array.from({ length: 100 }, (_, index) => index + 1);
    const Numberoftank = ["1", "2", "3"];
    const Volume = Array.from({ length: 300 }, (_, index) => (index + 1) + ' kg');
    const vmmachineTypes = ["Wash Extractor", "Barrier Machine", "Tunnel Washer"];
    const Solvent = ["Perchloethylen", "Hydrocarbon", "Intense", "Sensene", "Hyglo"];
    const heatType = ["Steam", "Electrical"];
    const programType = ["Card", "Computer"];
    const Filter = ["Nylon Powerless Fillter", "Nylon Powder Filter", "Cartridge Filter", "Cartridge Filter Decorator", "Active Carbon Filter", "Other"];
    const yes_no = ["Yes", "No"]
    const DistillationType = ["Steam", "Electrical"];
    const DistillationMethod = ["Full", "Partial"]
    const programname = ["Temperature", "Drying Time", "Cool down Time"]

    const convertToFormData = (data) => {
        const formData = new FormData();

        for (const [key, value] of Object.entries(data)) {
            // Skip appending if the value is "null" or if it's an object (like UpdatedRep_Image)
            if (value !== "null" && typeof value !== "object") {
                formData.append(key, value);
            }
        }

        return formData;
    };

    // const selectedCapacityIndex = weights.findIndex(weight => weight === EditEquipmetnData.capacity + ' kg');
    // const selectedValue = selectedCapacityIndex !== -1 ? selectedCapacityIndex.toString() : '';
    const submit = async () => {
        const token = await AsyncStorage.getItem('token');

        if (token) {
            try {
                const { front_image,install_year, back_image, ...dataWithoutImages } = EditEquipmetnData;

                        // Validate Installation Year
const currentYear = new Date().getFullYear();
const year = parseInt(install_year, 10);

if (
  !install_year ||                      // Empty check
  isNaN(year) ||                           // Not a number
  install_year.length !== 4 ||          // Not a 4-digit year
  year < 1900 || year > currentYear        // Invalid year range
) {
  ErrorMessage({ message: "Please enter a valid Installation Year" });
  return false;
}
                const equipmentdata = convertToFormData(dataWithoutImages);
                if (frontBase64Image) {
                    equipmentdata.append('front_image', {
                        uri: frontBase64Image,
                        name: 'front_image.jpg',
                        type: 'image/jpg',
                    });
                }

                // Conditionally add back_image if backimgBase64 exists
                if (backimgBase64) {
                    equipmentdata.append('back_image', {
                        uri: backimgBase64,
                        name: 'back_image.jpg',
                        type: 'image/jpeg',
                    });
                }
                setLoading(true)

                const respone = await api.update_equipment(EquipmetnId, token, equipmentdata)

                if (respone.data.success === true) {
                    SuccessMessage({
                        message: respone.data.message
                    })
                    setLoading(false)
                    navigation.navigate('Manage Equipments', { updatedEquipmentData: true });
                }

            } catch (error) {
                console.log("update shop error", error)
            }
        }
    }
    const shopOption = equipmentdata.shop?.map((shop) => ({
        label: shop.shop_name,
        value: shop.id
    })) || []

    const machineOption = equipmentdata.machinType?.map((machine) => ({
        label: machine.name,
        value: machine.id
    })) || []

    const dosage = equipmentdata.dosage?.map((dosage) => ({
        label: dosage.model_name,
        value: dosage.id
    })) || []

    dosage.push({
        label: 'Other',
        value: 7860 // You can set any unique value for "Other"
    });

    const brand = (BranName && BranName)
        ? BranName.map((brand) => ({
            label: brand.brand,
            value: brand.id
        }))
        : [];

    const machionName = (mchine_name && mchine_name)
        ? mchine_name.map((mchine_name) => ({
            label: mchine_name.machion_name,
            value: mchine_name.id
        }))
        : [];

    const handlefrontImage = (img) => {
        setFrontBase64Image(img)
    }


    const handleBackImage = (img) => {
        setBackimgBase64(img)
    }


    const handleSelectshop = (item) => {
        const newshopId = parseInt(item);
        setEditEquipmetn(prevData => ({ ...prevData, shop_id: newshopId }))
    }

    const handleSelectmachineType = (item) => {
        // console.log(item)
        getBrand(item)
        const newmachine_type = parseInt(item);
        setEditEquipmetn(prevData => ({ ...prevData, machine_type: newmachine_type }))
    }

    const handleSelectWeight = (item) => {
        // console.log(item)
        const capacity = item;
        setEditEquipmetn(prevData => ({ ...prevData, capacity: capacity }))
    }
    const handleSelectvm_machine = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, wm_machion_type: item }))
    }

    const handleSelectheattype = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, wm_heat_type: item }))
    }

    const handleSelectprogramtype = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, wm_program_type: item }))
    }
    const handleSelectvalume = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, wm_volume: item }))
    }

    const handleSelectNumberoftank = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dc_no_tank: item }))
    }

    const handleSelectSolvent = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dc_solvent: item }))
    }

    const handleSelect_dc_heattype = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dc_heat_Type: item }))
    }
    const handleSelect_dc_Filter = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dc_filter: item }))
    }

    const handleSelect_dc_FrequencyMotor = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dc_frequency_motor: item }))
    }
    const handleSelect_dc_SprayUnit = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dc_spray_unit: item }))
    }

    const handleSelect_dc_SolventCoolingSystem = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dc_solvent_cooling_system: item }))
    }
    const handleSelect_dc_Distillation = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dc_distilation: item }))
    }

    const handleSelect_dc_DistillationType = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dc_distilation_type: item }))
    }

    const handleSelect_dc_DistillationMethod = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dc_distilation_method: item }))
    }
    const handleSelectdosageequipment = (item) => {
        console.log(item)
        if (item === 7860) {

            setEditEquipmetn(prevData => ({ ...prevData, other_dosage: '' }))
        }
        //  else {
        // console.log("here serother",item)
        setEditEquipmetn(prevData => ({ ...prevData, dosage: item }))
        // }

    }

    const handleSelectVolume = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dryer_volume: item }))
    }

    const handleProgramNumber = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dryer_program_number: item }))
    }
    const handleprogramname = (item) => {
        setEditEquipmetn(prevData => ({ ...prevData, dryer_program_name: item }))
    }

    const handleDeletefrontImage = () => {
        setFrontBase64Image('')
    }

    const handleDeletebackImage = () => {
        setBackimgBase64('')
    }

    const handleDeletefrontImageapi = () => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this image?',
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        const token = await AsyncStorage.getItem('token');
                        if (token) {
                            try {
                                const response = await api.delete_equipment_front_image(EquipmetnId, token);
                                console.log("dosge from image", response)
                                if (response.data.success === true) {
                                    setEditEquipmetn((prevData) => ({
                                        ...prevData,
                                        front_image: ''
                                    }))
                                    setLoading(false);
                                }
                            } catch (error) {
                                console.log('delete dosage front image error:', error);
                            }
                        }
                    }
                }
            ],
            { cancelable: true }
        )

    }

    const handleDeletebackImageapi = () => {

        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this image?',
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        const token = await AsyncStorage.getItem('token');
                        if (token) {
                            try {
                                const response = await api.delete_equipment_back_image(EquipmetnId, token);
                                console.log("dosge from image", response)
                                if (response.data.success === true) {
                                    setEditEquipmetn((prevData) => ({
                                        ...prevData,
                                        back_image: ''
                                    }))
                                    setLoading(false);
                                }
                            } catch (error) {
                                console.log('delete dosage front image error:', error);
                            }
                        }
                    }
                }
            ],
            { cancelable: true }
        )

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

                <CustomHeader title="Edit Equipment" imgSource={require('../../../assets/img/profile_img.png')} />

                <View style={styles.maincontainer}>
                    {isLoading ? <View style={styles.loader}>
                        <ActivityIndicator size="large" color="gray" />
                    </View> :
                        <>
                            <ScrollView keyboardShouldPersistTaps="handled">
                                <View>
                                    <CustomEditDropdown title='Shop Name' data={shopOption} placeholder='Select Shop Name' iconName='shopping' onSelect={handleSelectshop} selectedValue={EditEquipmetnData.shop_id} isDisabled={false} required={true} />
                                    <CustomEditDropdown title='Machine Type' data={machineOption} placeholder='Select Machine Name' iconName='shopping' onSelect={handleSelectmachineType} selectedValue={EditEquipmetnData.machine_type} isDisabled={true} required={true} />


                                    <CustomEditDropdown
                                        title='Brand Name'
                                        data={brand}
                                        placeholder='Select Brand Name'
                                        iconName='shopping'
                                        onSelect={(item) => setEditEquipmetn(prevData => ({
                                            ...prevData,
                                            brand_name: item
                                        }))}
                                        selectedValue={EditEquipmetnData.brand_name}
                                        isDisabled={false}
                                    />


                                    {/* 
                                    <CustomTextInput title='Machine Name' value={EditEquipmetnData.machine_name} placeholder='Machine Name' onChangeText={machinename => {
                                        setEditEquipmetn(prevData => ({
                                            ...prevData,
                                            machine_name: machinename
                                        }))
                                    }} keyboardType='default' /> */}
                                    <CustomTextInput title='Model Name' value={EditEquipmetnData.model_name} placeholder='Model Name' onChangeText={(ModelName) => {
                                        setEditEquipmetn(prevData => ({
                                            ...prevData,
                                            model_name: ModelName
                                        }))
                                    }} keyboardType='default' />

                                    <CustomEditDropdown
                                        title='Capacity'
                                        isDisabled={false} data={weights.map((weight) => ({ label: weight, value: weight }))} placeholder="Select Capacity" iconName='weight-kilogram' onSelect={handleSelectWeight} selectedValue={EditEquipmetnData.capacity} />


                                    <CustomTextInput title='Installation Year' value={EditEquipmetnData.install_year} placeholder='Installation Year' onChangeText={(InstalationYear) => {
                                        setEditEquipmetn(prevData => ({
                                            ...prevData,
                                            install_year: InstalationYear
                                        }))
                                    }} keyboardType='default' />

                                    {showmachinetype ?
                                        <>
                                            <CustomEditDropdown
                                                title='Machine Type'
                                                isDisabled={false}
                                                data={vmmachineTypes.map((machineType) => ({ label: machineType, value: machineType }))}
                                                placeholder="Select Machine Type"
                                                iconName='state-machine'
                                                onSelect={handleSelectvm_machine}
                                                selectedValue={EditEquipmetnData.wm_machion_type}
                                            />

                                            <CustomEditDropdown
                                                title='Heat Type'
                                                isDisabled={false}
                                                data={heatType.map((heatType) => ({ label: heatType, value: heatType }))}
                                                placeholder="Select Heat Type"
                                                iconName='state-machine'
                                                onSelect={handleSelectheattype}
                                                selectedValue={EditEquipmetnData.wm_heat_type}
                                            />
                                            {/* 
                                            <CustomEditDropdown
                                                title='Volume'
                                                isDisabled={false}
                                                data={Volume.map((Volume) => ({ label: Volume, value: Volume }))}
                                                placeholder="Select Volume"
                                                iconName='state-machine'
                                                onSelect={handleSelectvalume}
                                                selectedValue={EditEquipmetnData.wm_volume}
                                            /> */}
                                            <CustomEditDropdown
                                                title='Program Type'
                                                isDisabled={false}
                                                data={programType.map((programType) => ({ label: programType, value: programType.toString() }))}
                                                placeholder="Select Program Type"
                                                iconName='state-machine'
                                                onSelect={handleSelectprogramtype}
                                                selectedValue={EditEquipmetnData.wm_program_type}
                                            />
                                        </>
                                        : null}


                                    {showcleaningmachine ? (
                                        <>
                                            <CustomEditDropdown
                                                title='Number of Tank(s)'
                                                isDisabled={false}
                                                data={Numberoftank.map((tank) => ({ label: tank, value: tank }))}
                                                placeholder="Select Number of Tank"
                                                iconName='fountain-pen-tip'
                                                onSelect={handleSelectNumberoftank}
                                                selectedValue={EditEquipmetnData.dc_no_tank}
                                            />
                                            <CustomEditDropdown
                                                title='Solvent Type'
                                                isDisabled={false}
                                                data={Solvent.map((Solvent) => ({ label: Solvent, value: Solvent }))}
                                                placeholder="Select Solvent Type"
                                                iconName='fountain-pen-tip'
                                                onSelect={handleSelectSolvent}
                                                selectedValue={EditEquipmetnData.dc_solvent}
                                            />

                                            <CustomEditDropdown
                                                title='Heat Type'
                                                isDisabled={false}
                                                data={heatType.map((heatType) => ({ label: heatType, value: heatType }))}
                                                placeholder="Select Heat Type"
                                                iconName='state-machine'
                                                onSelect={handleSelect_dc_heattype}
                                                selectedValue={EditEquipmetnData.dc_heat_Type}
                                            />


                                            <CustomEditDropdown
                                                title='Filter'
                                                isDisabled={false}
                                                data={Filter.map((heatType) => ({ label: heatType, value: heatType }))}
                                                placeholder="Select Filter"
                                                iconName='state-machine'
                                                onSelect={handleSelect_dc_Filter}
                                                selectedValue={EditEquipmetnData.dc_filter}
                                            />
                                            <CustomEditDropdown
                                                title='Frequency Motor'
                                                isDisabled={false}
                                                data={yes_no.map((heatType) => ({ label: heatType, value: heatType }))}
                                                placeholder="Select Frequency Motor"
                                                iconName='state-machine'
                                                onSelect={handleSelect_dc_FrequencyMotor}
                                                selectedValue={EditEquipmetnData.dc_frequency_motor}
                                            />

                                            <CustomEditDropdown
                                                title='Spray Unit'
                                                isDisabled={false}
                                                data={yes_no.map((heatType) => ({ label: heatType, value: heatType }))}
                                                placeholder="Select Spray Unit"
                                                iconName='state-machine'
                                                onSelect={handleSelect_dc_SprayUnit}
                                                selectedValue={EditEquipmetnData.dc_spray_unit}
                                            />
                                            <CustomEditDropdown
                                                title='Solvent Cooling System'
                                                isDisabled={false}
                                                data={yes_no.map((heatType) => ({ label: heatType, value: heatType }))}
                                                placeholder="Select Solvent Cooling System"
                                                iconName='state-machine'
                                                onSelect={handleSelect_dc_SolventCoolingSystem}
                                                selectedValue={EditEquipmetnData.dc_solvent_cooling_system}
                                            />

                                            <CustomEditDropdown
                                                title='Distillation'
                                                isDisabled={false}
                                                data={yes_no.map((heatType) => ({ label: heatType, value: heatType }))}
                                                placeholder="Select Distillation"
                                                iconName='state-machine'
                                                onSelect={handleSelect_dc_Distillation}
                                                selectedValue={EditEquipmetnData.dc_distilation}
                                            />

                                            <CustomEditDropdown
                                                title='Distillation Type'
                                                isDisabled={false}
                                                data={DistillationType.map((heatType) => ({ label: heatType, value: heatType }))}
                                                placeholder="Select Distillation Type"
                                                iconName='state-machine'
                                                onSelect={handleSelect_dc_DistillationType}
                                                selectedValue={EditEquipmetnData.dc_distilation_type}
                                            />

                                            <CustomEditDropdown
                                                title='Distillation Method'
                                                isDisabled={false}
                                                data={DistillationMethod.map((heatType) => ({ label: heatType, value: heatType }))}
                                                placeholder="Select Distillation Method "
                                                iconName='state-machine'
                                                onSelect={handleSelect_dc_DistillationMethod}
                                                selectedValue={EditEquipmetnData.dc_distilation_method}
                                            />



                                        </>
                                    ) : null}

                                    {showfishingequipment ? (
                                        <>
                                            <CustomEditDropdown
                                                title='Machine Name'
                                                data={machionName}
                                                placeholder='Select Machine Name'
                                                iconName='shopping'
                                                onSelect={(item) => setEditEquipmetn(prevData => ({
                                                    ...prevData,
                                                    machine_name: item
                                                }))}
                                                selectedValue={EditEquipmetnData.machine_name}
                                                isDisabled={false}
                                            />

                                            <CustomTextInput title='Finishing Equipment Type' value={EditEquipmetnData.fe_finishing_equipment_type} placeholder='Finishing Equipment Type' onChangeText={(finishing_equipment_type) => {
                                                setEditEquipmetn(prevData => ({
                                                    ...prevData,
                                                    fe_finishing_equipment_type: finishing_equipment_type
                                                }))
                                            }} keyboardType='default' />
                                        </>
                                    ) : null}

                                    {showDryer ? (
                                        <>
                                            <CustomTextInput title='Dryer Type' value={EditEquipmetnData.dryer_type} placeholder='Dryer Type' onChangeText={(Dryer) => {
                                                setEditEquipmetn(prevData => ({
                                                    ...prevData,
                                                    dryer_type: Dryer
                                                }))
                                            }} keyboardType='default' />
                                            <CustomEditDropdown
                                                title='Volume'
                                                isDisabled={false}
                                                data={weights.map((Volume) => ({ label: Volume, value: Volume }))}
                                                placeholder="Select Volume"
                                                iconName='weight-kilogram'
                                                onSelect={handleSelectVolume}
                                                selectedValue={EditEquipmetnData.dryer_volume}
                                            />
                                            <CustomEditDropdown
                                                title='Program Number'
                                                isDisabled={false}
                                                data={numberOptions.map((number) => ({
                                                    label: number.toString(),
                                                    value: number.toString(),
                                                }))}
                                                placeholder="Select Program Number"
                                                iconName="format-list-numbered-rtl"
                                                onSelect={handleProgramNumber}
                                                selectedValue={EditEquipmetnData.dryer_program_number}
                                            />

                                            <CustomEditDropdown
                                                title='Program Name'
                                                isDisabled={false}
                                                data={programname.map((number) => ({
                                                    label: number.toString(),
                                                    value: number.toString(),
                                                }))}
                                                placeholder="Program Name"
                                                iconName="format-list-numbered-rtl"
                                                onSelect={handleprogramname}
                                                selectedValue={EditEquipmetnData.dryer_program_name}
                                            />

                                        </>
                                    ) : null}

                                    {
                                        (showmachinetype || showfishingequipment || showcleaningmachine) ? (

                                            <>


                                                {/* {EditEquipmetnData.dosage ===7860 ? ( */}

                                                <CustomEditDropdown
                                                    title='Dosage Equipment'
                                                    isDisabled={false}
                                                    data={dosage}
                                                    placeholder="Select Dosage Equipment"
                                                    iconName='fountain-pen-tip'
                                                    onSelect={handleSelectdosageequipment}
                                                    selectedValue={EditEquipmetnData.dosage}
                                                />
                                                {/* ) : null}  */}

                                                {EditEquipmetnData.dosage === 7860 ? (
                                                    <CustomTextInput title='Other Dosage Equipment' value={EditEquipmetnData.other_dosage} placeholder='Other Dosage Equipment' onChangeText={(other_dosage) => {
                                                        setEditEquipmetn(prevData => ({
                                                            ...prevData,
                                                            other_dosage: other_dosage
                                                        }))
                                                    }} keyboardType='default' secureTextEntry={false} />
                                                ) : null}




                                            </>
                                        ) : null
                                    }



                                    <TouchableOpacity onPress={handleFrontImageModalVisible} style={styles.ImageContainer}>
                                        <Text style={{ fontSize: 17, color: "#333" }}>Add Front Image</Text>
                                        <Text style={{ fontSize: 23, color: "#00aaf0" }}>+</Text>
                                    </TouchableOpacity>
                                    <View style={styles.selectedimgcontainer}>
                                        {frontBase64Image ? (
                                            <View >
                                                <Image source={{ uri: frontBase64Image }} style={styles.selectedimg} />
                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={() => handleDeletefrontImage()}
                                                >
                                                    <Text style={styles.deleteButtonText}>X</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) :
                                            null
                                        }
                                        {EditEquipmetnData.front_image ? (
                                            <View style={styles.selectedimgcontainer}>
                                                <Image source={{ uri: `${Image_Base_Url}/${EditEquipmetnData.front_image}` }} style={styles.selectedimg} />
                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={handleDeletefrontImageapi}
                                                >
                                                    <Text style={styles.deleteButtonText}>X</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : null}
                                    </View>

                                    <TouchableOpacity onPress={handleBackImageModalVisible} style={styles.ImageContainer}>
                                        <Text style={{ fontSize: 17, color: "#333" }}>Add Back Image</Text>
                                        <Text style={{ fontSize: 23, color: "#00aaf0" }}>+</Text>
                                    </TouchableOpacity>
                                    <View style={styles.selectedimgcontainer}>
                                        {backimgBase64 ? (
                                            <View style={styles.selectedimgcontainer}>
                                                <Image source={{ uri: backimgBase64 }} style={styles.selectedimg} />

                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={() => handleDeletebackImage()}
                                                >
                                                    <Text style={styles.deleteButtonText}>X</Text>
                                                </TouchableOpacity>
                                            </View>

                                        ) : null}
                                        {EditEquipmetnData.back_image ? (
                                            <View style={styles.selectedimgcontainer}>
                                                <Image source={{ uri: `${Image_Base_Url}/${EditEquipmetnData.back_image}` }} style={styles.selectedimg} />

                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={() => handleDeletebackImageapi()}
                                                >
                                                    <Text style={styles.deleteButtonText}>X</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : null}
                                    </View>

                                </View>
                            </ScrollView>


                            <TouchableOpacity onPress={submit} style={styles.addtext}>
                                <Text style={styles.adddequipmenttext}>Update Equipment</Text>
                            </TouchableOpacity>
                        </>
                    }
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
            </SafeAreaView>
            {/* 
            {
                Loading ? (
                    <View style={styles.submitloader}>
                        <ActivityIndicator animating={Loading} size="large" color="white" />
                    </View>
                ) : null
            } */}
            <Loader loading={Loading} />
        </>

    )
}

export default EditEquipment