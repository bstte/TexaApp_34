

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
    title: string,
    addNewItem:(value:any)=>void,
    required:boolean
    selectedValue:any

}

const CustomDropdownWithAddItem: React.FC<DropdownProps> = ({ title, data, placeholder, onSelect,addNewItem ,required,selectedValue}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');




    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        setSearchTerm('');
    };
    useEffect(() => {
        // Set the default selected value when the component mounts
        if (selectedValue && data) {
            const item = data.find((item) => item.value === selectedValue);
            setSelectedItem(item || null);
            if(item){
                toggleModal();
                Keyboard.dismiss();
                // console.log("defaulst",item)
                onSelect(item);
              
            }
        
        }
    }, [selectedValue, data]);
    const handleSelectItem = (item: any) => {
        // console.log(item)
        setSelectedItem(item);
        onSelect(item);
        toggleModal();
        Keyboard.dismiss();
    };

    const AddNewItem=(item)=>{
        addNewItem(item)
        setSearchTerm("")
    }

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
                    <Text style={styles.dropdownText}>
                        {selectedItem ? selectedItem.label : placeholder}
                    </Text>

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
    <View style={[styles.modalContainer, styles.modalContainerCentered]}>
        <View style={[styles.modal, { width: responsiveWidth(100), height: responsiveHeight(60) }]}>
            <View style={{ width: '12%', height: responsiveHeight(0.4), justifyContent: 'center', alignItems: 'center', alignSelf: "center", backgroundColor: '#ccc', marginTop: 10, marginBottom: 20 }} />

            <TextInput
                style={styles.searchInput}
                placeholderTextColor={"#787a7c"}
                placeholder="Search..."
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
            {
                filteredData.length > 0 ? (
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
                                <Text style={styles.itemlabel}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    searchTerm === "" ? (
                        <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                            <Text style={{color:"black",fontSize:17}}>No Data</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.modalItem}
                            onPress={() => AddNewItem(searchTerm)}
                        >
                            <Text style={styles.itemlabel}>{searchTerm}</Text>
                        </TouchableOpacity>
                    )
                )
            }
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                <Text style={{ color: "#00aaf0", fontSize: responsiveFontSize(2) }}>Close</Text>
            </TouchableOpacity>
        </View>
    </View>
</TouchableWithoutFeedback>

            </Modal>
        </View>
    );
};

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
        color: "#202020",
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
    // textinputlabel: {
    //     marginLeft: responsiveHeight(2.2), fontSize: responsiveFontSize(1.9), color: "#1A1A18", fontFamily: themeFamily.fontFamily
    // },
    searchInput: {
        borderWidth: responsiveHeight(0.1),
        borderColor: '#ccc',
        borderRadius: responsiveHeight(0.5),
        padding: responsiveHeight(1.2),
        marginBottom: responsiveHeight(1.2),
        color:"black"
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
    itemlabel: {
        fontSize: responsiveFontSize(1.8),
        color: "#000",
        fontFamily: themeFamily.fontFamily
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

export default CustomDropdownWithAddItem;
