import { View, Text, TouchableOpacity, Image, TextInput, FlatList, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShopCard from '../../components/ShopCard';
import { useRoute } from '@react-navigation/native';
import api, { Image_Base_Url } from '../../api/Api';
import {
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { useSelector } from 'react-redux';
import CommonCard from '../../components/Common/CommonCard';
import { SafeAreaView } from 'react-native-safe-area-context';

interface shopProps {
  navigation: any
}

interface shop {
  id: number;
  shop_name: string;
  shop_contact_person: string;
  email: string;
  phone: number
}
const ShopList: React.FC<shopProps> = (props) => {

  const [shopData, setShopData] = React.useState<shop[]>([])
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const userData = useSelector((state: any) => state.user.userData);
  const [checkShopData, setCheckShopData] = React.useState<boolean>(false)
  const route = useRoute();

  useEffect(() => {
    get_shop();
  }, [checkShopData])

  useEffect(() => {
    if (route.params && route.params.updatedShopData === true) {
      get_shop()
    }
  }, [route.params]);

  const get_shop = async () => {
    const userId = await AsyncStorage.getItem('userId')
    const token = await AsyncStorage.getItem('token');

    if (userId && token) {
      try {
        const response = await api.get_shop(userId, token)
        setShopData(response.data.user)
        setIsLoading(false);
      } catch (error) {
        console.log("view shop", error)
      }

    }


  }


  // here filter shop data
  const filteredShopData = shopData.filter(item =>
    item.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.shop_contact_person.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShopDeletion = (deletedShopId: number) => {
    // Update shopData by removing the deleted shop
    setShopData(prevShopData => prevShopData.filter(shop => shop.id !== deletedShopId));
  };

  const handleShopAddition = (newShop: any) => {
    setCheckShopData(!checkShopData)
  };


  const addshop = async () => {
    props.navigation.navigate("AddShop", {
      onShopAdded: (newShop) => handleShopAddition(newShop),
    });
  }
  const renderItem = ({ item, index }: { item: shop, index: number }) => (
    <ShopCard props={item} index={index + 1} onDelete={handleShopDeletion} navigation={props.navigation} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={{ backgroundColor:"#00aaf0",}}>  */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => props.navigation.openDrawer()}
        >
          {/* You can use a drawer icon here */}
          <Icon name="menu-open" size={responsiveHeight(4.5)} color="white" />
        </TouchableOpacity>
        <Text style={styles.shoptitle}>Manage Shops</Text>
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
          placeholder="Search By Shop Name or Contact Person"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* </View> */}
      


      {/* here shop view */}
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <TouchableOpacity style={styles.addcontainer} onPress={addshop}>
          <Text style={styles.addtext}>+ Add New Shop</Text>
        </TouchableOpacity>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >

          {filteredShopData.length === 0 && isLoading === false ? (
            <CommonCard>
              <Text style={{ justifyContent: "center", alignSelf: "center" ,color:"#000"}}>No Shop Data</Text>
            </CommonCard>
          ) : (
            <FlatList
            style={{flex:1,marginBottom:20}}
              refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => get_shop()} />}
              data={filteredShopData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()} // Assuming each shop has an id

            />
          )}

        </KeyboardAvoidingView>

      </View>

    </SafeAreaView>
  )
}

export default ShopList