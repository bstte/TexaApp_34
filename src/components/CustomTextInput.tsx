// CustomTextInput.js
import React from 'react';
import { StyleSheet, TextInput, View, Text, Platform } from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { themeFamily } from '../theme';

interface CustomTextInputProps {
    value: string,
    placeholder: string,
    title: string,
    onChangeText: (text: string) => void;
    keyboardType: string;
    secureTextEntry: boolean;
    required: boolean
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ title, value, placeholder, onChangeText, keyboardType = 'default', secureTextEntry = false, required, ...rest }) => {
    return (
        <View style={styles.inputView}>

            <View style={styles.titleContainer}>
                <Text style={styles.textinputlabel}>{title}</Text>
                {required ? (
                    <Text style={styles.asterisk}>*</Text>
                ) : null}

            </View>
            <TextInput
                style={styles.inputText}
                autoCapitalize='none'
                placeholderTextColor={"#787a7c"}
                autoCorrect={false}
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                {...rest}
            />
        </View>
    );
};

export default CustomTextInput;

const styles = StyleSheet.create({
    inputText: {
        width: responsiveWidth(95),
        height: responsiveHeight(7),
        marginVertical: responsiveHeight(0.5),
        marginHorizontal: responsiveHeight(1.5),
        // backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : 'white',
        borderRadius: responsiveHeight(1.5),
        borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
        borderWidth: 1,
        padding: responsiveHeight(1.5),
        color: "#000",
        // elevation: responsiveHeight(0.2),
    },
    textinputlabel: {
        fontSize: responsiveFontSize(1.9),
        color: "#1A1A18",
        fontFamily: themeFamily.fontFamily,
    },
    asterisk: {
        color: 'red',
        marginLeft: responsiveHeight(0.5),
        fontSize: responsiveFontSize(1.9),
    },
    inputView: {
        marginTop: responsiveHeight(1.7),
        width: responsiveWidth(95),
        marginRight: responsiveHeight(2),
        position: "relative",
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: responsiveHeight(2.2),
        marginBottom: responsiveHeight(0.5),
    },
});
