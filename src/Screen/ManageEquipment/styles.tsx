import { Platform, StyleSheet } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { themeFamily } from "../../theme";

const styles=StyleSheet.create({
    loader:{
        justifyContent:"center",alignItems:"center",flex:1
    },
    container:{
      flex:1,
      backgroundColor:"#00aaf0",
      width:responsiveWidth(100),
      height:responsiveHeight(100),
  },
    header:{
      flexDirection:"row",
    justifyContent:"space-between",
    marginLeft:responsiveHeight(1),
    marginRight: responsiveHeight(2)
    },
    drawerButton: {
        padding: 0,
        marginTop:responsiveHeight(1)
      },
     
      equipmenttitle:{
        fontSize:responsiveFontSize(2.3),
        padding:responsiveHeight(1.5),
        color:"white",
        marginLeft:responsiveHeight(1),
        fontFamily:themeFamily.fontFamily
      },
      input:{
        borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
        borderWidth: 1,
        color: "#000",
        borderRadius:responsiveHeight(1),
        paddingHorizontal: responsiveWidth(2.3),
        paddingVertical: responsiveHeight(1.1),
        backgroundColor:"white",
     
      },
      searchcontainer:{
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveHeight(1.2),
      },
      addcontainer:{
        backgroundColor:"#037fb2",paddingVertical:responsiveWidth(3.3) ,margin:responsiveHeight(1.7),borderRadius:10
      },
      addtext:{
        textAlign:"center",fontSize:responsiveFontSize(2.2),color:"white",fontFamily:themeFamily.fontFamily
      },
      emptytext:{
        marginLeft:"40%"
      },
      imgcontainer:{
        marginTop:responsiveHeight(0.5)  
      },
      profileimg:{
        width:responsiveHeight(5) , height:responsiveHeight(5), borderRadius: responsiveWidth(5), 
      }
})

export default styles