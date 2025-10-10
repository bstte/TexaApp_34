import { StyleSheet } from "react-native";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { themeFamily } from "../../../theme";


const styles = StyleSheet.create({
    loader: {
        justifyContent: "center", alignItems: "center", flex: 1
    },
    container: {
        flex: 1,
        // backgroundColor: "#00aaf0",
    },
    maincontainer: {
        flex: 1,
        backgroundColor: "white",
    },
    input: {
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
    searchprodutsinput: {
        // height: responsiveHeight(6),
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(0.5),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        padding: responsiveHeight(1),
        shadowColor: '#000',
        shadowOffset: {
            width: responsiveWidth(0),
            height: responsiveHeight(0.5),
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: responsiveHeight(0.4),
        color:"#000"
    },
    country_calling_code_textinput: {
        height: responsiveHeight(7.5),

        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        paddingLeft: responsiveHeight(9.5),
        shadowColor: '#000',
        shadowOffset: {
            width: responsiveWidth(0),
            height: responsiveHeight(0.5),
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: responsiveHeight(0.4),
        color:"#000",
    },
    country_calling_code: {
        height: responsiveHeight(7.5),
        position: "absolute",
        left: 10,
        fontSize: 18,

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
        fontWeight: "500",
    },
    applicationtypeContainer: {
        // height: responsiveHeight(6.8),
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        paddingLeft: responsiveHeight(1.7),
        borderColor: "#797979",
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

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
        fontSize: responsiveFontSize(1.8),
        flex: 1, color:"#000",fontFamily:themeFamily.fontFamily
    },
    addtext: {
        paddingVertical: responsiveHeight(1.5), marginHorizontal: responsiveWidth(1.5),
        backgroundColor: '#00aaf0',
        borderRadius: responsiveHeight(0.5),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: responsiveHeight(2)
    },
    applicationlabel: {
        fontSize: responsiveFontSize(2), marginTop: responsiveHeight(1), marginLeft: responsiveHeight(2), color:"#000",fontFamily:themeFamily.fontFamily
    },
    applicationTypelabel:{
        fontSize: responsiveFontSize(1.6),fontFamily:themeFamily.fontFamily,
        color:"#000" 
    },
    productlabel:{
        flex: 1,color:"#000",fontFamily:themeFamily.fontFamily
    },
    imgcontainer: {
        flexDirection: "row", flexWrap: "wrap", gap: responsiveHeight(0.5), marginHorizontal: responsiveWidth(4)
    },
    selectedimg: {
        width: responsiveWidth(20), height: responsiveHeight(10)
    },
    uploadimgcontainer: {
        flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2)
    },
    uploadimgtext: {
        fontSize: responsiveFontSize(2.4), marginVertical: responsiveHeight(2),
        marginHorizontal: responsiveHeight(1), color: "#202020"
    },
    addshoptext:
    {
        color: 'white', fontSize: responsiveFontSize(2.5), fontFamily:themeFamily.fontFamily
    },
    submitloader: {
        flex: 1, width: "100%", height: "100%", justifyContent: "center", position: "absolute", backgroundColor: "#89898frgba(0, 0, 0, 0.5)", zIndex: 999
    },
    modelContainer: {
        flex: 1, justifyContent: 'center',
    },
    modelView: {
        margin: responsiveHeight(2), backgroundColor: 'white', justifyContent: 'center', borderRadius: responsiveHeight(2), padding: responsiveHeight(3.5), width: responsiveWidth(90), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: responsiveHeight(0.5), elevation: responsiveHeight(1),
        display: "flex",
    },
    modelapplicationlable: {
        fontSize: responsiveFontSize(2), marginTop: responsiveHeight(1),color:"#000",fontFamily:themeFamily.fontFamily
    },
    oktext: {
        fontSize: responsiveFontSize(2), color: "#00aaf0", borderWidth: 1, borderColor: "black", paddingHorizontal: responsiveHeight(2.8), marginTop: responsiveHeight(1.2), paddingVertical: responsiveHeight(0.5), borderRadius: responsiveHeight(5)
    },
    imageContainer: {
        marginRight: 10,
        marginBottom: 10,
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: "center",
        justifyContent: "flex-end",
    },
    modal: {
        width: responsiveWidth(100),
        height: responsiveHeight(30),
        backgroundColor: 'white',
        paddingHorizontal: responsiveHeight(2.3),
        borderTopLeftRadius: responsiveHeight(2),
        borderTopRightRadius: responsiveHeight(2),
        paddingBottom: responsiveHeight(2.3),
    },
    separator: {
        width: '15%',
        height: responsiveHeight(0.4),
        justifyContent: 'center',
        backgroundColor: '#ccc',
        marginTop: 10,
        marginBottom: 20,
        alignSelf:"center"
    },
    cameraContainer: {
        flexDirection: "row", alignItems: "center", marginBottom: 14
    },
    GalleryContainer: {
        flexDirection: "row", alignItems: "center"
    },
    text: {
        fontSize: 18, color: "#333", fontWeight: "400"
    },
    ImageContainer: {
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        borderRadius: responsiveHeight(1.5),
        padding: responsiveHeight(1.3),
        paddingLeft: responsiveHeight(1.7),
        borderWidth: 1,
        borderColor: "#797979",
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    closeButton: {
        marginTop: responsiveHeight(3.2),
        padding: responsiveHeight(1.3),
        borderWidth: 1,
        borderRadius: responsiveHeight(0.5),
        alignItems: "center",
        borderColor: '#ccc',
    },
    textinputlabel: {
        marginLeft: responsiveHeight(2.2), fontSize: responsiveFontSize(1.8), color: "#000", fontFamil: themeFamily.fontFamily
    },
    numbercontainer: {
        marginTop: responsiveHeight(1.7)
    }
})

export default styles