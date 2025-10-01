import { Platform, StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { themeFamily } from '../../theme';



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: responsiveWidth(100),
    height: responsiveHeight(100)


  },

  title: {
    fontWeight: "bold",
    fontSize: responsiveFontSize(6),
    color: "#00aaf0",
    marginBottom: responsiveHeight(2.5),
    marginTop: responsiveHeight(10.2),

  },
  inputView: {
    width: responsiveWidth(95),

    position: "relative",

  },
  inputText: {
    width: responsiveWidth(95),
    height: responsiveHeight(7),
    color: '#000',
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
    borderWidth: 1,
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.5),

    elevation: 0,

  },
  psswordtextinput: {
    width: responsiveWidth(95),
    height: responsiveHeight(7),
    color: "#000",
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    // backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : 'white',
    borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
        borderWidth: 1,
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.5),

    // elevation: 2,

  },
  forgotAndSignUpText: {
    color: "#00aaf0",
    fontFamily: themeFamily.fontFamily,
    fontSize: responsiveFontSize(2)
  },
  loginBtn: {

    backgroundColor: "#00aaf0",
    borderRadius: responsiveHeight(1),
    paddingVertical: 13,
    paddingHorizontal: 27,
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(1.4),
    marginHorizontal: responsiveHeight(1.5)
  },
  loginText: {
    color: "#FFF",
    fontSize: responsiveFontSize(2.3),
    fontFamily: themeFamily.fontFamily,
  },
  ortext: {
    marginTop: responsiveHeight(2.1),
    fontSize: responsiveFontSize(2.5),
    marginBottom: responsiveHeight(2.5),
    fontFamily: themeFamily.fontFamily,
    color: '#787a7c',


  },
  title2: {
    fontSize: responsiveFontSize(2.5),
    color: "#000",
    fontWeight: "500",
    marginBottom: responsiveHeight(2.2),
    fontFamily: themeFamily.fontFamily

  },
  resettext: {
    fontSize: (responsiveFontSize(1.5))
  },
  successmsg: {
    fontSize: (responsiveFontSize(1.5)),
    color: "green",
  },
  icon: {
    // marginLeft: 10,
    position: "absolute",
    right: responsiveHeight(2),
    top: responsiveHeight(4.2)
  },
  textinputlabel: {
    marginLeft: responsiveHeight(1.5), fontSize: responsiveFontSize(2), color: "#000", fontFamily: themeFamily.fontFamily,
  },
  notamember: {
    fontSize: responsiveFontSize(2),
    color: "#000",
    fontFamily: themeFamily.fontFamily
  },
  forgotmainContainer: {
    flexDirection: "row", width: "100%", justifyContent: "space-between", marginTop: responsiveHeight(2), flex: 1, marginHorizontal: responsiveHeight(1.9)
  },
  forgotContainer: {
    marginHorizontal: responsiveHeight(3.6)
  }
})
export default styles;