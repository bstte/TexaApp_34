import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CustomCheckbox{
    label:string;
    checked:boolean;
    onChange:(value:boolean)=>void;
}

const CustomCheckbox :React.FC<CustomCheckbox> =({ label, checked, onChange }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row',marginTop:12 }}
      onPress={() => onChange(!checked)}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          borderWidth: 2,
          borderColor: checked ? 'green' : 'gray',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10,
        }}
      >
        {checked && (
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              backgroundColor: 'green',
            }}
          />
        )}
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomCheckbox;
