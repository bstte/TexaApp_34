import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from "react-native";
import CustomHeader from "../CustomHeader/CustomHeader";
import api from "../../api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const DeleteAccountScreen = () => {

    const navigation = useNavigation();

    const handleDeletePress = () => {
        Alert.alert(
            "Are you sure?",
            "Once deleted, you will not be able to recover your account and all your data will be lost.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => handleDeleteAccount() }
            ]
        );
    };

    const handleDeleteAccount = async () => {
        // Yahan API call ya delete function likh sakte ho
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                console.log(token)
                const response = await api.deleteaccount(token);
                console.log(response.data)
                Alert.alert("Account Deleted", response.data.msg);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });

            }

        } catch (error) {
            console.error("delete account error:", error)
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader title="Delete Account" imgSource={''} />

            <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>

                <Text style={styles.heading}>Delete Your Account</Text>
                <Text style={styles.description}>
                    Deleting your account is a permanent action and cannot be undone. Once your account is deleted, you will lose all your data:
                </Text>

                <Text style={styles.warningText}>
                    If you are sure you want to proceed, click the button below.
                </Text>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        color: "black",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        marginBottom: 10,
    },
    listItem: {
        fontSize: 16,
        color: "#666",
        textAlign: "left",
        width: "100%",
    },
    warningText: {
        fontSize: 18,
        color: "red",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    deleteButton: {
        backgroundColor: "red",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    deleteButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default DeleteAccountScreen;
