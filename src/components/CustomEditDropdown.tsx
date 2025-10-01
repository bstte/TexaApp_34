import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    TextInput,
    StyleSheet,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    SectionList,
    TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { themeFamily } from '../theme';

interface DropdownProps {
    data: any[];
    placeholder: string;
    onSelect: (value: any) => void;
    iconName: string;
    selectedValue: any;
    isDisabled: boolean; // New prop to control the disabled state
    title: string,
    required:boolean
}


const CustomEditDropdown: React.FC<DropdownProps> = ({ title, data, placeholder, onSelect, iconName, selectedValue, isDisabled,required }) => {

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        // Set the default selected value when the component mounts
        if (selectedValue && data) {
            const defaultSelected = data.find((item) => item.value === selectedValue);
            setSelectedItem(defaultSelected || null);
        }
    }, [selectedValue, data]);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        setSearchTerm('');
    };

    const handleSelectItem = (item: any) => {
        setSelectedItem(item);
        onSelect(item.value);
        toggleModal();
        Keyboard.dismiss();
    };

    const filteredData = data.filter((item) =>
    typeof item.label === 'string' && item.label.toLowerCase().includes(searchTerm.toLowerCase())
);



    return (
        <View style={styles.container}>
            <View style={{ marginTop: 10 }}>
            <View style={styles.titleContainer}>
                <Text style={styles.textinputlabel}>{title}</Text>
                {required ? (
                    <Text style={styles.asterisk}>*</Text>
                ) : null}

            </View>

                <TouchableOpacity onPress={toggleModal} style={styles.dropdowncontainer}>
                    <Text style={styles.dropdownText}>{selectedItem ? selectedItem.label : placeholder}</Text>
                    <Icon name="caret-down" size={responsiveFontSize(2)} style={styles.dropdownIcon} />
                </TouchableOpacity>

            </View>


            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={toggleModal}
            >
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <View style={styles.modalContainer}>

                        <View style={[styles.modal, { width: responsiveWidth(100), height: responsiveHeight(60) }]}>
                            <View style={{ width: '12%', height: responsiveHeight(0.4), justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc',alignSelf:"center", marginTop: 10, marginBottom: 20 }} />

                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search..."
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                                placeholderTextColor={'#787a7c'}
                            />
                            <SectionList
                                sections={[{ data: filteredData }]}
                                keyExtractor={(item) => item.value}
                                keyboardShouldPersistTaps="handled"
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelectItem(item)}
                                        style={[
                                            styles.modalItem,
                                            selectedItem && selectedItem.value === item.value && styles.selectedItem,
                                        ]}
                                    >
                                        <Text style={{color:"#787a7c"}}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />


                            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                                <Text style={{ color: "#00aaf0", fontSize: responsiveFontSize(2) }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainerCentered: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.10)',
    },
    dropdowncontainer: {
        width: responsiveWidth(95),

        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        // backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : 'white',
        borderRadius: responsiveHeight(1.5),
        borderColor:  Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.10)' : '#ddd',
        borderWidth: 1,
        padding: responsiveHeight(2.2),
        // elevation: responsiveHeight(0.2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    dropdownText: {
        color: "black",
        fontSize: responsiveFontSize(2),
    },
    dropdownIcon: {
        marginLeft: responsiveWidth(2),
    },


    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        backgroundColor: 'white',

        borderTopLeftRadius: responsiveHeight(2),
        borderTopRightRadius: responsiveHeight(2),
        paddingHorizontal: responsiveHeight(2.3),

        paddingBottom: responsiveHeight(2.3),

    },
 
    searchInput: {
        borderWidth: responsiveHeight(0.1),
        borderColor: '#ccc',
        borderRadius: responsiveHeight(0.5),
        padding: responsiveHeight(1.2),
        marginBottom: responsiveHeight(1.2),
        color:"#000",
    },
    modalItem: {
        padding: responsiveHeight(1.9),
        fontSize: responsiveFontSize(2),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: "#202020", fontWeight: "400"
    },
    closeButton: {
        marginTop: responsiveHeight(1.2),
        padding: responsiveHeight(1.3),
        borderWidth: 1,
        borderRadius: responsiveHeight(0.5),
        alignSelf: 'flex-end',
        borderColor: '#ccc',
    },
    selectedItem: {
        backgroundColor: '#e6f7ff', // Add the background color you want for the selected item
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: responsiveHeight(2.2),
        marginBottom: responsiveHeight(0.5),
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
});
export default CustomEditDropdown