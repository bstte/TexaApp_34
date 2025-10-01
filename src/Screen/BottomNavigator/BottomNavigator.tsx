import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  responsiveHeight,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import Dashboard from '../dashbord/Dashboard';
import ViewShop from '../Manageshop/ShopList';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Profile from '../Profile/Profile';
import { themeFamily } from '../../theme';

const Bottom = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Bottom.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { height: 60, backgroundColor: '#ffffff' }, // Adjust background color as needed
      tabBarLabelStyle: {
        fontSize: responsiveFontSize(1.9),
      },
      tabBarActiveTintColor: '#00aaf0', // Color for the selected tab
      tabBarInactiveTintColor: 'black', // Color for the unselected tabs
    }}>
      <Bottom.Screen name="Home" component={Dashboard} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <Icon name="view-dashboard" size={responsiveHeight(3.3)} color={focused ? '#00aaf0' : 'black'} />
        ),
      }}
      />
      <Bottom.Screen name="Shops" component={ViewShop} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <Icon name="shopping" size={responsiveHeight(3.3)} color={focused ? '#00aaf0' : 'black'} />
        ),
      }}
      />
      <Bottom.Screen name="Profile" component={Profile} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <AntDesign name="user" size={responsiveHeight(3.3)} color={focused ? '#00aaf0' : 'black'} />
        ),
      }}
      />
    </Bottom.Navigator>
  )
}

export default BottomNavigator;
