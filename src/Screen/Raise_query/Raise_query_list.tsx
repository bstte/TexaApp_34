import { View, Text, TouchableOpacity, Image, TextInput, FlatList, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/Api';
import styles from './styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveHeight,
} from "react-native-responsive-dimensions";
import RaiseQueryCard from '../../components/RaiseQueryCard';
import { useSelector } from 'react-redux';
import { Image_Base_Url } from '../../api/Api';
import CommonCard from '../../components/Common/CommonCard';
import { SafeAreaView } from 'react-native-safe-area-context';

interface props {
  navigation: any
}
interface raisequery {
  id: number;
  query_title: string;
  product_name: string;

}

const Raise_query_list: React.FC<props> = (props) => {
  const userData = useSelector((state: any) => state.user.userData)
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [checkqueryData, setCheckqueryData] = React.useState<boolean>(false)
  const [raisequeryData, setraisequeryData] = React.useState<raisequery[]>([])

  useEffect(() => {
    get_raise_query();
  }, [checkqueryData])

  const filteredraisequeryData = raisequeryData.filter(item =>
    item.query_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const get_raise_query = async () => {
    const userId = await AsyncStorage.getItem('userId')
    const token = await AsyncStorage.getItem('token');

    if (userId && token) {
      try {
        const response = await api.get_query_list(userId, token)

        const dataArray = Object.values(response.data.data);
        // console.log("listing data", dataArray)
        if (Array.isArray(dataArray)) {
          setraisequeryData(dataArray);

        } else {
          console.error("Response data is not an array:", dataArray);
        }
        setIsLoading(false);
      } catch (error: any) {
        if (error.response) {
          console.error("🔴 Backend Response Error:", error.response.data);
          console.error("🔴 Status Code:", error.response.status);
          console.error("🔴 Headers:", error.response.headers);
        } else if (error.request) {
          console.error("🟠 No Response Received:", error.request);
        } else {
          console.error("⚠️ Error Setting up Request:", error.message);
        }
      }
    }
  }

  // const getadminlist = async (case_id) => {


  // }
  const handledeleteraisequeryDeletion = (deletdraisequery: number) => {

    setraisequeryData(prevraisequery => prevraisequery.filter(raisequery => raisequery.case_id !== deletdraisequery));
  };

  const NavigateOnViewQuery = (user_id: number, case_id: number, shop_id: number) => {
    props.navigation.navigate('ViewQuery', { user_id, case_id, shop_id });
  };

  const NavigateOnAdminChatList = async (user_id, case_id, shop_id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      if (token) {
        const response = await api.Getadminlist(case_id, token);
        if (response.data.success === true && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const firstAdmin = response.data.data[0];
          // console.log("chat response", firstAdmin);

          props.navigation.navigate("AdminChat", {
            user_id,
            case_id,
            shop_id,
            adminId: `admin_${firstAdmin.id}`,
            item: firstAdmin
          });
        } else {
          console.log("No admin data found");
        }
      }
    } catch (error) {
      console.log("getadminlist", error);
    }
  };




  const renderItem = ({ item, index }: { item: raisequery, index: number }) => (
    <RaiseQueryCard
      props={item}
      index={index + 1}
      onDelete={handledeleteraisequeryDeletion}
      onViewQuery={NavigateOnViewQuery}
      onOpenChatBot={NavigateOnAdminChatList}
    />
  );


  const handlequeryadition = () => {
    setCheckqueryData(!checkqueryData)
  }
  // const Addquery = () => {
  //   props.navigation.navigate("AddRaiseQuery", {
  //     onQueryAdd: () => handlequeryadition()
  //   })
  // }

  const onOpenChatBot = () => {
    props.navigation.navigate('ChatBotScreen', {
      onFinish: () => {
        props.navigation.replace('Home', {
          screen: 'Raise A Query'
        });

        handlequeryadition();
      }
    });
  };


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

            <Image source={{ uri: `${Image_Base_Url}/images/user/${userData.profile_photo_path}` }} style={styles.profileimg} />

          ) :
            <Image source={require('../../assets/img/default_profile.jpg')} style={styles.profileimg} />}
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
        <TouchableOpacity style={styles.addcontainer} onPress={onOpenChatBot}>
          <Text style={styles.addtext}>+ Raise a Query </Text>
        </TouchableOpacity>
        {filteredraisequeryData.length === 0 && isLoading === false ? (
          <CommonCard>
            <Text style={{ justifyContent: "center", alignSelf: "center", color: "#000" }}>No Query Data</Text>
          </CommonCard>
        ) : (

          <FlatList
            style={{ flex: 1, marginBottom: 20 }}
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

export default Raise_query_list