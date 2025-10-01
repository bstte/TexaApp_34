import { View, Text, ScrollView, Button, TouchableOpacity, StyleSheet, Image ,FlatList, SafeAreaView} from 'react-native';
import React, { useEffect } from 'react';
import Card from '../../components/Card';
import Header from '../CustomHeader/CustomHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/Api';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import {
  responsiveHeight,
} from "react-native-responsive-dimensions";
import styles from './styles'

import { Image_Base_Url } from '../../api/Api';



interface dashbordprops {
  navigation: any
}

interface count {
  shop: '0',
  equipment: '0',
  dosage: '0',
  query: '0',
}

const Dashboard: React.FC<dashbordprops> = (props) => {

  const [TotalCount, setTotalCount] = React.useState<count>({
    shop: '0',
    equipment: '0',
    dosage: '0',
    query: '0',
  });

  const userData = useSelector((state: any) => state.user.userData)

  const profileimage = userData ? userData.profile_photo_path : '';


  const data = [
    { id: 1, title: 'Total Shops', total: TotalCount.shop, Iconname: "shopping", backgroundColor: "#d4664f",ScreenName:"Manage Shops" },
    { id: 2, title: 'Total Equipments', total: TotalCount.equipment, Iconname: "hammer-screwdriver", backgroundColor: "#752fff",ScreenName:"Manage Equipments"  },
    { id: 3, title: 'Total Dosages', total: TotalCount.dosage, Iconname: "eyedropper", backgroundColor: "#fdbe01",ScreenName:"Manage Dosages"  },
    { id: 4, title: 'Total Queries', total: TotalCount.query, Iconname: "progress-question", backgroundColor: "#379fff",ScreenName:"Raise A Query"  },
    // Add more data items as needed
  ];

  useEffect(() => {
   
    get_count();
  }, [])

  const refreshData = async () => {
    await get_count();

  };
  useFocusEffect(
    React.useCallback(() => {
      refreshData();

    }, []) // Empty dependency array to run the effect only on mount and unmount
  );

  const get_count = async () => {
    const userId_string = await AsyncStorage.getItem('userId');


    const token = await AsyncStorage.getItem('token');

    if (userId_string && token) {
      const userId = parseInt(userId_string);
      try {
        const response = await api.get_count(userId, token)
        if (response.data.success === true) {
          setTotalCount(response.data)
        }



      } catch (error) {
        console.log("view total count error:", error)
      }

    }
  }
  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.DrawerIcon}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => props.navigation.openDrawer()}
        // Use toggleDrawer instead of openDrawer
        >
          {/* You can use a drawer icon here */}
          <Icon name="menu-open" size={responsiveHeight(4.4)} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.imgcontainer}>

          {profileimage ? (

            <Image source={{ uri: `${Image_Base_Url}/${profileimage}` }} style={styles.profileimg} />

          ) :
            <Image source={require('../../assets/img/default_profile.jpg')} style={styles.profileimg} />}
        </View>

      </View>

      <View style={{ backgroundColor: "white", flex: 1 }}>
     
            <FlatList
              data={data}
              renderItem={({ item, index }) => (
                <Card key={item.id} props={item} navigation={props.navigation}/>
              )}
              keyExtractor={(item) => item.id.toString()}
            />

            <View style={{flex:1, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
              <Text style={{color:"#000"}}>Version 2.1</Text>
            </View>

      </View>

    </SafeAreaView>
  )
}

export default Dashboard
