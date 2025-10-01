import { Platform, StyleSheet } from "react-native";
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
        fontSize: responsiveFontSize(2.3), fontWeight: "bold", marginBottom:responsiveHeight(2), marginRight:responsiveHeight(11)
    },
    imges:{
        width:responsiveWidth(30), height:responsiveHeight(15)  
    },
    imageslabel:{
        fontSize: responsiveFontSize(2), fontWeight: "600", marginBottom: responsiveHeight(1.5),color:"#202020",
    },
    contacttitle:{
        fontSize: responsiveFontSize(2), fontWeight: "bold", marginRight:responsiveHeight(9), marginLeft: responsiveHeight(1.5)
    },
    viewlabel:{
        textAlign: "center", backgroundColor: "#00aaf0", paddingVertical:responsiveWidth(2), color: "white"
    },
    imgcontainer:{
        marginTop:responsiveHeight(1.7)
    },
    textarea: {
        height: responsiveHeight(20.5),
    color:"#000",
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : 'white',
        borderRadius: responsiveHeight(1.5),
        padding: responsiveHeight(1.5),
        shadowColor: '#000',
        shadowOffset: {
          width: responsiveWidth(0),
          height: responsiveHeight(0.5),
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    
        elevation: responsiveHeight(0.4),
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
      selectedimgcontainer: {
        justifyContent: "center", alignItems: "center", marginBottom: responsiveHeight(1)
      },
      selectedimg: {
        width: responsiveWidth(25), height: responsiveHeight(11), marginLeft: responsiveHeight(1),
      },
      deleteButton: {
        backgroundColor: '#000',
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 15,
        position: "absolute",
        top: -4,
        right: -6,
      },
      deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
      },
})

export default styles