import { StyleSheet } from "react-native";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
const styles = StyleSheet.create({
    loader: {
        justifyContent: "center", alignItems: "center", flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: "#00aaf0",
    },
    maincontainer: {
        flex: 1,
        backgroundColor: "white",
    },
    submitloader:{
        flex: 1, width: "100%", height: "100%", justifyContent: "center", position: "absolute", backgroundColor: "#89898frgba(0, 0, 0, 0.5)", zIndex: 999
    },
    card: {
        borderRadius:responsiveHeight(0.5),
        padding:responsiveHeight(3),
        margin: responsiveHeight(1.3),
        marginLeft:responsiveHeight(2),
        marginRight: responsiveHeight(2),
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width:responsiveWidth(0), height:responsiveHeight(0.5)},
        shadowOpacity:responsiveHeight(0.5),
        shadowRadius:responsiveHeight(0.6),
        elevation: responsiveHeight(0.4),
    },
    statusButton: {
        width:responsiveWidth(5),
        height: responsiveHeight(2.7),
        borderRadius: responsiveHeight(5),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: responsiveHeight(0.5),
    },
    statusText: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
    },
    equipmentttitle:{
        fontSize: responsiveFontSize(2.3), fontWeight: "600", marginBottom:responsiveHeight(0.7), color:"#333"
    },
    imges:{
        width:responsiveWidth(30), height:responsiveHeight(15)  ,resizeMode:"cover"
    },
    imageslabel:{
        fontSize: responsiveFontSize(2.5), fontWeight: "600", marginBottom: responsiveHeight(1.5),color:"#333"
    }
})

export default styles