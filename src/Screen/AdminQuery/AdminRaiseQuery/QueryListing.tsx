

import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, FlatList, Alert, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    responsiveFontSize,
  responsiveHeight, responsiveWidth,
} from "react-native-responsive-dimensions";

import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { SafeAreaView } from 'react-native';
import api, { Image_Base_Url } from '../../../api/Api';

import CommonCard from '../../../components/Common/CommonCard';
import { themeFamily } from '../../../theme';
import AdminRaiseQueryCard from '../../../components/AdminRaiseQueryCard';

interface props {
  navigation: any
}
interface raisequery {
  id: number;
  query_title: string;
  product_name: string;

}

const QueryListing: React.FC<props> = (props) => {
  const userData = useSelector((state: any) => state.user.userData)
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [checkqueryData, setCheckqueryData] = React.useState<boolean>(false)
  const [raisequeryData, setraisequeryData] = React.useState<raisequery[]>([])
  const [represantative,setrepresantative]=React.useState([])

  useEffect(() => {
    get_raise_query();
  }, [checkqueryData])

  const filteredraisequeryData = raisequeryData.filter(item =>
    item.query_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const get_raise_query = async () => {
    const userId = await AsyncStorage.getItem('userId')
    const token = await AsyncStorage.getItem('token');
console.log(token)
    if (userId && token) {
      try {
        const response = await api.admin_query(userId, token)
        console.log("lis quer",response.data)
        setrepresantative(response.data.reprsentetive)

        const dataArray = Object.values(response.data.data);
        if (Array.isArray(dataArray)) {
          setraisequeryData(dataArray);

        } else {
          console.error("Response data is not an array:", dataArray);
        }
        setIsLoading(false);
      } catch (error) {
        console.log("view raise query error:", error)
      }

    }
  }


  const handledeleteraisequeryDeletion = (deletdraisequery: number) => {
    // console.log("here rais a query delete id", deletdraisequery)
    // console.log("here raise a query data", raisequeryData)
    // Update shopData by removing the deleted shop
    setraisequeryData(prevraisequery => prevraisequery.filter(raisequery => raisequery.case_id !== deletdraisequery));
  };

  const renderItem = ({ item, index }: { item: subuser, index: number }) => (
    <AdminRaiseQueryCard props={item} index={index + 1} onDelete={handledeleteraisequeryDeletion} navigation={props.navigation} represantative={represantative}/>
  );

  const handlequeryadition = () => {
    setCheckqueryData(!checkqueryData)
  }
  const Addquery = () => {
    props.navigation.navigate("AddRaiseQuery", {
      onQueryAdd: () => handlequeryadition()
    })
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
        <Text style={styles.querytitle}>Manage Queries</Text>
        <View style={styles.imgcontainer}>
          {userData.profile_photo_path ? (

            <Image source={{ uri: `${Image_Base_Url}/${userData.profile_photo_path}` }} style={styles.profileimg} />

          ) :
            <Image source={require('../../../assets/img/default_profile.jpg')} style={styles.profileimg} />}
        </View>
      </View>



      <View style={styles.searchcontainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor={"#787a7c"}
          placeholder="Search By Subject"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* here shop view */}
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {filteredraisequeryData.length === 0 && isLoading === false ? (
          <CommonCard>
            <Text style={{ justifyContent: "center", alignSelf: "center" ,color:"#000"}}>No Query Data</Text>
          </CommonCard>
        ) : (

          <FlatList
          style={{flex:1,marginBottom:20}}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => get_raise_query()} />}
            data={filteredraisequeryData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()} // Assuming each shop has an id

          />
        )}


      </View>
    </SafeAreaView>
  )
}

export default QueryListing

const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#00aaf0",
        width: responsiveWidth(100),
        height: responsiveHeight(100),
      },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: responsiveHeight(1),
        marginRight: responsiveHeight(2)
      },
      drawerButton: {
        padding: 0,
        marginTop: responsiveHeight(1)
      },
      profileimg: {
        width: responsiveHeight(5), height: responsiveHeight(5), borderRadius: responsiveWidth(5),
      },
      querytitle: {
        fontSize:responsiveFontSize(2.3),
        padding:responsiveHeight(1.5),
        color:"white",
        marginLeft:responsiveHeight(1),
        fontFamily:themeFamily.fontFamily
      },
      imgcontainer: {
        marginTop: responsiveHeight(0.5)
      },
      searchcontainer: {
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveHeight(1.2),
      },

      input: {
        borderWidth: responsiveWidth(0.1),
        borderColor: '#ccc',
        borderRadius: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(2.3),
        paddingVertical: responsiveHeight(1.1),
        backgroundColor: "white",
    
      },
})