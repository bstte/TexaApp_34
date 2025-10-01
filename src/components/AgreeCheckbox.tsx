import React, { useState } from 'react';
import { View, Text, TouchableOpacity ,Button} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { themeFamily } from '../theme';


interface AgreeCheckbox {
    label:string;
    onChange:(value:boolean)=>void;
}
const AgreeCheckbox :React.FC<AgreeCheckbox>= ({ label, onChange }) => {
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <TouchableOpacity onPress={handleCheckboxChange} style={{ flexDirection: 'row', alignItems: 'center',marginBottom:20 }}>
      <View
        style={{
          width: responsiveHeight(2.4),
          height: responsiveHeight(2.7),
          borderRadius: responsiveHeight(0.6),
          borderWidth: 1,
          borderColor: isChecked ? 'black' : 'gray',
          marginRight: responsiveHeight(1.3),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isChecked && <Text style={{color:"green",fontFamily:themeFamily.fontFamily}}>✓</Text>}
      </View>
      <Text style={{color:"#000",fontFamily:themeFamily.fontFamily}}>{label}</Text>
    </TouchableOpacity>
  );
};

export default AgreeCheckbox;
