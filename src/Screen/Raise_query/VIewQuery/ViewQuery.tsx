import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../CustomHeader/CustomHeader';
import api, { Image_Base_Url } from '../../../api/Api';
import styles from './styles';
import Textlabel from '../../../components/Textlabel';
import CommonCard from '../../../components/Common/CommonCard';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomImageModal from '../../../components/CustomImageModal';
import SuccessMessage, { ErrorMessage } from '../../../components/Common/CustomTostMessage';
import Loader from '../../../components/Loader';
const ViewQuery = ({ route }) => {
  const { user_id, case_id,shop_id } = route.params;
  // console.log(user_id,case_id,shop_id)
  const [viewQueryData, setViewQueryData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [defaultquerytitle, Setdefaultquerytitle] = useState('')
  const [defaultproduct_name, Setdefaultproduct_name] = useState('')
  const [ReplayFormVisible, SetReplayFormVisible] = useState(false)
  const [isBackImageModalVisible, setBackImageModalVisible] = React.useState(false)
  const [querydes, setquerydes] = useState('');
  const [ReplyImage, setReplyImage] = React.useState<string | null>(null);
  const [ReplyisLoading, setIReplysLoading] = useState(false);

  useEffect(() => {
    viewQuery();
  }, []);

  const viewQuery = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        const response = await api.view_query(user_id, case_id, token);
        // console.log("View Query:", response.data);
        if (response.data.success === true) {
          setViewQueryData(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("View Query error:", error);
        setIsLoading(false);
      }
    }
  };


  useEffect(() => {
    if (viewQueryData.data && viewQueryData.data.length > 0) {
      const lastIndex = viewQueryData.data.length - 1;
      Setdefaultquerytitle(viewQueryData.data[lastIndex].query_title);
      Setdefaultproduct_name(viewQueryData.data[lastIndex].product_name)
    }
  }, [viewQueryData]);

  const scrollViewRef = useRef();

  const toggleReplayForm = () => {
    SetReplayFormVisible(!ReplayFormVisible);
    // Scroll to the bottom of the page when the form is opened
    if (scrollViewRef.current && ReplayFormVisible === false) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 200); // Delay scrolling by 200 milliseconds
    }
  };


  const handleTextChange = (newText) => {
    setquerydes(newText);
  };


  const handleImage = (img) => {
    setReplyImage(img)
  }


  const handleDelete = () => {
    setReplyImage(null)
  }

  const handleImageModalVisible = () => {
    setBackImageModalVisible(!isBackImageModalVisible);
  };

  const handleSubmitReplyForm = async() => {
    setIReplysLoading(true)
    if(defaultquerytitle ==='' || querydes ==='' || ReplyImage ===null){
      ErrorMessage({ message: "All filed are required" }); // Pass the message as an object
      setIReplysLoading(false)
      return false
    }
    const ReplyData = new FormData();
    ReplyData.append('shop_id', shop_id);
    ReplyData.append('user_id', user_id);
    ReplyData.append('case_id', case_id);
    ReplyData.append('query_title', defaultquerytitle);
    ReplyData.append('product_name',defaultproduct_name)
    ReplyData.append('description', querydes);

    if (ReplyImage) {
      ReplyData.append('images', {
        uri: ReplyImage,
        name: 'images.jpg',
        type: 'image/jpg',
      });
    }
  

    const token = await AsyncStorage.getItem('token');
    if(token){
      
      try{
        const response=await api.user_query_reply(ReplyData,token)
        console.log("reply response",response.data)
        if(response.data.success=== true){
          setIReplysLoading(false)
          SuccessMessage({
            message:response.data.message
          })
          await viewQuery()
          toggleReplayForm()
          setquerydes('')
          setReplyImage(null)

        }
 
     }catch(error){
       console.log("Query reply error:",error)
     }
    } 
 
  
  }
  // console.log(viewQueryData)
  
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="View All Query" imgSource={require('../../../assets/img/profile_img.png')} />
      <View style={styles.maincontainer}>
        {isLoading ? (
          <ActivityIndicator animating={isLoading} size="large" color="blue" />
        ) : (
          <ScrollView ref={scrollViewRef}>
            {/* Map and display data from response.data.data */}
            {viewQueryData.data.map((item) => (
              <View key={item.id}>
                <CommonCard>
                  <Text style={styles.viewlabel}>{item.send_by === 1 ? item.shop : "Reply From Texa"}</Text>
                  <Textlabel title="Query Status:" value={item.status ? item.status : "Open"} />
                  <Textlabel title="Subject:" value={item.query_title} />
                  <Textlabel title="Message:" value={item.description} />
                  <Textlabel title="Product:" value={item.product_name} />
                  <Textlabel title="Submited At:" value={item.created_at} />
                  <View style={styles.imgcontainer}>
                    <Text style={styles.imageslabel}>{item.image1?'Label Image - 1':''}  {item.image2?'Label Image - 2':''}</Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
                      {item.image1 ? (
                        <Image source={{ uri: `${Image_Base_Url}/${item.image1}` }} style={styles.imges} />
                      ) : null}

                      {item.image2 ? (
                        <Image source={{ uri: `${Image_Base_Url}/${item.image2}` }} style={styles.imges} />
                      ) : null}
                    </View>
                  </View>


                  {/* ... and so on */}
                </CommonCard>
              </View>

            ))}
            <TouchableOpacity style={{ alignItems: "center", marginVertical: 14, backgroundColor: "#00aaf0", marginHorizontal: 18, borderRadius: 5, paddingVertical: 18 }} onPress={toggleReplayForm}>
              <Text style={{ color: "white", fontSize: 17 }}>
                Reply
              </Text>
            </TouchableOpacity>

            {ReplayFormVisible ? (
              <View style={{ marginVertical: 20, }}>
                <CustomTextInput
                  title='Subject'
                  placeholder='Enter Subject'
                  value={defaultquerytitle}
                  onChangeText={(item) =>Setdefaultquerytitle(item) }
                />

                <TextInput
                  style={styles.textarea}
                  placeholder="Add Message"
                  multiline={true} // Enables multiline mode
                  numberOfLines={4} // Number of lines to display (adjust as needed)
                  onChangeText={handleTextChange}
                  value={querydes}
                  placeholderTextColor={"#787a7c"}
                />

                <TouchableOpacity onPress={handleImageModalVisible} style={styles.ImageContainer}>
                  <Text style={{ fontSize: 17, color: "#333" }}>Add Image</Text>
                  <Text style={{ fontSize: 23, color: "#00aaf0" }}>+</Text>
                </TouchableOpacity>
                <View style={styles.selectedimgcontainer}>
                  {ReplyImage ? (
                    <View>
                      <Image source={{ uri: ReplyImage }} style={styles.selectedimg} />
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete()}
                      >
                        <Text style={styles.deleteButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>

                <TouchableOpacity style={{ width: "40%", backgroundColor: "#00aaf0", padding: 12, alignSelf: "center", borderRadius: 5 }} onPress={handleSubmitReplyForm}>
                  <Text style={{ color: "white", fontSize: 17, alignSelf: "center" }}>Submit Reply</Text>
                </TouchableOpacity>
              </View>

            ) : null}
          </ScrollView>
        )}
        <CustomImageModal
          togglevisible={isBackImageModalVisible}
          onclose={handleImageModalVisible}
          handelImage={(item) => {
            handleImageModalVisible();
            handleImage(item);
          }}
        />
      </View>



      <Loader loading={ReplyisLoading}/>
    </SafeAreaView>
  );
};

export default ViewQuery;
