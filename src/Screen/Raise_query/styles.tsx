import { Platform, StyleSheet } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { themeFamily } from "../../theme";


const styles = StyleSheet.create({
  loader: {
    justifyContent: "center", alignItems: "center", flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: "#00aaf0",
    width: responsiveWidth(100),
    height: responsiveHeight(100),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: responsiveHeight(1),
    marginRight: responsiveHeight(2)
  },
  drawerButton: {
    padding: 0,
    marginTop: responsiveHeight(1)
  },
  profileimg: {
    width: responsiveHeight(5), height: responsiveHeight(5), borderRadius: responsiveWidth(5),
  },
  querytitle: {
    fontSize:responsiveFontSize(2.3),
    padding:responsiveHeight(1.5),
    color:"white",
    marginLeft:responsiveHeight(1),
    fontFamily:themeFamily.fontFamily
  },
  input: {
    borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
        borderWidth: 1,
        color: "#000",
    borderRadius: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2.3),
    paddingVertical: responsiveHeight(1.1),
    backgroundColor: "white",

  },
  searchcontainer: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.2),
  },
  addcontainer: {
    backgroundColor:"#037fb2",paddingVertical:responsiveWidth(3.3) ,margin:responsiveHeight(1.7),borderRadius:10
  },
  addtext: {
    textAlign:"center",fontSize:responsiveFontSize(2.2),color:"white",fontFamily:themeFamily.fontFamily
  },
  usersubmit: {
    paddingVertical: responsiveHeight(1.5), marginHorizontal: responsiveWidth(1.5),
    backgroundColor: '#00aaf0',
    borderRadius: responsiveHeight(0.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(2)
  },
  emptytext: {
    marginLeft: "40%"
  },


  maincontainer: {
    flex: 1,
    backgroundColor: "white",

  },
  Textinput: {
    height: responsiveHeight(7.5),

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
  textarea: {
    height: responsiveHeight(20.5),
    color: "#000",
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    // backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : 'white',
    borderRadius: responsiveHeight(1.5),
    borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
        borderWidth: 1,
    padding: responsiveHeight(1.5),
    shadowColor: '#000',
    shadowOffset: {
      width: responsiveWidth(0),
      height: responsiveHeight(0.5),
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    // elevation: responsiveHeight(0.4),
  },
  dropdown: {
    height: responsiveHeight(7.5),

    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    // backgroundColor: 'white',
    borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
        borderWidth: 1,
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.5),
    shadowColor: '#000',
    // elevation: responsiveHeight(0.4),
    color:"#000"
  },
  placeholderStyle: {
    color:"#787a7c",
    fontSize: responsiveFontSize(2),
  },
  selectedTextStyle: {
    color:"#000",
    fontSize: responsiveFontSize(2),
  },
  iconStyle: {
    width: responsiveHeight(2),
    height: responsiveHeight(3),
  },
  inputSearchStyle: {
    height: responsiveHeight(5),
    fontSize: responsiveFontSize(2),
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
    borderRadius: responsiveHeight(1.5),
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
    marginRight: responsiveHeight(2),
    paddingHorizontal: responsiveHeight(1.8),
    marginLeft: responsiveHeight(2.5),
    paddingVertical: responsiveHeight(1),
    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: responsiveHeight(0.5),
    fontSize: responsiveFontSize(2), fontWeight: "500", color: "#202020"
  },
  submitloader: {
    flex: 1, width: "100%", height: "100%", justifyContent: "center", position: "absolute", backgroundColor: "#89898frgba(0, 0, 0, 0.5)", zIndex: 999
  },
  imgcontainer: {
    marginTop: responsiveHeight(0.5)
  },
  imgtitle: {
    fontSize: responsiveFontSize(2.5), marginVertical: responsiveHeight(1.3),
    marginHorizontal: responsiveHeight(1.2), color: "#202020"
  },
  selectedimgcontainer: {
    justifyContent: "center", alignItems: "center", marginBottom: responsiveHeight(1)
  },
  selectedimg: {
    width: responsiveWidth(25), height: responsiveHeight(11), marginLeft: responsiveHeight(1),
  },
  addquerytext:
  {
    color: 'white', fontSize: responsiveFontSize(2.5), fontFamily:themeFamily.fontFamily
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
  }
})

export default styles