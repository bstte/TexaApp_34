import { View, Text, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/Api';
import styles from './styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SubUserCard from '../../components/SubUserCard';
import { useSelector } from 'react-redux';
import { Image_Base_Url } from '../../api/Api';
import {
    responsiveHeight,
} from "react-native-responsive-dimensions";
import { RefreshControl } from 'react-native';
import CommonCard from '../../components/Common/CommonCard';
import { SafeAreaView } from 'react-native-safe-area-context';
interface subprops {
    navigation: any
}
interface subuser {
    id: number;
    name: string;
    email: string;
    shop: string

}
const ViewOneTimeAccess: React.FC<subprops> = (props) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const userData = useSelector((state: any) => state.user.userData)
    const [subuserData, setsubuserData] = React.useState<subuser[]>([])
    const [checkoneTimeData, setCheckoneTimeData] = React.useState<boolean>(false)

    useEffect(() => {
        get_subUser();
    }, [checkoneTimeData])

    const filteredEquipmentData = subuserData.filter(item =>
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const get_subUser = async () => {
        const userId = await AsyncStorage.getItem('userId')
        const token = await AsyncStorage.getItem('token');

        if (userId && token) {
            try {
                const response = await api.get_subUser(userId, token)
                console.log("here subuser view", response.data)
                setsubuserData(response.data)
                setIsLoading(false);
            } catch (error) {
                console.log("view subuser error:", error)
            }

        }
    }


    const handledeletesubuserDeletion = (deletesubuser: number) => {
        // Update shopData by removing the deleted shop
        setsubuserData(prevsubuser => prevsubuser.filter(subuser => subuser.id !== deletesubuser));
    };

    const hanleoneTimeAdition=()=>{
        setCheckoneTimeData(!checkoneTimeData)
    }

    const renderItem = ({ item, index }: { item: subuser, index: number }) => (
        <SubUserCard props={item} index={index + 1} onDelete={handledeletesubuserDeletion} navigation={props.navigation} />
    );

    const AddSubUser = () => {
        props.navigation.navigate("AddSubUser",{
            onOneTimeAdd:()=>hanleoneTimeAdition()
        })
    }
    return (
        <SafeAreaView style={styles.viewcontainer}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.drawerButton}
                    onPress={() => props.navigation.openDrawer()}
                >
                    {/* You can use a drawer icon here */}
                    <Icon name="menu-open" size={responsiveHeight(4.5)} color="white" />
                </TouchableOpacity>
                <Text style={styles.subusertitle}>Sub User List</Text>
                <View style={styles.imgcontainer}>
                    {userData.profile_photo_path ? (

                        <Image source={{ uri: `${Image_Base_Url}/images/user/${userData.profile_photo_path}` }} style={styles.profileimg} />

                    ) :
                        <Image source={require('../../assets/img/default_profile.jpg')} style={{ width: 40, height: 40, borderRadius: 100, }} />}
                </View>
            </View>



            <View style={styles.searchcontainer}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={"#787a7c"}
                    placeholder="Search By Email"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* here shop view */}
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <TouchableOpacity style={styles.addcontainer} onPress={AddSubUser}>
                    <Text style={styles.addtext}>+ Add New Sub User </Text>
                </TouchableOpacity>
                {filteredEquipmentData.length === 0 && isLoading === false ? (
                    <CommonCard>
                        <Text style={{ justifyContent: "center", alignSelf: "center",color:"#000" }}>No Sub User Data</Text>
                    </CommonCard>
                ) : (

                    <FlatList
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => get_subUser()} />}
                    data={filteredEquipmentData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()} // Assuming each shop has an id
                 
                />
                )}
              

            </View>
        </SafeAreaView>
    )
}

export default ViewOneTimeAccess