import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { themeFamily } from '../../theme';


interface custompprops {
  title: string;
  imgSource: string
}
const CustomHeader: React.FC<custompprops> = ({ title, imgSource }) => {
  const navigation = useNavigation();

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: responsiveWidth(2) ,backgroundColor:"#00aaf0"}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* You can replace this with your back button icon */}
          <Icon name="arrow-back" size={responsiveHeight(3.5)} color="white" />
        </TouchableOpacity>
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' ,marginTop:10}}>
        <Image source={imgSource} style={{ width: 40, height: 40, marginRight: 10,borderRadius:100 }} />
      </View> */}
        <View>
          <Text style={{
            fontSize: responsiveFontSize(2.3),
            marginLeft: responsiveHeight(1.5),
            fontFamily: themeFamily.fontFamily,
            padding: responsiveHeight(1.8),
            color: "white",
          }}>{title}</Text>
        </View>
      </View>

    </>
  );
};

export default CustomHeader;
