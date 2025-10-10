import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import api, { Image_Base_Url } from '../../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import CustomHeader from '../../CustomHeader/CustomHeader';
import Textlabel from '../../../components/Textlabel';
import CommonCard from '../../../components/Common/CommonCard';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { viewFullImage } from '../../../components/Common/FullImage';
import { SafeAreaView } from 'react-native-safe-area-context';
interface ViewProps {
    route: any;
}
const ViewDosage: React.FC<ViewProps> = ({ route }) => {
    const { dosageId } = route.params;
    const [ViewDosage, setViewDosage] = useState<any>({});
    const [Loading, setLoading] = useState(true);
    const [ProductNameString, setProductNameString] = useState('');
    useEffect(() => {
        view_dosage();
    }, []);

    const view_dosage = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            const response = await api.view_dosage(dosageId, token);

            if (response.data.success === true) {
                console.log(response.data)
                setLoading(false);
                setViewDosage(response.data.data);

            }
        }
    };

    useEffect(() => {
        if (ViewDosage.product && typeof ViewDosage.product === 'object') {
            const ProductName = Object.values(ViewDosage.product)
                .filter(item => item && item.hasOwnProperty('product_name'))
                .map(item => item.product_name);
            setProductNameString(ProductName.join(", "));
        } else {
            console.log("ViewDosage.product is undefined or null");
        }
    }, [ViewDosage.product]); // Only run this effect when ViewDosage.product changes


    return (
        <>
            <SafeAreaView style={styles.container}>
                <CustomHeader title="View Dosage" imgSource={require('../../../assets/img/profile_img.png')} />
                <View style={styles.maincontainer}>
                    {Loading ? (
                        <ActivityIndicator animating={Loading} size="large" color="white" />
                    ) : (
                        <ScrollView>
                            <CommonCard>

                                {ViewDosage && (
                                    <>
                                        <View style={{ flexDirection: "row",justifyContent:"space-between" }}>
                                            <Text style={styles.dosagettitle}>Dosage Details</Text>
                                            {/* <TouchableOpacity style={[styles.statusButton, { backgroundColor: ViewDosage.status ? 'green' : 'red' }]}> */}
                                            {/* <Icon name={ViewDosage.status ? 'check' : 'check'} size={15} color="white" /> */}
                                            {/* </TouchableOpacity> */}
                                            <Text style={[styles.statusText, { color: ViewDosage.status ? 'green' : 'red' }]}>{ViewDosage.status ? 'Active' : 'Inactive'}</Text>
                                        </View>
                                        <Textlabel title="Manufacturer:" value={ViewDosage.model_name} />
                                        <Textlabel title="Model Name:" value={ViewDosage.model_no} />
                                        <Textlabel title="Product Name:" value={ProductNameString} />
                                        <Textlabel title="No. of Washers:" value={ViewDosage.pupmps_no} />
                                        <Textlabel title="No. of Pumps:" value={ViewDosage.washers_no} />
                                    </>
                                )}
                            </CommonCard>
                            {ViewDosage.images ? (
                                <CommonCard>
                                    <Text style={styles.imageslabel}> Images </Text>
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: responsiveHeight(1) }}>

                                        
                                        {ViewDosage.images && ViewDosage.images.map((imageUrl: string, index: number) => (
                                             <TouchableOpacity key={index} onPress={() => viewFullImage({ fullImage: `${Image_Base_Url}/${imageUrl.image}` })}>
                                        <Image key={index} source={{ uri: `${Image_Base_Url}/${imageUrl.image}` }} style={styles.imges} />
                                        </TouchableOpacity>
                                    ))}

                                    </View>


                                </CommonCard>
                            ) : null}


                        </ScrollView>
                    )}
                </View>
            </SafeAreaView>


            {
                Loading ? (
                    <View style={styles.submitloader}>
                        <ActivityIndicator animating={Loading} size="large" color="white" />
                    </View>
                ) : null
            }
        </>
    )
}

export default ViewDosage