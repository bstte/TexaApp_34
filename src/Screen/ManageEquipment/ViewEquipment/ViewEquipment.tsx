import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import styles from './styles';
import api, { Image_Base_Url } from '../../../api/Api';
import CustomHeader from '../../CustomHeader/CustomHeader';
import Textlabel from '../../../components/Textlabel';
import CommonCard from '../../../components/Common/CommonCard';
import { SafeAreaView } from 'react-native';
import { viewFullImage } from '../../../components/Common/FullImage';
interface ViewProps {
    route: any;
}
const ViewEquipment: React.FC<ViewProps> = ({ route }) => {
    const { equipmentId } = route.params;
    const [ViewEquipmetn, setViewEquipmetn] = useState<any>({});
    const [Loading, setLoading] = useState(true);



    useEffect(() => {
        equipment_view();
    }, []);

    const equipment_view = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            if (token) {
                const response = await api.equipment_view(equipmentId, token);
                // console.log("here eq vi?ew response", response.data)
                if (response.data.success === true) {
                    setLoading(false);
                    console.log(response.data.data)
                    setViewEquipmetn(response.data.data);

                }
            }
        } catch (errer) {
            console.log(errer)
        }

    };

    return (
        <>
            <SafeAreaView style={styles.container}>
                <CustomHeader title="VIEW EQUIPMENT " imgSource={require('../../../assets/img/profile_img.png')} />
                <View style={styles.maincontainer}>
                    {Loading ? (
                        <ActivityIndicator animating={Loading} size="large" color="white" />
                    ) : (
                        <ScrollView>
                            <CommonCard>

                                {/* Conditionally render the data when it's available */}
                                {ViewEquipmetn && (
                                    <>
                                        <View style={{ flexDirection: "row",justifyContent:"space-between" }}>
                                            <Text style={styles.equipmentttitle}>{ViewEquipmetn.machine_type_name}</Text>
                                            {/* <TouchableOpacity style={[styles.statusButton, { backgroundColor: ViewEquipmetn.status ? 'green' : 'red' }]}> */}
                                            {/* <Icon name={ViewEquipmetn.status ? 'check' : 'check'} size={15} color="white" /> */}
                                            {/* </TouchableOpacity> */}
                                            <Text style={[styles.statusText, { color: ViewEquipmetn.status ? 'green' : 'red' }]}>{ViewEquipmetn.status ? 'Active' : 'Inactive'}</Text>
                                        </View>
                                        {ViewEquipmetn.brand_name ? (
                                            <Textlabel title="Brand Name:" value={ViewEquipmetn.brand_name} />
                                        ) : null}

                                        {ViewEquipmetn.machine_name ? (
                                            <Textlabel title="Machine Name:" value={ViewEquipmetn.machine_name} />
                                        ) : null}

                                        {ViewEquipmetn.model_name ? (

                                            <Textlabel title="Model:" value={ViewEquipmetn.model_name} />

                                        ) : null}


                                        {ViewEquipmetn.install_year ? (

                                            <Textlabel title="Installation Year:" value={ViewEquipmetn.install_year} />

                                        ) : null}
                                        {ViewEquipmetn.capacity ? (

                                            <Textlabel title="Capacity:" value={ViewEquipmetn.capacity} />

                                        ) : null}

                                        {ViewEquipmetn.dc_no_tank ? (

                                            <Textlabel title="Number of Tank(s):" value={ViewEquipmetn.dc_no_tank} />

                                        ) : null}

                                        {ViewEquipmetn.dc_solvent ? (

                                            <Textlabel title="Solvent:" value={ViewEquipmetn.dc_solvent} />

                                        ) : null}
                                        {ViewEquipmetn.dc_heat_Type ? (

                                            <Textlabel title="Heat Type:" value={ViewEquipmetn.dc_heat_Type} />

                                        ) : null}

                                        {ViewEquipmetn.dc_filter ? (

                                            <Textlabel title="Filter:" value={ViewEquipmetn.dc_filter} />

                                        ) : null}

                                        {ViewEquipmetn.dc_frequency_motor ? (

                                            <Textlabel title="Frequency Motor:" value={ViewEquipmetn.dc_frequency_motor} />

                                        ) : null}
                                        {ViewEquipmetn.dc_spray_unit ? (

                                            <Textlabel title="Spray Unit:" value={ViewEquipmetn.dc_spray_unit} />

                                        ) : null}
                                        {ViewEquipmetn.dc_solvent_cooling_system ? (

                                            <Textlabel title="Solvent Cooling System:" value={ViewEquipmetn.dc_solvent_cooling_system} />

                                        ) : null}
                                        {ViewEquipmetn.dc_distilation_type ? (

                                            <Textlabel title="Distillation Type:" value={ViewEquipmetn.dc_distilation_type} />

                                        ) : null}
                                        {ViewEquipmetn.dc_distilation_method ? (

                                            <Textlabel title="Distillation Method: " value={ViewEquipmetn.dc_distilation_method} />

                                        ) : null}
                                        {ViewEquipmetn.dc_distilation ? (

                                            <Textlabel title="Distillation:" value={ViewEquipmetn.dc_distilation} />

                                        ) : null}
                                        {ViewEquipmetn.wm_heat_type ? (

                                            <Textlabel title="Heat Type:" value={ViewEquipmetn.wm_heat_type} />

                                        ) : null}
                                        {ViewEquipmetn.wm_machion_type ? (

                                            <Textlabel title="Machine Type:" value={ViewEquipmetn.wm_machion_type} />

                                        ) : null}
                                        {ViewEquipmetn.wm_volume ? (

                                            <Textlabel title="Volume:" value={ViewEquipmetn.wm_volume} />

                                        ) : null}
                                        {ViewEquipmetn.wm_program_type ? (

                                            <Textlabel title="Program Type:" value={ViewEquipmetn.wm_program_type} />

                                        ) : null}

                                        {ViewEquipmetn.fe_finishing_equipment_type ? (

                                            <Textlabel title="Finishing Equipment Type:" value={ViewEquipmetn.fe_finishing_equipment_type} />

                                        ) : null}
                                        {ViewEquipmetn.dryer_type ? (

                                            <Textlabel title="Dryer Type:" value={ViewEquipmetn.dryer_type} />

                                        ) : null}
                                        {ViewEquipmetn.dryer_volume ? (

                                            <Textlabel title="Volume:" value={ViewEquipmetn.dryer_volume} />

                                        ) : null}
                                        {ViewEquipmetn.dryer_program_number ? (

                                            <Textlabel title="Program Number:" value={ViewEquipmetn.dryer_program_number} />

                                        ) : null}
                                        {ViewEquipmetn.dryer_program_name ? (

                                            <Textlabel title="Program Name:" value={ViewEquipmetn.dryer_program_name} />

                                        ) : null}

                                        {ViewEquipmetn.dosage ? (

                                            <Textlabel title="Dosage Equipments:" value={ViewEquipmetn.dosage_name} />

                                        ) : null}
                                        {ViewEquipmetn.other_dosage ? (

                                            <Textlabel title="Other Dosage:" value={ViewEquipmetn.other_dosage} />

                                        ) : null}

                                    </>
                                )}
                            </CommonCard>




                            {ViewEquipmetn.front_image || ViewEquipmetn.back_image ? (
                                <CommonCard>
                                    <Text style={styles.imageslabel}>{ViewEquipmetn.front_image ? 'Front Images' : ''}  {ViewEquipmetn.back_image ? 'Back Images' : ''}</Text>
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
                                        {ViewEquipmetn.front_image ? (
                                             <TouchableOpacity  onPress={() => viewFullImage({ fullImage: `${Image_Base_Url}/${ViewEquipmetn.front_image}` })}>
                                            <Image source={{ uri: `${Image_Base_Url}/${ViewEquipmetn.front_image}` }} style={styles.imges} />
                                            </TouchableOpacity>
                                        ) : null}

                                        {ViewEquipmetn.back_image ? (
                                            <TouchableOpacity  onPress={() => viewFullImage({ fullImage: `${Image_Base_Url}/${ViewEquipmetn.back_image}` })}>
                                            <Image source={{ uri: `${Image_Base_Url}/${ViewEquipmetn.back_image}` }} style={styles.imges} />
                                            </TouchableOpacity>
                                        ) : null}
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

export default ViewEquipment