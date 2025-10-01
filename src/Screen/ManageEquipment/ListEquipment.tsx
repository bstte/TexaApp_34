import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/Api';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EquipmentCard from '../../components/EquipmentCard';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import {
    responsiveHeight,
} from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from 'react-redux';
import { Image_Base_Url } from '../../api/Api';
import { RefreshControl } from 'react-native';
import CommonCard from '../../components/Common/CommonCard';
import { setEquipmentItems } from '../../Reducer/slices/EquipmentItemSlice';
import { SafeAreaView } from 'react-native';

interface equipmentprops {
    navigation: any
}
interface Equipment {
    id: number,
    // brand_name: string,
    shop_name: string,
    // model_name: string



}

const ListEquipment: React.FC<equipmentprops> = (props) => {

    const userData = useSelector((state: any) => state.user.userData)
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [checkEquipmentpData, setCheckEquipmentData] = React.useState<boolean>(false)
    const [equipmentData, setEquipment] = React.useState<Equipment[]>([])

    const dispatch=useDispatch()
    const route = useRoute();

    useEffect(() => {
        get_equipment()
        get_equipment_items()
    }, [checkEquipmentpData])

    useEffect(() => {
        if (route.params && route.params.updatedEquipmentData ===true) {
            get_equipment()
        }
      }, [route.params]);

 
    const get_equipment = async () => {
        const userId = await AsyncStorage.getItem('userId')
        const token = await AsyncStorage.getItem('token');

        if (userId && token) {
            try {
              
                const response = await api.get_equipment(userId, token)

                setEquipment(response.data)
                setIsLoading(false);
            } catch (error) {
                console.log("view equipment", error)
            }

        }
    }


    const get_equipment_items=async()=>{
        const token = await AsyncStorage.getItem('token');
        if(token){
            setIsLoading(true)
            try{
                const response=await api.equipment_items(token)
                if(response.data.success===true){
                    
                    dispatch(setEquipmentItems(response.data.data))
                    setIsLoading(false)

                }
                

            }catch(error){
                console.log("dosage items error",error)
            }
        }

    }


    const filteredEquipmentData = equipmentData.filter(item =>
        item.shop_name && item.shop_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEquipmentDeletion = (deleteEquipment: number) => {
        // Update shopData by removing the deleted shop
        setEquipment(prevEquipment => prevEquipment.filter(equipmetn => equipmetn.id !== deleteEquipment));
    };

    const renderItem = ({ item, index }: { item: Equipment, index: number }) => (
        <EquipmentCard props={item} index={index + 1} onDelete={handleEquipmentDeletion} navigation={props.navigation} />
    );


    const handleEquipmentAddition = () => {
        setCheckEquipmentData(!checkEquipmentpData)
        
    };

    const addequipment = () => {
        props.navigation.navigate("AddEquipment",{
            onEquipmentAdded:()=>handleEquipmentAddition()
        });
    }

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
                <Text style={styles.equipmenttitle}>Manage Equipment</Text>
                <View style={styles.imgcontainer}>
                    {userData.profile_photo_path ? (

                        <Image source={{ uri: `${Image_Base_Url}/${userData.profile_photo_path}` }} style={styles.profileimg} />

                    ) :
                        <Image source={require('../../assets/img/default_profile.jpg')} style={styles.profileimg} />}
                </View>
            </View>

           

            <View style={styles.searchcontainer}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={"#787a7c"}
                    placeholder="Search By shop Name"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* here shop view */}
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <TouchableOpacity style={styles.addcontainer} onPress={addequipment}>
                    <Text style={styles.addtext}>+ Add New Equipment</Text>
                </TouchableOpacity>
                {filteredEquipmentData.length === 0 && isLoading === false ? (
                    <CommonCard>
                        <Text style={{ justifyContent: "center", alignSelf: "center",color:"#000" }}>No Equipment Data</Text>
                    </CommonCard>
                ) : (

                    <FlatList
                    style={{flex:1,marginBottom:20}}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() =>get_equipment()} />}
                     data={filteredEquipmentData}
                     renderItem={renderItem}
                     keyExtractor={(item) => item.id.toString()} // Assuming each shop has an id
                 
                 />
                )}
              
                  

            </View>
        </SafeAreaView>
    )
}

export default ListEquipment