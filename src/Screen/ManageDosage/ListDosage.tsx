import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, Image, TextInput, FlatList, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
import api from '../../api/Api';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DosageCard from '../../components/DosageCard';
import { useDispatch, useSelector } from 'react-redux';
import {
    responsiveHeight,
} from "react-native-responsive-dimensions";
import { useRoute } from '@react-navigation/native';
import { Image_Base_Url } from '../../api/Api';
import CommonCard from '../../components/Common/CommonCard';
import { setDosageItems } from '../../Reducer/slices/dosageItemsSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

interface dosageprops {
    navigation: any
}

interface dosage {
    id: number;
    model_name: string;
    model_no: string;
    product_no: string;
    pupmps_no: number
    status: number
}

const ListDosage: React.FC<dosageprops> = (props) => {
    const userData = useSelector((state: any) => state.user.userData)
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');

    const [checkEquipmentpData, setCheckEquipmentData] = React.useState<boolean>(false)
 
    const dispatch=useDispatch()
    const [dosageData, setDosageData] = React.useState<dosage[]>([])

    useEffect(() => {
        get_dosage();
        get_dosage_items()
    }, [checkEquipmentpData])

    const route = useRoute();



    useEffect(() => {
        if (route.params && route.params.updatedDosageData ===true) {
            get_dosage()
        }
      }, [route.params]);

    const get_dosage_items=async()=>{
        const token = await AsyncStorage.getItem('token');
        if(token){
            setIsLoading(true)
            try{
                const response=await api.dosage_items(token)
                if(response.data.success===true){
                    // console.log("dosage item response",response.data)
                    dispatch(setDosageItems(response.data.data))
                    setIsLoading(false)

                }
                

            }catch(error){
                console.log("dosage items error",error)
            }
        }

    }

    const get_dosage = async () => {
        const userId = await AsyncStorage.getItem('userId')
        const token = await AsyncStorage.getItem('token');

        if (userId && token) {
            try {
                const response = await api.get_dosage(userId, token)
                setDosageData(response.data)
                setIsLoading(false);
            } catch (error) {
                console.log("view dosage", error)
            }

        }
    }

    // here filter shop data
    const filteredDosageData = dosageData.filter(item =>
        item.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model_no.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDosageAddition = (newShop: any) => {
        // setDosageData(prevShopData => [...prevShopData, newShop]);
        setCheckEquipmentData(!checkEquipmentpData)
    };


    // for add dosage 
    const adddosage = () => {
        props.navigation.navigate("AddDosage", { onDosageAdded: handleDosageAddition });
    }
    const handleDosageDeletion = (deletedShopId: number) => {
        // Update shopData by removing the deleted shop
        setDosageData(prevShopData => prevShopData.filter(shop => shop.id !== deletedShopId));
    };

    const renderItem = ({ item, index }: { item: shop, index: number }) => (
        <DosageCard props={item} index={index + 1} onDelete={handleDosageDeletion} navigation={props.navigation} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.drawerButton}
                    onPress={() => props.navigation.openDrawer()}
                >
                    {/* You can use a drawer icon here */}
                    <Icon name="menu-open" size={responsiveHeight(4.5)} color="white" />
                </TouchableOpacity>
                <Text style={styles.dosagetitle}>Manage Dosages</Text>
                <View style={styles.imgcontainer}>

                    {userData.profile_photo_path ? (

                        <Image source={{ uri: `${Image_Base_Url}/images/user/${userData.profile_photo_path}` }} style={styles.profileimg} />

                    ) :
                        <Image source={require('../../assets/img/default_profile.jpg')} style={styles.profileimg} />}
                </View>
            </View>



            <View style={styles.searchcontainer}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={"#787a7c"}
                    placeholder="Search By Manufacturer or Model Name"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* here shop view */}
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <TouchableOpacity style={styles.addcontainer} onPress={adddosage}>
                    <Text style={styles.addtext}>+ Add New Dosage</Text>
                </TouchableOpacity>

                {filteredDosageData.length === 0 && isLoading === false ? (
                    <CommonCard>
                        <Text style={{ justifyContent: "center", alignSelf: "center" ,color:"#000" }}>No Dosage Data</Text>
                    </CommonCard>
                ) : (

                    <FlatList
                    style={{flex:1,marginBottom:20}}
                        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => get_dosage()} />}
                        data={filteredDosageData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()} // Assuming each shop has an id
                     
                    />
                )}

            </View>
        </SafeAreaView>
    )
}

export default ListDosage