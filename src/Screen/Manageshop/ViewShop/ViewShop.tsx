import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, FlatList, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {
    responsiveHeight,

} from "react-native-responsive-dimensions";
import styles from './styles';
import api, { Image_Base_Url } from '../../../api/Api';
import CustomHeader from '../../CustomHeader/CustomHeader';
import Textlabel from '../../../components/Textlabel';
import CommonCard from '../../../components/Common/CommonCard';
import { viewFullImage } from '../../../components/Common/FullImage';

interface ViewProps {
    route: any;
}

const ViewShop: React.FC<ViewProps> = ({ route }) => {
    const { shopId } = route.params;
    const [ViewShop, setViewShop] = useState<any>({});
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        view_shop();
    }, []);

    const view_shop = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            const response = await api.view_shop(shopId, token);
            if (response.data.success === true) {
                setLoading(false);
                setViewShop(response.data);
                // console.log("shop respone",response.data)

            }
        }
    };

    // const isActive = true;
    // const statusText = isActive ? 'Active' : 'Inactive';
    // const statusColor = isActive ? 'green' : 'red';

    // Create a map of application_type_id to products
    const applicationTypeProductsMap: { [key: string]: any[] } = {};
    if (ViewShop.applicationType && ViewShop.shop_product) {
        ViewShop.shop_product.forEach((productMap: any) => {
            const [appTypeId, productIds] = Object.entries(productMap)[0];
            const products = ViewShop.applicationType.find((appType: any) => appType.id === Number(appTypeId))?.products || [];
            const filteredProducts = products.filter((product: any) => productIds.includes(product.id));
            applicationTypeProductsMap[appTypeId] = filteredProducts;
        });
    }


    return (
        <>
            <SafeAreaView style={styles.container}>
                <CustomHeader title="View Shop" imgSource={require('../../../assets/img/profile_img.png')} />
                <View style={styles.maincontainer}>
                    {Loading ? (
                        <ActivityIndicator animating={Loading} size="large" color="white" />
                    ) : (
                        <ScrollView style={{marginBottom:30}}>
                            <CommonCard>
                                {/* <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15, marginRight: 90 }}>Contact Details</Text>
                                    <TouchableOpacity style={[styles.statusButton, { backgroundColor: statusColor }]}>
                                        <Icon name={isActive ? 'check' : 'check'} size={15} color="white" />
                                    </TouchableOpacity>
                                    <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
                                </View> */}
                                {/* Conditionally render the data when it's available */}
                                {ViewShop.shop && (
                                    <>
                                        <View style={{ flexDirection: "row",justifyContent:"space-between" }}>
                                            <Text style={styles.contacttitle}>Contact Details</Text>
                                            {/* <TouchableOpacity style={[styles.statusButton, { backgroundColor: ViewShop.shop.status ? 'green' : 'red' }]}> */}
                                                {/* <Icon name={ViewShop.shop.status ? 'check' : 'check'} size={responsiveHeight(2)} color="white" /> */}
                                            {/* </TouchableOpacity> */}
                                            <Text style={[styles.statusText, { color: ViewShop.shop.status ? 'green' : 'red' }]}>{ViewShop.shop.status ? 'Active' : 'Inactive'}</Text>
                                        </View>
                                        <Textlabel title="Shop Name:" value={ViewShop.shop.shop_name} />
                                        <Textlabel title="Contact Person:" value={ViewShop.shop.shop_contact_person} />
                                        <Textlabel title="Email:" value={ViewShop.shop.email} />
                                        <Textlabel title="Phone Number:" value={ViewShop.shop.country_code ? `(+${ViewShop.shop.country_code}) ${ViewShop.shop.phone}` : ViewShop.shop.phone} />
                                    </>
                                )}
                            </CommonCard>

                            {/* // Display all application types and their associated products in one view */}
                            <CommonCard>
                                <Text style={styles.contacttitle}>Products List</Text>
                                {Object.keys(applicationTypeProductsMap).map((appTypeId) => {
                                    const appType = ViewShop.applicationType.find((app: any) => app.id === Number(appTypeId));
                                    return (
                                        <View key={appTypeId} >
                                            {/* <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10,}}>{appType?.application_type}</Text> */}
                                            {applicationTypeProductsMap[appTypeId].map((product: any) => (
                                                <Textlabel key={product.id} title={`${appType?.application_type} =>`} value={product.product_name} />
                                            ))}
                                        </View>
                                    );
                                })}
                            </CommonCard>




                            <CommonCard>
                                <Text style={styles.contacttitle}>Images</Text>

                                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: responsiveHeight(1) }}>
                                    {ViewShop.image && ViewShop.image.map((imageUrl: string, index: number) => (
                                        <TouchableOpacity key={index} onPress={() => viewFullImage({ fullImage: `${Image_Base_Url}/${imageUrl}` })}>

                                    
                                        <Image key={index} source={{ uri: `${Image_Base_Url}/${imageUrl}` }} style={styles.imges} />
                                        </TouchableOpacity>
                                    ))}

                                </View>

                                </CommonCard>
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
    );
};

export default ViewShop;
