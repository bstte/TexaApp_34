// CustomCard.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import CommonCard from './Common/CommonCard';


interface customCard{
  props:any;
  navigation:any
}

const Card: React.FC<customCard> = ({ props,navigation }) => {
  return (
    <CommonCard>
    <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate(props.ScreenName)}>
      <View
        style={{
          backgroundColor: props.backgroundColor,
          marginRight: responsiveHeight(2),
          width: responsiveWidth(16),
          height: responsiveWidth(16),
          borderWidth: 0,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 100,
        }}
      >
        <Icon name={props.Iconname} size={responsiveHeight(5)} color="white" />
      </View>
      <View style={{ width:responsiveWidth(0.5),height:responsiveHeight(8), backgroundColor:"#e2e5eb", marginRight:responsiveHeight(3) }}></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.total}>{props.total}</Text>
      </View>
    </TouchableOpacity>
    </CommonCard>
  );
};

const styles = StyleSheet.create({

  title: {
    fontSize: responsiveFontSize(2.2),
    color:"#000",
    marginBottom: responsiveHeight(1),
    maxWidth: responsiveWidth(50), 
    fontFamily:'Poppins-Regular',
    overflow: 'hidden'
  },
  total: {
    fontSize: responsiveFontSize(2.2),
    color:"#000",
    fontFamily:'Poppins-Regular',
    
  },
});

export default Card;