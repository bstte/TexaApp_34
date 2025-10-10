import { Platform, StyleSheet } from "react-native"
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00aaf0",
 
  },
  maincontainer: {
    flex: 1,
    backgroundColor: "white",

  },
  drawerButton: {
    padding: 0,
  },
  profileimg: {
    width: responsiveHeight(15), height: responsiveHeight(15), borderRadius: responsiveWidth(15), resizeMode: 'cover',
  },
  shoptitle: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: "bold",
    padding: responsiveHeight(1.5),
    color: "white",
    marginLeft: responsiveHeight(1)
  },
  Textinput: {
    height: responsiveHeight(7.5),
    color: "#000",
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    backgroundColor: 'white',
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
  searchcontainer: {
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(1),
  },
  addcontainer: {
    backgroundColor: "#037fb2", paddingVertical: 14, marginVertical: 15, margin: 12, borderWidth: 1, borderColor: "gray", borderRadius: 14
  },
  addtext: {
    textAlign: "center", fontSize: responsiveFontSize(2.2), color: "white", fontWeight: "bold"
  },
  emptytext: {
    marginLeft: "40%"
  },
  loader: {
    justifyContent: "center", alignItems: "center", flex: 1
  },
  updatebutton: {
    paddingVertical: 15, marginHorizontal: 12,
    backgroundColor: '#00aaf0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  submitloader: {
    flex: 1, width: "100%", height: "100%", justifyContent: "center", position: "absolute", backgroundColor: "#89898frgba(0, 0, 0, 0.5)", zIndex: 999
  },
  updateprofileimg: {
    justifyContent: "center", alignItems: "center", marginBottom: responsiveHeight(1), marginTop: responsiveHeight(2.3)
  },
  successmsg: {
    fontSize: (responsiveFontSize(1.9)),
    color: "green",

  },
  country_calling_code: {
    height: responsiveHeight(7.5),
    position: "absolute",
    left: 10,
    fontWeight: "500",
    zIndex: 1,

    justifyContent: "center",
    alignItems: "center",

    marginVertical: responsiveHeight(1.5),

    backgroundColor: 'white',

    padding: responsiveHeight(1.5),
    borderRightWidth: 1,
    borderRightColor: "#ddd",

    // elevation: responsiveHeight(0.4),

  },
  country_calling_code_text: {
    color: "#202020",
    fontSize: 17,
  },
  country_calling_code_textinput: {
    height: responsiveHeight(7.5),
    width: responsiveWidth(95),
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    backgroundColor: 'white',
    borderRadius: responsiveHeight(1.5),
    paddingLeft: responsiveHeight(9.5),
    color:"#000",
    shadowColor: '#000',
    shadowOffset: {
      width: responsiveWidth(0),
      height: responsiveHeight(0.5),
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: responsiveHeight(0.4),
  },
  countryDropdownContainer: {
    width: responsiveWidth(95),
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    // backgroundColor: 'white',
    borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
        borderWidth: 1,
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(2.2),
    elevation: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  dropdownText: {
    flex: 1,
    fontSize: responsiveFontSize(2),
    marginLeft: 12,
    color:'#000000'
  },
  dropdownIcon: {
    marginLeft: responsiveWidth(2),
  },
  flagimg: {
    width: responsiveWidth(10), height: responsiveHeight(3), marginRight: responsiveHeight(1.5)
  },
})

export default styles;