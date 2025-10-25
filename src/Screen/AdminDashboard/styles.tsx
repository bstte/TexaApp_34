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
    height: responsiveHeight(100),
  },
  drawerButton: {
    padding: 0,
    marginTop: responsiveHeight(1),
  },
  DrawerIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: responsiveHeight(1),
    marginRight: responsiveHeight(2),
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    marginHorizontal: responsiveHeight(3),
    marginVertical: responsiveHeight(1.5),
    color: "white",
    fontFamily: themeFamily.fontFamily,
  },
  imgcontainer: {
    marginTop: responsiveHeight(0.5),
  },
  profileimg: {
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    borderRadius: responsiveWidth(5),
  },
  cardContainer: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    borderTopLeftRadius: responsiveHeight(3),
    borderTopRightRadius: responsiveHeight(3),
    marginTop: responsiveHeight(2),
    padding: responsiveHeight(2),
  },
  card: {
    flex: 0.48,
    borderRadius: responsiveHeight(2),
    paddingVertical: responsiveHeight(3),
    alignItems: "center",
    marginBottom: responsiveHeight(2),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: responsiveFontSize(2),
    color: "#fff",
    marginTop: responsiveHeight(1),
    textAlign: "center",
  },
  cardValue: {
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    color: "#fff",
    marginTop: responsiveHeight(1),
  },
});

export default styles;
