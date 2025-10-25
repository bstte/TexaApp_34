import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { Image_Base_Url } from '../../api/Api';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { useSelector } from 'react-redux';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

interface dashboardProps {
  navigation: any;
}

const AdminDashboard: React.FC<dashboardProps> = (props) => {
  const userData = useSelector((state: any) => state.user.userData);
  const profileimage = userData ? userData.profile_photo_path : '';

  const [dashboardCount, setDashboardCount] = useState<any>({
    close_query: 0,
    open_query: 0,
    process_query: 0,
    hold_query: 0,
    total: 0
  });

  const data = [
    { id: 1, title: 'Total Queries', total: dashboardCount.total, iconName: "file-document-outline", backgroundColor: "#1e88e5", ScreenName:"Manage Query"},
    { id: 2, title: 'Open Queries', total: dashboardCount.open_query, iconName: "folder-open", backgroundColor: "#43a047",ScreenName:"Manage Query" },
    { id: 3, title: 'Close Queries', total: dashboardCount.close_query, iconName: "check-circle", backgroundColor: "#e53935",ScreenName:"Manage Query" },
    { id: 4, title: 'Hold Queries', total: dashboardCount.hold_query, iconName: "pause-circle", backgroundColor: "#fb8c00",ScreenName:"Manage Query" },
    { id: 5, title: 'Processing Queries', total: dashboardCount.process_query, iconName: "progress-clock", backgroundColor: "#6a1b9a",ScreenName:"Manage Query" },
  ];

  useEffect(() => {
    getCount();
  }, []);

  const refreshData = async () => {
    await getCount();

  };

  useFocusEffect(
    React.useCallback(() => {
      refreshData();

    }, []) // Empty dependency array to run the effect only on mount and unmount
  );
  const getCount = async () => {
    const userId_string = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');
    if (userId_string && token) {
      const userId = parseInt(userId_string);
      try {
        const response = await api.reparsantative_dashboard_count(userId, token);
        console.log("respo",response.data)
        if (response.data.status) {
          setDashboardCount(response.data.data);
        }
      } catch (error) {
        console.log("Dashboard count error:", error);
      }
    }
  };

  const renderCard = ({ item }: any) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: item.backgroundColor }]} onPress={()=>props.navigation.navigate(item.ScreenName)}>
      <Icon name={item.iconName} size={responsiveHeight(5)} color="#fff" />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardValue}>{item.total}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.headerContainer}>
      {/* Header */}
      <View style={styles.DrawerIcon}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => props.navigation.openDrawer()}>
          <Icon name="menu-open" size={responsiveHeight(4.4)} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.imgcontainer}>
          {profileimage ? (
            <Image source={{ uri: `${Image_Base_Url}/images/user/${profileimage}` }} style={styles.profileimg} />
          ) : (
            <Image source={require('../../assets/img/default_profile.jpg')} style={styles.profileimg} />
          )}
        </View>
      </View>

      {/* Cards */}
      <View style={styles.cardContainer}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={renderCard}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default AdminDashboard;
