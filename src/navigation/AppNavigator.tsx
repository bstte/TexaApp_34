import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Screen/Login/Login';
import Signup from '../Screen/signup/Signup';
import Dashbord from '../Screen/dashbord/Dashboard';
import DrawerNavigator from '../Screen/DrawerNavigator/DrawerNavigator';
import BottomNavigator from '../Screen/BottomNavigator/BottomNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Authuser from '../Screen/Authuser/Authuser';
import AddShop from '../Screen/Manageshop/Addshop/AddShop';
import EditShop from '../Screen/Manageshop/EditShop/EditShop';
import ViewShop from '../Screen/Manageshop/ViewShop/ViewShop';
import AddDosage from '../Screen/ManageDosage/AddDosage/AddDosage';
import EditDosage from '../Screen/ManageDosage/EditDosage/EditDosage';
import ViewDosage from '../Screen/ManageDosage/ViewDosage/ViewDosage';
import AddEquipment from '../Screen/ManageEquipment/AddEquipment/AddEquipment';
import EditEquipment from '../Screen/ManageEquipment/EditEquipment/EditEquipment';
import ViewEquipment from '../Screen/ManageEquipment/ViewEquipment/ViewEquipment';
import AddSubUser from '../Screen/ManageOneTimeAccess/AddSubUser/AddSubUser';
import AddRaiseQuery from '../Screen/Raise_query/AddRaiseQuery/AddRaiseQuery';
import ViewQuery from '../Screen/Raise_query/VIewQuery/ViewQuery';
import ForgotPassword from '../Screen/Forgot/ForgotPassword';
import ChangePassword from '../Screen/Forgot/ChangePassword';
import Profile from '../Screen/Profile/Profile';
import AdminChatList from '../Screen/AdminChat/AdminChatList';
import AdminChat from '../Screen/AdminChat/AdminChat';
import AdminChatPage from '../components/AdminChat/AdminChatPage';
import VideoCall from '../Screen/VideoCall/VideoCall';
import ChatBotScreen from '../Screen/Chatbot/ChatBotScreen';
import NavigationService from './NavigationService';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {


    return (
      <NavigationContainer ref={(ref)=>NavigationService.setTopLevelNavigator(ref)}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Authuser" component={Authuser} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="Home" component={DrawerNavigator} />
            <Stack.Screen name='Profile' component={Profile}/>
            <Stack.Screen name='AddShop' component={AddShop}/>
            <Stack.Screen name='EditShop' component={EditShop}/>
            <Stack.Screen name='ViewShop' component={ViewShop}/>
            <Stack.Screen name='AddDosage' component={AddDosage}/>
            <Stack.Screen name='EditDosage' component={EditDosage}/>
            <Stack.Screen name='ViewDosage' component={ViewDosage}/>
            <Stack.Screen name='AddEquipment' component={AddEquipment}/>
            <Stack.Screen name='EditEquipment' component={EditEquipment}/>
            <Stack.Screen name='ViewEquipment' component={ViewEquipment}/>
            <Stack.Screen name='AddSubUser' component={AddSubUser}/>
            <Stack.Screen name='AddRaiseQuery' component={AddRaiseQuery}/>
            <Stack.Screen name='ViewQuery' component={ViewQuery}/>
            <Stack.Screen name='AdminChatList' component={AdminChatList}/>
            <Stack.Screen name='ChatBotScreen' component={ChatBotScreen}/>

            <Stack.Screen name='AdminChat' component={AdminChat}/>
            <Stack.Screen name='AdminChatPage' component={AdminChatPage}/>
            <Stack.Screen name='VideoCall' component={VideoCall}/>
      </Stack.Navigator>
    </NavigationContainer>
      );
};
export default AppNavigator;