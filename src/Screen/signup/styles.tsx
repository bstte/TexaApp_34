import { Platform, StyleSheet } from "react-native";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { themeFamily } from "../../theme";

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        width: responsiveWidth(100),
        height: responsiveHeight(100)
    },
    title: {
        fontSize: responsiveFontSize(6),
        marginTop: responsiveHeight(3.5),
        marginBottom: responsiveHeight(2.5),
        color: "#00aaf0",
        fontWeight: "bold",


    },
    title2: {
        fontSize:responsiveFontSize(2.5),
        color:"#000", 
        fontWeight:"500",
        marginBottom: responsiveHeight(2.2),
        fontFamily:themeFamily.fontFamily
    },
    input: {
        height: responsiveHeight(7.5),

        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        // backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : 'white',
        borderRadius: responsiveHeight(1.5),
        // borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : 'white',
        borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
       borderWidth: 1,
        padding: responsiveHeight(1.5),
        shadowColor: '#000',
        elevation: 0,
        color:"#000",

    },
    ortext: {
        marginTop: responsiveHeight(2.1),
        fontSize:responsiveFontSize(2.5) ,
        marginBottom: responsiveHeight(2.5),
        fontFamily:themeFamily.fontFamily,
        color:"#787a7c"
   
      },
    valid: {
        color: 'green',
    },
    invalid: {
        color: 'red',
    },
    registerbtn: {

    },
    submitloader: {
        flex: 1, width: "100%", height: "100%", justifyContent: "center", position: "absolute", backgroundColor: "#89898frgba(0, 0, 0, 0.5)", zIndex: 999
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
        fontSize: responsiveFontSize(2),
    },
    selectedTextStyle: {
        fontSize: responsiveFontSize(1.9),
    },
    iconStyle: {
        width: responsiveWidth(2),
        height: responsiveHeight(2),
    },
    inputSearchStyle: {
        height: responsiveHeight(3),
        fontSize: responsiveFontSize(2),
    },
    icon: {
        marginRight: responsiveHeight(2),
    },
    countrydropdown: {
        width: responsiveHeight(41)
    },
    flagimg: {
        width: responsiveWidth(10), height: responsiveHeight(3), marginRight: responsiveHeight(1.5)
      },
    registerbutton: {
        marginHorizontal: responsiveHeight(1.5), marginTop: responsiveHeight(1)
    },
    registertext: {
        color: 'white', fontSize: responsiveFontSize(2.3),fontFamily:themeFamily.fontFamily
    },
    ortextcontainer: {
        alignItems: "center", width: responsiveWidth(100)
    },
    sighnincontainer: {
        flexDirection: "row", marginTop: responsiveHeight(2.3), justifyContent: "center", width: responsiveWidth(100)
    },
    signintext: {
        color: "#00aaf0", fontSize: responsiveFontSize(2),fontFamily:themeFamily.fontFamily
    },
    inputView: {
        width: responsiveWidth(95),
        alignItems: "center",
        position:"relative",
        marginHorizontal:responsiveHeight(1.2)
    
      },
      psswordtextinput:{
        width:responsiveWidth(95),
        // height: responsiveHeight(8),
    
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        // backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : 'white',
        borderRadius:responsiveHeight(1.5),
        borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
        borderWidth: 1,
        padding: responsiveHeight(2),

        color:"#000",

        elevation: 0,

      },
      viewicon: {
        // marginLeft: 10,
        position:"absolute",
        right:responsiveHeight(2),
        top:responsiveHeight(3.7)
    },

    countryDropdownContainer: {
        width: responsiveWidth(95),
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        // backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : 'white',
        borderRadius: responsiveHeight(1.5),
        borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
        borderWidth: 1,
        padding: responsiveHeight(2.2),
        elevation: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },

      dropdownText: {
        flex: 1,
        fontSize: responsiveFontSize(2),
        fontFamily:themeFamily.fontFamily,
        color:"#000", 
        marginLeft: 12
      },
      dropdownIcon: {
        marginLeft: responsiveWidth(2),
      },
      notamember:{
        fontSize:responsiveFontSize(2),
        color:"#000",
      fontFamily:themeFamily.fontFamily
      }
})

export default style