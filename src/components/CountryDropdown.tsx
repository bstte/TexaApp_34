import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Modal, TextInput, SectionList, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { Image_Base_Url } from '../api/Api';
import api from '../api/Api';

interface CountryDropdownProps {
  togglevisible: any;
  onSelectCountry: (country: any) => void;
  onclose: any;
}

interface AllCountries {
  id: string;
  name: string;
  flag: string;
  calling_code: string;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({ togglevisible, onclose, onSelectCountry }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [AllCountries, setAllCountries] = React.useState<AllCountries[]>([]);

  useEffect(() => {
    get_countries();
  }, []);

  const get_countries = async () => {
    try {
      const response = await api.get_contries();
      setAllCountries(response.data.data);
    } catch (error) {
      console.log("Countries error:", error);
    } finally {
      setLoading(false);
    }
  };

  const CountriesOption = AllCountries.map((country) => ({
    label: country.name,
    value: country.id,
    flag: country.flag,
    calling_code: country.calling_code,
  }));

  const toggleModal = () => {
    onclose(false);
    setSearchTerm('');
    Keyboard.dismiss();
  };

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    onSelectCountry(item);
    toggleModal();
  };

  const filteredData = CountriesOption.filter((item) =>
  item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.calling_code.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <View style={styles.container}>
      <Modal
        visible={togglevisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
       <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <View style={styles.separator} />
              <TextInput
              placeholderTextColor={'#787a7c'}
                style={styles.searchInput}
                placeholder="Search..."
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={{ flex: 1 }}
                >
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
                        <View style={styles.itemContainer}>
                          <Image
                            source={{ uri: `${Image_Base_Url}/flags/${item ? item.flag : 'DE.png'}` }}
                            style={styles.flagimg}
                          />
                          <Text style={{color:"#787a7c"}}>{item.label}</Text>
                          <Text style={{ fontSize: responsiveFontSize(2) }}>(+{item.calling_code})</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </KeyboardAvoidingView>
              )}
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

export default CountryDropdown;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: "center",
    justifyContent: "flex-end",
  },
  modal: {
    width: responsiveWidth(100),
    height: responsiveHeight(60),
    backgroundColor: 'white',
    paddingHorizontal: responsiveHeight(2.3),
    borderTopLeftRadius: responsiveHeight(2),
    borderTopRightRadius: responsiveHeight(2),
    paddingBottom: responsiveHeight(2.3),
  },
  separator: {
    width: '12%',
    height: responsiveHeight(0.4),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    alignSelf:"center",
    marginTop: 10,
    marginBottom: 20,
  },
  searchInput: {
    color:"#000",
    borderWidth: responsiveHeight(0.1),
    borderColor: '#ccc',
    borderRadius: responsiveHeight(0.5),
    padding: responsiveHeight(1.2),
    marginBottom: responsiveHeight(1.2),
  },
  modalItem: {
    padding: responsiveHeight(1.9),
    fontSize: responsiveFontSize(2),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: "#202020",
    fontWeight: "400",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flagimg: {
    width: responsiveWidth(10),
    height: responsiveHeight(3),
    marginRight: responsiveHeight(1.5),
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
    backgroundColor: '#e6f7ff',
  },
});
