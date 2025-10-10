import { StyleSheet } from "react-native"


import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
import { themeFamily } from "../../../theme";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#00aaf0",


    },
    maincontainer:{
        flex:1,
        backgroundColor:"white",
        
      },
      input: {
        // height: responsiveHeight(7.5),
    color:"#000",
        marginVertical: responsiveHeight(1),
        marginHorizontal: responsiveHeight(1),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        padding: responsiveHeight(1.7),
        shadowColor: '#000',
        shadowOffset: {
            width: responsiveWidth(0),
            height: responsiveHeight(0.5),
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    
        elevation: responsiveHeight(0.4),
    },
    dropdown: {
        height: responsiveHeight(7.5),
    
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        padding: responsiveHeight(1.5),
        shadowColor: '#000',
        elevation: responsiveHeight(0.4),
    },
    placeholderStyle: {
        fontSize:responsiveFontSize(2),
    },
    selectedTextStyle: {
        fontSize:responsiveFontSize(2),
    },
    iconStyle: {
        width:responsiveHeight(2) ,
        height: responsiveHeight(3),
    },
    inputSearchStyle: {
        height:responsiveHeight(5) ,
        fontSize:responsiveFontSize(2),
    },
    icon: {
        marginRight: responsiveHeight(1),
    },
    item: {
        padding: responsiveHeight(1.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:responsiveHeight(1.5) ,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginTop: responsiveHeight(1),
        marginBottom:responsiveHeight(1),
        marginRight:responsiveHeight(2),
        paddingHorizontal: responsiveHeight(1.8),
        marginLeft: responsiveHeight(2.5),
        paddingVertical: responsiveHeight(1),
        elevation: 2,
    },
    textSelectedStyle: {
        marginRight: responsiveHeight(0.5),
        fontSize:responsiveFontSize(2) ,
    },
    addtext: {
        paddingVertical: responsiveHeight(1.5), marginHorizontal: responsiveWidth(1.5),
        backgroundColor: '#00aaf0',
        borderRadius: responsiveHeight(0.5),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: responsiveHeight(2)
    },
    submitloader:{
        flex: 1, width: "100%", height: "100%", justifyContent: "center", position: "absolute", backgroundColor: "#89898frgba(0, 0, 0, 0.5)", zIndex: 999
    },
    imgcontainer:{
        fontSize: responsiveFontSize(2.5), marginVertical:responsiveHeight(1.3),
        marginHorizontal: responsiveHeight(1.2),color:"#202020",
    },
    selectedimgcontainer:{
        justifyContent: "center", alignItems: "center", marginBottom: responsiveHeight(1)
    },
    selectedimg:{
        width: responsiveWidth(22), height: responsiveHeight(10), marginLeft:responsiveHeight(1) 
    },
    adddequipmenttext:
        {
            color: 'white', fontSize: responsiveFontSize(2.5), fontFamily:themeFamily.fontFamily
        },
        deleteButton: {
            backgroundColor: '#000',
            paddingVertical: 2,
            paddingHorizontal: 5,
            borderRadius: 15,
            position:"absolute",
            top:-4,
            right:-6,
          },
          deleteButtonText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 12,
          },
          ImageContainer:{
            marginVertical: responsiveHeight(1.5),
            marginHorizontal: responsiveHeight(1.5),
            borderRadius: responsiveHeight(1.5),
            padding: responsiveHeight(1.3),
            paddingLeft:responsiveHeight(1.7),
            borderWidth: 1,
            borderColor: "#797979",
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          },
          textinputlabel:{
            marginLeft:responsiveHeight(2.2), fontSize: responsiveFontSize(1.9), color: "#1A1A18",fontFamily:themeFamily.fontFamily
        },
        modalOk:{
            fontSize:responsiveFontSize(2),color:"#00aaf0",paddingHorizontal:responsiveHeight(2.8),marginTop:responsiveHeight(1.2),paddingVertical:responsiveHeight(0.5),borderRadius:responsiveHeight(5)
        }
})

export default styles;