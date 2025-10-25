

import { View, Text, TouchableOpacity, Image, TextInput, FlatList, RefreshControl, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight, responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import api, { Image_Base_Url } from '../../../api/Api';

import CommonCard from '../../../components/Common/CommonCard';
import { themeFamily } from '../../../theme';
import AdminRaiseQueryCard from '../../../components/AdminRaiseQueryCard';
import { handleApiError } from '../../utils/handleApiError';


interface props {
  navigation: any
}
interface raisequery {
  id: number;
  query_title: string;
  product_name: string;

}
interface AllCountries {
  id: string;
  name: string;
  flag: string;
  calling_code: string;
}

const QueryListing: React.FC<props> = (props) => {
  const userData = useSelector((state: any) => state.user.userData)
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [checkqueryData, setCheckqueryData] = React.useState<boolean>(false)
  const [raisequeryData, setraisequeryData] = React.useState<raisequery[]>([])
  const [represantative, setrepresantative] = React.useState([])
  const [AllCountries, setAllCountries] = React.useState<AllCountries[]>([]);
  const [selectedCountry, setSelectedCountry] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  useEffect(() => {
    get_raise_query();
  }, [checkqueryData])

  const filteredraisequeryData = raisequeryData.filter(item =>
    item.query_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    get_countries();
  }, []);

  const get_countries = async () => {
    try {
      const response = await api.get_contries();
      setAllCountries(response.data.data);
    } catch (error) {
      console.log("Countries error:", error);
    } finally {

    }
  };
  const get_raise_query = async (selectedCountry = '', selectedStatus = '') => {
    const userId = await AsyncStorage.getItem('userId')
    const token = await AsyncStorage.getItem('token');
    const country = selectedCountry || '';
    const status = selectedStatus || '';
    // console.log(userId, selectedCountry, selectedStatus, token)
    if (userId && token) {
      try {
        const response = await api.admin_query(userId, country, status, token)
        setrepresantative(response.data.reprsentetive)
        // console.log("user", response.data)
        const dataArray = Object.values(response.data.data);
        if (Array.isArray(dataArray)) {
          setraisequeryData(dataArray);

        } else {
          console.error("Response data is not an array:", dataArray);
        }
        setIsLoading(false);
      } catch (error) {
        handleApiError(error, "view raise query error")
        // console.log("view raise query error:", error)
      }

    }
  }


  const CountriesOption = AllCountries.map((country) => ({
    label: country.name,
    value: country.id,
    flag: country.flag,
    calling_code: country.calling_code,
  }));

  const statusOptions = [
    { label: 'Open', value: 'Open' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Hold', value: 'Hold' },
    { label: 'Close', value: 'Close' },
  ];

  const handleRefresh = () => {
    setSelectedCountry('');
    setSelectedStatus('');
    get_raise_query();
  };

  const handledeleteraisequeryDeletion = (deletdraisequery: number) => {

    setraisequeryData(prevraisequery => prevraisequery.filter(raisequery => raisequery.case_id !== deletdraisequery));
  };

  const renderItem = ({ item, index }: { item: subuser, index: number }) => (
    <AdminRaiseQueryCard props={item} index={index + 1} onDelete={handledeleteraisequeryDeletion} navigation={props.navigation} represantative={represantative} />
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
        <Text style={styles.querytitle}>Manage Queries</Text>
        <View style={styles.imgcontainer}>
          {userData.profile_photo_path ? (

            <Image source={{ uri: `${Image_Base_Url}/images/user/${userData.profile_photo_path}` }} style={styles.profileimg} />

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

      <View style={styles.filterRow}>
        {/* Country Dropdown */}
        <Dropdown
          style={styles.dropdown}
          data={CountriesOption}
          labelField="label"
          valueField="value"
          placeholder="Select Country"
          value={selectedCountry}
          onChange={(item) => setSelectedCountry(item.value)}
          maxHeight={300}
          placeholderStyle={{ color: '#787a7c' }}
          selectedTextStyle={{ color: '#000' }}
        />

        {/* Status Dropdown */}
        <Dropdown
          style={styles.dropdown}
          data={statusOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Status"
          value={selectedStatus}
          onChange={(item) => setSelectedStatus(item.value)}
          maxHeight={200}
          placeholderStyle={{ color: '#787a7c' }}
          selectedTextStyle={{ color: '#000' }}
        />

        {/* Filter Button */}
        <TouchableOpacity style={styles.filterBtn} onPress={() => get_raise_query(selectedCountry, selectedStatus)}>
          <Text>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={handleRefresh}>
          <Icon name="refresh" size={responsiveHeight(3)} color="#000000" />
        </TouchableOpacity>
      </View>


      {/* here shop view */}
      <View style={{ flex: 1, backgroundColor: "white" }}>
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

export default QueryListing

const styles = StyleSheet.create({
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
    fontSize: responsiveFontSize(2.3),
    padding: responsiveHeight(1.5),
    color: "white",
    marginLeft: responsiveHeight(1),
    fontFamily: themeFamily.fontFamily
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(1),
    gap: responsiveWidth(2),
  },

  dropdown: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#fff',
    height: responsiveHeight(5.5),
  },

  filterBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: responsiveWidth(3),
    height: responsiveHeight(5.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

})