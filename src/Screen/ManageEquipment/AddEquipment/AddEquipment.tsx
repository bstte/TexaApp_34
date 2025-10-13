import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Image, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import styles from './styles';
import CustomHeader from '../../CustomHeader/CustomHeader';
import axios, { AxiosError } from 'axios';
import api from '../../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDropdown from '../../../components/CustomDropdown';
import Popup from '../../../components/Popup';
import CustomImageModal from '../../../components/CustomImageModal';
import CustomTextInput from '../../../components/CustomTextInput';
import Loader from '../../../components/Loader';
import SuccessMessage, { ErrorMessage } from '../../../components/Common/CustomTostMessage';
import { useSelector } from 'react-redux';
import CustomDropdownWithAddItem from '../../../components/CustomDropdownWithAddItem';
import { handleApiError } from '../../utils/handleApiError';
import { SafeAreaView } from 'react-native-safe-area-context';
interface EquipmentProps {
    route: any,
    navigation: any
}

const AddEquipment: React.FC<EquipmentProps> = ({ route, navigation }) => {

    // for show text acor machine type
    const [showmachinetype, setshowmachinetype] = useState(false)
    const [showcleaningmachine, setshowcleaningmachine] = useState(false)
    const [showfishingequipment, setshowfishingequipment] = useState(false)
    const [showDryer, setshowDryer] = useState(false)

    const [isFrontImageModalVisible, setFrontImageModalVisible] = React.useState(false)
    const [isBackImageModalVisible, setBackImageModalVisible] = React.useState(false)
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [dosagemodalVisible, setDosagemodalVisible] = React.useState<boolean>(false);
    const [modalMessage, setModalMessage] = React.useState<string>('');
    const [BranName, setBranName] = React.useState([]);
    const [mchine_name, setmchine_name] = React.useState([]);

    const [equipmentdata, setEquipmentdata] = useState<any>({});
    const [ShopName, setShopName] = useState('');
    const [MachineType, setMachineType] = useState('');
    const [BrandName, setBrandName] = useState('')
    const [MachineName, setMachineName] = useState('')
    const [ModelName, setModelName] = useState('')
    const [Capacity, setCapacity] = useState('');
    const [InstalationYear, setInstalationYear] = useState('')
    const [wm_machion_type, setwm_machion_type] = useState('');
    const [wm_heat_type, setwm_heat_type] = useState('');
    const [wm_program_type, setwm_program_type] = useState('');
    // const [wm_volume, setwm_volume] = useState('');
    const [dosageequipment, setdosageequipment] = useState('');
    const [otherdosageequipment, setotherdosageequipment] = useState('');
    const [dc_no_tank, setNumberoftank] = useState('');
    const [dc_solvent, setdc_solvent] = useState('');
    const [dc_heat_Type, setdc_heat_Type] = useState('');
    const [dc_filter, setdc_filter] = useState('');
    const [dc_frequency_motor, setdc_frequency_motor] = useState('');
    const [dc_spray_unit, setdc_spray_unit] = useState('');
    const [dc_solvent_cooling_system, setdc_solvent_cooling_system] = useState('');
    const [dc_distilation, setdc_distilation] = useState('');
    const [dc_distilation_type, setdc_distilation_type] = useState('');
    const [dc_distilation_method, setdc_distilation_method] = useState('');
    const [fe_finishing_equipment_type, setfe_finishing_equipment_type] = useState('')
    const [dryer_type, setdryer_type] = useState('')
    const [dryer_volume, setdryer_volume] = useState('');
    const [dryer_program_number, setdryer_program_number] = useState('');
    const [dryer_program_name, setdryer_program_name] = useState('');
    const [frontBase64Image, setFrontBase64Image] = React.useState<string | null>(null);
    const [backimgBase64, setBackimgBase64] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [addbrandId, SetaddbrandId] = useState('')
    const [addmachineId, SetaddmachineId] = useState('')

    const DosageEquipmentList = useSelector((state: any) => state.DosageEquipmentList);


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

    useEffect(() => {
        get_equipment_data()

    }, [])

    const get_equipment_data = async () => {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId')
        if (token && userId) {
            const response = await api.equipment_data(userId, token);

            if (response.data.success === true) {
                // console.log("equipment", response.data)
                setEquipmentdata(response.data)
                console.log(response.data.dosage)
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


    // console.log("machineOption",machineOption)

    const dosage = (equipmentdata.dosage || []).map((dosage) => ({
        label: dosage.model_name.toString(),
        value: dosage.id
    }));

    dosage.push({
        label: 'Other',
        value: 7860 // You can set any unique value for "Other"
    });



    const handlefrontImage = (img) => {
        setFrontBase64Image(img)
    }


    const handleBackImage = (img) => {
        setBackimgBase64(img)
    }



    const closeModal = () => {
        setModalVisible(false);
    }

    // Create an array of weights from 1 kg to 60 kg
    const weights = Array.from({ length: 60 }, (_, index) => (index + 1) + ' kg');
    const capacity = Array.from({ length: 55 }, (_, index) => (index + 6) + ' kg');

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

    const submit = async () => {
        const userId = await AsyncStorage.getItem('userId');
        if (ShopName === '') {
            ErrorMessage({
                message: "The shop name field is required"
            })

            return false
        }

        if (MachineType === '') {
            ErrorMessage({
                message: "The machine type field is required"
            })

            return false
        }

        // Validate Installation Year
        const currentYear = new Date().getFullYear();
        const year = parseInt(InstalationYear, 10);

        if (
            !InstalationYear ||                      // Empty check
            isNaN(year) ||                           // Not a number
            InstalationYear.length !== 4 ||          // Not a 4-digit year
            year < 1900 || year > currentYear        // Invalid year range
        ) {
            ErrorMessage({ message: "Please enter a valid Installation Year" });
            return false;
        }


        const equipmentdata = new FormData();

        equipmentdata.append('user_id', userId);
        equipmentdata.append('shop_id', ShopName.toString());
        equipmentdata.append('machine_type', MachineType.toString());
        equipmentdata.append('brand_name', BrandName);
        equipmentdata.append('machine_name', MachineName);
        equipmentdata.append('model_name', ModelName);
        equipmentdata.append('capacity', Capacity);
        equipmentdata.append('install_year', InstalationYear);
        // if(otherdosageequipment){
        equipmentdata.append('other_dosage', otherdosageequipment);
        // }else{
        equipmentdata.append('dosage', dosageequipment.toString());
        // }

        equipmentdata.append('dc_no_tank', dc_no_tank);
        equipmentdata.append('dc_solvent', dc_solvent);
        equipmentdata.append('dc_heat_Type', dc_heat_Type);
        equipmentdata.append('dc_filter', dc_filter);
        equipmentdata.append('dc_frequency_motor', dc_frequency_motor);
        equipmentdata.append('dc_spray_unit', dc_spray_unit);
        equipmentdata.append('dc_solvent_cooling_system', dc_solvent_cooling_system);
        equipmentdata.append('dc_distilation', dc_distilation);
        equipmentdata.append('dc_distilation_type', dc_distilation_type);
        equipmentdata.append('dc_distilation_method', dc_distilation_method);
        equipmentdata.append('wm_machion_type', wm_machion_type);
        equipmentdata.append('wm_heat_type', wm_heat_type);
        // equipmentdata.append('wm_volume', wm_volume);
        equipmentdata.append('wm_program_type', wm_program_type);
        equipmentdata.append('fe_finishing_equipment_type', fe_finishing_equipment_type);
        equipmentdata.append('dryer_type', dryer_type);
        equipmentdata.append('dryer_volume', dryer_volume);
        equipmentdata.append('dryer_program_number', dryer_program_number);
        equipmentdata.append('dryer_program_name', dryer_program_name);
        if (frontBase64Image) {
            equipmentdata.append('front_image', {
                uri: frontBase64Image,
                name: 'front_image.jpg',
                type: 'image/jpg',
            });
        }

        if (backimgBase64) {
            equipmentdata.append('back_image', {
                uri: backimgBase64,
                name: 'back_image.jpg', // You can adjust the file name and type here
                type: 'image/jpeg', // Adjust the file type if necessary
            });
        }
        equipmentdata.append('status', '1');



        const token = await AsyncStorage.getItem('token');
        if (token) {
            try {
                setIsLoading(true)
                const response = await api.add_equipment(equipmentdata, token);
                if (response.data.success === true) {
                    SuccessMessage({
                        message: response.data.message
                    })
                    setIsLoading(false)
                    route.params.onEquipmentAdded();
                    navigation.goBack();
                }

            } catch (error) {
                console.log("add equipment errer:", error)
                setIsLoading(false)
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 400) {
                    if (typeof axiosError.response.data === 'object') {
                        const responseData = axiosError.response.data as { message: { brand_name: string, capacity: string, install_year: string, machine_name: string, machine_type: string, model_name: string, shop_id: string } };
                        if (responseData.message.shop_id) {
                            setModalMessage("The Shop name field is required");
                            setModalVisible(true);
                            return;
                        }
                        if (responseData.message.machine_type) {
                            setModalMessage(responseData.message.machine_type);
                            setModalVisible(true);
                            return;
                        }
                        if (responseData.message.brand_name) {
                            setModalMessage(responseData.message.brand_name);
                            setModalVisible(true);
                            return;
                        }
                        if (responseData.message.capacity) {
                            setModalMessage(responseData.message.capacity);
                            setModalVisible(true);
                            return;
                        }
                        if (responseData.message.install_year) {
                            setModalMessage(responseData.message.install_year);
                            setModalVisible(true);
                            return;
                        }
                        if (responseData.message.machine_name) {
                            setModalMessage(responseData.message.machine_name);
                            setModalVisible(true);
                            return;
                        }

                        if (responseData.message.model_name) {
                            setModalMessage(responseData.message.model_name);
                            setModalVisible(true);
                            return;
                        }

                    }
                }
            }
        }

    }
    const handleSelectshop = (item) => {
        setShopName(item.value);
    };

    const getBrand = async (machineType) => {
        try {
            // console.log(item.value)
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const response = await api.equipment_brand_items(machineType, token)

                setBranName(response.data.data)
            }



        } catch (error) {
            console.log("get brand error:", error)
        }
    }

    const getMachineName = async (machineType) => {
        try {
            console.log(machineType)
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

    const handleSelectmachine = async (item) => {


        setMachineType(item.value)
        getBrand(item.value)
        getMachineName(item.value)
        switch (item.value) {
            case 1:
                setshowmachinetype(true)
                setshowcleaningmachine(false)
                setshowfishingequipment(false)
                setshowDryer(false)

                break;
            case 2:
                setshowmachinetype(false)
                setshowcleaningmachine(true)
                setshowfishingequipment(false)
                setshowDryer(false)
                break;
            case 3:
                setshowmachinetype(false)
                setshowcleaningmachine(false)
                setshowfishingequipment(true)
                setshowDryer(false)
                break;
            case 4:
                setshowmachinetype(false)
                setshowcleaningmachine(false)
                setshowfishingequipment(false)
                setshowDryer(true)
                break;
            // ... Add more cases for other IDs
            default:
                setshowmachinetype(false)
                setshowcleaningmachine(false)
                setshowfishingequipment(false)
                setshowDryer(false)
        }

    }

    const handleSelectWeight = (item) => {
        setCapacity(item.value)
    }

    const handleSelectvm_machine = (item) => {
        setwm_machion_type(item.value)
    }

    const handleSelectheattype = (item) => {
        setwm_heat_type(item.value)
    }

    const handleSelectvalume = (item) => {
        // setwm_volume(item.value)
    }
    const handleSelectprogramtype = (item) => {
        setwm_program_type(item.value)
    }

    const handleSelectdosageequipment = (item) => {
        if (item.value === 7860) {
            otherdosageModal()
            setdosageequipment(item.value)
        } else {
            setotherdosageequipment('')
            setdosageequipment(item.value)
        }

    }
    const handleSelectNumberoftank = (item) => {
        setNumberoftank(item.value)
    }

    const handleSelectSolvent = (item) => {
        setdc_solvent(item.value)
    }

    const handleSelect_dc_heattype = (item) => {
        setdc_heat_Type(item.value)
    }
    const handleSelect_dc_Filter = (item) => {
        setdc_filter(item.value)
    }

    const handleSelect_dc_FrequencyMotor = (item) => {
        setdc_frequency_motor(item.value)
    }

    const handleSelect_dc_SprayUnit = (item) => {
        setdc_spray_unit(item.value)
    }

    const handleSelect_dc_SolventCoolingSystem = (item) => {
        setdc_solvent_cooling_system(item.value)
    }

    const handleSelect_dc_Distillation = (item) => {
        setdc_distilation(item.value)
    }

    const handleSelect_dc_DistillationType = (item) => {
        setdc_distilation_type(item.value)
    }

    const handleSelect_dc_DistillationMethod = (item) => {
        setdc_distilation_method(item.value)
    }


    const handleSelectVolume = (item) => {
        setdryer_volume(item.value)
    }

    const handleProgramNumber = (item) => {
        setdryer_program_number(item.value)
    }

    const handleprogramname = (item) => {
        setdryer_program_name(item.value)
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

    const otherdosageModal = () => {
        setDosagemodalVisible(!dosagemodalVisible)
    }
    const addNewItem = async (item) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const dosage_name = {
                machin_type_id: MachineType,
                brand: item
            }
            if (token) {
                const response = await api.equiment_add(token, dosage_name)
                if (response.data.success === true) {
                    SetaddbrandId(response.data.data.id)
                    // console.log("response brand name", response.data.data.id)
                    // Alert.alert("Success",response.data.message)
                    getBrand(MachineType)

                }
                // console.log(response)
            }


        } catch (error) {
            console.error("addnewItem error:", error)
        }

    }

    const addMachineItem = async (item) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const machion_name = {

                machion_name: item
            }
            if (token) {
                const response = await api.equiment_machineName_add(token, machion_name, parseInt(MachineType))
                if (response.data.success === true) {
                    // Alert.alert("Success",response.data.message)
                    SetaddmachineId(response.data.data.id)
                    getMachineName(MachineType)

                }
                // console.log(response)
            }


        } catch (error) {
            handleApiError(error, "addnewItem error:")

        }

    }
    return (

        <>

            <SafeAreaView style={styles.container}>

                <CustomHeader title="Add New Equipment" imgSource={require('../../../assets/img/profile_img.png')} />
                <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0} // adjust if header overlaps
                    >
                <View style={styles.maincontainer}>
                 
                        <ScrollView keyboardShouldPersistTaps="handled">
                            <View>

                                <CustomDropdown title='Shop Name' data={shopOption} placeholder='Select Shop Name' onSelect={handleSelectshop} required={true} />
                                <CustomDropdown title='Machine Type' data={machineOption} placeholder='Select Machine Type' onSelect={handleSelectmachine} required={true} />
                                <CustomDropdownWithAddItem title='Brand Name' data={brand} placeholder='Select Brand Name' onSelect={(item) => {

                                    setBrandName(item.value)
                                    SetaddbrandId('')
                                }} addNewItem={addNewItem} selectedValue={addbrandId} />

                                {/* <CustomTextInput title='Brand Name' value={BrandName} placeholder='Brand Name' onChangeText={(brandname) => setBrandName(brandname)} keyboardType='default' /> */}

                                {/* <CustomTextInput title='Machine Name' value={MachineName} placeholder='Machine Name' onChangeText={(MachineName) => setMachineName(MachineName)} keyboardType='default' /> */}



                                <CustomTextInput title='Model Name' value={ModelName} placeholder='Model Name' onChangeText={(ModelName) => setModelName(ModelName)} keyboardType='default' />
                                <CustomDropdown
                                    title='Capacity'
                                    data={capacity.map((weight) => ({ label: weight, value: weight }))}
                                    placeholder="Select Capacity"
                                    onSelect={handleSelectWeight}
                                />
                                <CustomTextInput title='Installation Year' value={InstalationYear} placeholder='Installation Year' onChangeText={(InstalationYear) => setInstalationYear(InstalationYear)} keyboardType="phone-pad" />
                                {showmachinetype ?
                                    <>
                                        <CustomDropdown
                                            title='Machine Type'
                                            data={vmmachineTypes.map((machineType) => ({ label: machineType, value: machineType }))}
                                            placeholder="Select Machine Type"
                                            onSelect={handleSelectvm_machine}
                                        />

                                        <CustomDropdown
                                            title='Heat Type'
                                            data={heatType.map((heatType) => ({ label: heatType, value: heatType }))}
                                            placeholder="Select Heat Type"

                                            onSelect={handleSelectheattype}
                                        />
                                        {/* 
                                    <CustomDropdown
                                        title='Volume'
                                        data={Volume.map((Volume) => ({ label: Volume, value: Volume }))}
                                        placeholder="Select Volume"

                                        onSelect={handleSelectvalume}
                                    /> */}
                                        <CustomDropdown
                                            title='Program Type'
                                            data={programType.map((programType) => ({ label: programType, value: programType }))}
                                            placeholder="Select Program Type"

                                            onSelect={handleSelectprogramtype}
                                        />
                                    </>
                                    : null}



                                {showcleaningmachine ? (
                                    <>
                                        <CustomDropdown
                                            title='Number of Tank(s)'
                                            data={Numberoftank.map((tank) => ({ label: tank, value: tank }))}
                                            placeholder="Select Number of Tank"
                                            iconName='fountain-pen-tip'
                                            onSelect={handleSelectNumberoftank}
                                        />
                                        <CustomDropdown
                                            title='Solvent Type'
                                            data={Solvent.map((Solvent) => ({ label: Solvent, value: Solvent }))}
                                            placeholder="Select Solvent Type"
                                            iconName='fountain-pen-tip'
                                            onSelect={handleSelectSolvent}
                                        />

                                        <CustomDropdown
                                            title='Heat Type'
                                            data={heatType.map((heatType) => ({ label: heatType, value: heatType }))}
                                            placeholder="Select Heat Type"

                                            onSelect={handleSelect_dc_heattype}
                                        />


                                        <CustomDropdown
                                            title='Filter'
                                            data={Filter.map((heatType) => ({ label: heatType, value: heatType }))}
                                            placeholder="Select Filter"

                                            onSelect={handleSelect_dc_Filter}
                                        />
                                        <CustomDropdown
                                            title='Frequency Motor'
                                            data={yes_no.map((heatType) => ({ label: heatType, value: heatType }))}
                                            placeholder="Select Frequency Motor"

                                            onSelect={handleSelect_dc_FrequencyMotor}
                                        />

                                        <CustomDropdown
                                            title='Spray Unit'
                                            data={yes_no.map((heatType) => ({ label: heatType, value: heatType }))}
                                            placeholder="Select Spray Unit"

                                            onSelect={handleSelect_dc_SprayUnit}
                                        />
                                        <CustomDropdown
                                            title='Solvent Cooling System'
                                            data={yes_no.map((heatType) => ({ label: heatType, value: heatType }))}
                                            placeholder="Select Solvent Cooling System"

                                            onSelect={handleSelect_dc_SolventCoolingSystem}
                                        />

                                        <CustomDropdown
                                            title='Distillation'
                                            data={yes_no.map((heatType) => ({ label: heatType, value: heatType }))}
                                            placeholder="Select Distillation"

                                            onSelect={handleSelect_dc_Distillation}
                                        />

                                        <CustomDropdown
                                            title='Distillation Type'
                                            data={DistillationType.map((heatType) => ({ label: heatType, value: heatType }))}
                                            placeholder="Select Distillation Type"

                                            onSelect={handleSelect_dc_DistillationType}
                                        />

                                        <CustomDropdown
                                            title='Distillation Method'
                                            data={DistillationMethod.map((heatType) => ({ label: heatType, value: heatType }))}
                                            placeholder="Select Distillation Method "

                                            onSelect={handleSelect_dc_DistillationMethod}
                                        />



                                    </>
                                ) : null}


                                {showfishingequipment ? (
                                    <>
                                        <CustomDropdownWithAddItem title='Machine Name' data={machionName} placeholder='Select Machine Name' onSelect={(item) => {
                                            setMachineName(item.value)
                                            SetaddmachineId('')
                                        }} addNewItem={addMachineItem} selectedValue={addmachineId} />
                                        <CustomTextInput title='Finishing Equipment Type' value={fe_finishing_equipment_type} placeholder='Finishing Equipment Type' onChangeText={(finishing_equipment_type) => setfe_finishing_equipment_type(finishing_equipment_type)} keyboardType='default' />
                                    </>
                                ) : null}

                                {showDryer ? (
                                    <>
                                        <CustomTextInput title='Dryer Type' value={dryer_type} placeholder='Dryer Type' onChangeText={(ryer_type) => setdryer_type(ryer_type)} keyboardType='default' />
                                        <CustomDropdown
                                            title='Volume'
                                            data={weights.map((Volume) => ({ label: Volume, value: Volume }))}
                                            placeholder="Select Volume"

                                            onSelect={handleSelectVolume}
                                        />
                                        <CustomDropdown
                                            title='Program Number'
                                            data={numberOptions.map((number) => ({
                                                label: number.toString(),
                                                value: number.toString(),
                                            }))}
                                            placeholder="Select Program Number"

                                            onSelect={handleProgramNumber}
                                        />
                                        <CustomDropdown
                                            title='Program Name'
                                            data={programname.map((number) => ({
                                                label: number.toString(),
                                                value: number.toString(),
                                            }))}
                                            placeholder="Program Name"

                                            onSelect={handleprogramname}
                                        />

                                    </>
                                ) : null}




                                {
                                    (showmachinetype || showfishingequipment || showcleaningmachine) ? (
                                        <>
                                            <CustomDropdown
                                                title='Dosage Equipments'
                                                data={dosage}
                                                placeholder="Select Dosage Equipment"

                                                onSelect={handleSelectdosageequipment}
                                            />

                                            {otherdosageequipment ? (
                                                <>
                                                    <CustomTextInput title='Other Dosage Equipment' value={otherdosageequipment} placeholder='Other Buyer Name' onChangeText={(other_buyer_name) => setotherdosageequipment(other_buyer_name)} keyboardType='default' secureTextEntry={false} />
                                                </>

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
                                    <Text style={{ fontSize: 17, color: "#333" }}>Add Back Image</Text>
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
                 
                    <TouchableOpacity onPress={submit} style={styles.addtext}>
                        <Text style={styles.adddequipmenttext}>Add Equipment</Text>
                    </TouchableOpacity>
                </View>
                </KeyboardAvoidingView>
                <View >
                    <Modal
                        visible={dosagemodalVisible}
                        animationType="slide"
                        transparent={true}
                    >
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the background color and opacity
                        }}>
                            <View style={{
                                width: '95%',
                                // maxWidth: 400, // Set a max width if needed
                                backgroundColor: '#fff',
                                borderRadius: 10,
                                padding: 20,
                            }}>

                                {/* <Text style={styles.textinputlabel}>Other Buyer Name</Text> */}

                                <TextInput placeholderTextColor={'#787a7c'} style={styles.input} autoCapitalize='none'
                                    autoCorrect={false} placeholder='Enter Dosage Equipment' onChangeText={(other_buyer_name) => setotherdosageequipment(other_buyer_name)} />
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={otherdosageModal}>
                                    <Text style={styles.modalOk}>Save</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>
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

            <Loader loading={isLoading} />
        </>

    )
}

export default AddEquipment