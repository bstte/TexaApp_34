import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
// import BottomNavigator from '../BottomNavigator/BottomNavigator';
import styles from './styles';
import CustomDrawNavigator from './CustomDrawNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewShop from '../Manageshop/ShopList';
import ListDosage from '../ManageDosage/ListDosage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ListEquipment from '../ManageEquipment/ListEquipment';
import ViewOneTimeAccess from '../ManageOneTimeAccess/ViewOneTimeAccess';
import Raise_query_list from '../Raise_query/Raise_query_list';
import { useSelector } from 'react-redux';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { themeFamily } from '../../theme';
import Dashboard from '../dashbord/Dashboard';
import QueryListing from '../AdminQuery/AdminRaiseQuery/QueryListing';
import DeleteAccountScreen from '../DeleteAccount/DeleteAccount';


const Drawer = createDrawerNavigator();


const DrawerNavigator = () => {

  const userData = useSelector((state: any) => state.user.userData)

  // Check if user_type is 1 to determine whether to show the drawer navigation

  // notes:role 1 means admin and role 2 means user 
  const user_type = userData && userData.user_type;
  const role = userData && userData.role;



  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerLabelStyle: {
          fontSize: 14,
          fontFamily: themeFamily.fontFamily,
          color: "#000"
          // fontWeight:"500"
        },
        drawerActiveTintColor: '#00aaf0', // Set the selected (active) text color
      }}
      drawerContent={(props) => <CustomDrawNavigator {...props} />} >

      {(user_type === 0 && role === 2) && (

        <React.Fragment>

          <Drawer.Screen name="Dashboard" component={Dashboard}
            options={{
              drawerIcon: ({ focused, color, size }) => (
                <Icon name="view-dashboard" size={responsiveHeight(3.3)} color={focused ? '#00aaf0' : 'black'} />
              )
            }}
          />

          <Drawer.Screen name="Manage Shops" component={ViewShop}
            options={{
              drawerIcon: ({ focused, color, size }) => (
                <Icon name="shopping" size={responsiveHeight(3.3)} color={focused ? '#00aaf0' : 'black'} />
              )
            }}
          />

          <Drawer.Screen name="Manage Dosages" component={ListDosage}
            options={{
              drawerIcon: ({ focused, color, size }) => (
                <Icon name="eyedropper" size={responsiveHeight(3.3)} color={focused ? '#00aaf0' : 'black'} />
              )
            }}
          />

          <Drawer.Screen name="Manage Equipments" component={ListEquipment}
            options={{
              drawerIcon: ({ focused, color, size }) => (
                <Icon name="hammer-screwdriver" size={responsiveHeight(3.3)} color={focused ? '#00aaf0' : 'black'} />
              )
            }}
          />

          <Drawer.Screen name="Raise A Query" component={Raise_query_list}
            options={{
              drawerIcon: ({ focused, color, size }) => (
                <Icon name="progress-question" size={responsiveHeight(3.3)} color={focused ? '#00aaf0' : 'black'} />
              )
            }}
          />

          <Drawer.Screen name="Create One Time Access" component={ViewOneTimeAccess}
            options={{
              drawerIcon: ({ focused, color, size }) => (
                <Icon name="progress-question" size={responsiveHeight(3.3)} color={focused ? '#00aaf0' : 'black'} />
              )
            }}
          />



        </React.Fragment>
      )}



      {(user_type === 1 && role === 2) && (
        <React.Fragment>
          <Drawer.Screen name="Raise A Query" component={Raise_query_list}
            options={{
              drawerIcon: ({ focused, color, size }) => (
                <FontAwesome5 name="question" size={responsiveHeight(3.3)} color={focused ? '#00aaf0' : '#202020'} />
              ),

            }}
          />
        </React.Fragment>
      )}

    {(role === 1) && (
        <React.Fragment>
          <Drawer.Screen name="Raise A Query" component={QueryListing}
            options={{
              drawerIcon: ({ focused, color, size }) => (
                <FontAwesome5 name="question" size={responsiveHeight(3.3)} color={focused ? '#00aaf0' : '#202020'} />
              ),

            }}
          />
        </React.Fragment>
      )} 
<Drawer.Screen name="Delete Account" component={DeleteAccountScreen}
            options={{
              drawerIcon: ({ focused, color, size }) => (
                <AntDesign name="deleteuser" size={responsiveHeight(3.3)} color={focused ? '#00aaf0' : '#202020'} />
              ),

            }}
          />

    </Drawer.Navigator>
  );
}

export default DrawerNavigator