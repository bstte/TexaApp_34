import { StyleSheet } from "react-native";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { themeFamily } from "../../theme";

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        backgroundColor: "#00aaf0",
        width: responsiveWidth(100),
        height: responsiveHeight(100)
    },
    drawerButton: {
        padding: 0,
        marginTop:responsiveHeight(1)
    },
    // profileImage: {
    //     width: responsiveWidth(4),
    //     height: 40,
    //     borderRadius: 20,
    //     alignItems: "center", justifyContent: "center"

    // },
    DrawerIcon: {
        flexDirection: "row", justifyContent: "space-between", marginLeft: responsiveHeight(1), marginRight: responsiveHeight(2)
    },
    title:{
        fontSize: responsiveFontSize(2.5), marginHorizontal:responsiveHeight(3) , marginVertical: responsiveHeight(1.5), color: "white",fontFamily:themeFamily.fontFamily
    },
    imgcontainer:{
        marginTop:responsiveHeight(0.5)  
      },
      profileimg:{
        width:responsiveHeight(5) , height:responsiveHeight(5), borderRadius: responsiveWidth(5), 
      }
})

export default styles