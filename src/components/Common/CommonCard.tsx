import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
  import { CardBase } from '@rneui/base/dist/Card/Card'

const CommonCard = ({children}) => {
  return (
    <CardBase>
    {children}
    </CardBase>
  )
}

export default CommonCard

