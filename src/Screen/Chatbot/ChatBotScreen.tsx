import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import CustomHeader from '../CustomHeader/CustomHeader';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/Api';
import Loader from '../../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuccessMessage from '../../components/Common/CustomTostMessage';
import { handleApiError } from '../utils/handleApiError';
type ChatMessage = {
  from: 'bot' | 'user';
  text: string;
  type?: string;
  options?: string[];
  mediaUri?: string;
  questionId?: number | string; // <-- added

};

const questions = [
  { id: 1, type: 'options', text: 'Please select the process you are using:', options: ['Laundry', 'Dry-cleaning', 'Wet-cleaning', 'Spotting'] },
  { id: 2, type: 'options', text: 'Please select the issue you are facing:', options: ['Stains/dirt are not removed', 'Damage to textile', 'Unsure about technology/process to use', 'Unsure about product, dosage, or application', 'Issue with dosing equipment', 'Equipment maintenance required', 'Product not working', 'Installation support', 'Dosage guidance', 'Machine compatibility', 'Product result concern', 'Other'] },
  { id: 3, type: 'text', text: 'Which product are you referring to?', placeholder: "Please mention the exact name or code, if available" },
  { id: 4, type: 'text', text: 'Briefly describe the issue you are experiencing:', placeholder: "e.g., “Foam not dissolving”, “Machine not accepting product”, etc.)" },
  { id: 5, type: 'options', text: 'When did the issue first occur?', options: ['Today', 'Since last 2 days', 'Last week', 'Other'] },
  { id: 6, type: 'options', text: 'Have you already spoken to a Seitz representative or received a product demo?', options: ['Yes', 'No', 'Not Sure'] },
  { id: 6.1, type: 'text', text: 'Please enter your name:', placeholder: "Enter your name" },
  { id: 7, type: 'file', text: 'Please upload supporting material' },
  { id: 8, type: 'options', text: 'How urgent is this case?', options: ['Very urgent', 'Can wait a couple of hours', 'Not urgent'] },
  { id: 9, type: 'text', text: 'Preferred Language of Communication:', placeholder: "Enter language" },
  { id: 10, type: 'options', text: 'Preferred Contact Method:', options: ['WhatsApp', 'Email', 'Phone Call'] },
  { id: 11, type: 'text', text: 'Contact Details:', placeholder: "Enter Details" },
  { id: 12, type: 'text', text: 'Old Inquiry or Ticket Number (if any):', placeholder: "Ticket Number" }
];

export default function ChatBotScreen({ route }) {
  const { onFinish } = route.params;
  const [currentStep, setCurrentStep] = useState(-1); // -1 means shop step
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [isAnswering, setIsAnswering] = useState(false); // 👈 NEW lock state
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOther, setIsOther] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [UserShop, setUserShop] = useState<any[]>([]);


  useEffect(() => {
    get_query_shop()
  }, [])


  const get_query_shop = async () => {
    const userId = await AsyncStorage.getItem('userId')
    const token = await AsyncStorage.getItem('token');
    if (token && userId) {
      // console.log("get query data id token",token,userId)
      const response = await api.get_query_shop(userId, token);
      // console.log("here get_query_shop", response.data.data)

      if (response.data.success === true) {
        setUserShop(response.data.data)
        setChatHistory([
          { from: 'bot', text: 'Please select your shop:', type: 'options', options: response.data.data.map((s: any) => s.shop_name) }
        ]);
      }
    }
  }




  useEffect(() => {
    if (currentStep === -1) return;
    if (!isOther && currentStep < questions.length) {
      const question = questions[currentStep];
      setChatHistory(prev => [
        ...prev,
        { from: 'bot', text: question.text, type: question.type, options: question.options || [] }
      ]);
    } else if (currentStep >= questions.length) {
      submitData();
    }
  }, [currentStep]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory]);

  const handleAnswer = (answer: string) => {
    if (!answer.trim() || isAnswering) return; // 👈 agar already answering hai, ignore karo

    setIsAnswering(true); // 👈 lock lagao

    if (currentStep === -1) {
      const selectedShop = UserShop.find(s => s.shop_name === answer);
      setChatHistory(prev => [
        ...prev,
        { from: 'user', text: answer, questionId: 'shop' }
      ]);
      if (selectedShop) setSelectedShop(selectedShop);
      setTimeout(() => {
        setCurrentStep(0);
        setIsAnswering(false); // 👈 unlock
      }, 300);
      return;
    }

    const currentQ = questions[currentStep];

    // 👉 Agar "Other" select hua, to abhi chat me kuch mat dalo
    if (currentQ?.type === 'options' && answer === 'Other') {
      setIsOther(true);
      setIsAnswering(false); // 👈 Other ke case me turant unlock

      return;
    }

    // 👉 Agar user ne Other ka custom answer diya
    if (isOther) {
      setIsOther(false);

      setChatHistory(prev => [
        ...prev,
        { from: 'user', text: answer, questionId: currentQ?.id } // 👈 Directly user ka input save
      ]);

      setInputValue('');
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnswering(false); // 👈 unlock
      }, 300);
      return;
    }

    // Normal flow (Other ke alawa)
    setChatHistory(prev => [
      ...prev,
      { from: 'user', text: answer, questionId: currentQ?.id }
    ]);

    setInputValue('');

    // Step 6 special logic
    if (currentQ?.id === 6) {
      if (answer === 'Yes') {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setIsAnswering(false);
        }, 300);
        return;
      } else {
        setTimeout(() => {
          setCurrentStep(prev => prev + 2);
          setIsAnswering(false);
        }, 300);
        return;
      }
    }

    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsAnswering(false); // 👈 unlock
    }, 300);
  };


  const pickMedia = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed', // allows both photo and video
        selectionLimit: 1
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.log('Error:', response.errorMessage);
          return;
        }
        const asset = response.assets?.[0];
        if (asset) {
          setChatHistory(prev => [
            ...prev,
            { from: 'user', text: asset.fileName || 'Selected media', mediaUri: asset.uri, questionId: questions[currentStep]?.id }
          ]);
          setTimeout(() => setCurrentStep(prev => prev + 1), 300);
        }
      }
    );
  };

  const submitData = async () => {
    const formData = new FormData();

    // Add shop info
    if (selectedShop) {

      formData.append("shop_id", selectedShop.id.toString());

      // 👇 Add shop name + its question in qa
      const shopPair = JSON.stringify([selectedShop.shop_name, "Please select the shop:"]);
      formData.append("qa[0]", shopPair);
    }

    // Loop questions & answers
    questions.forEach((q, index) => {
      const answerMsg = chatHistory.find(
        (msg) => msg.from === "user" && msg.questionId === q.id
      );

      if (answerMsg) {
        if (answerMsg.mediaUri) {
          const qaPair = JSON.stringify([answerMsg.text, q.text]);
          formData.append(`qa[${q.id}]`, qaPair);

          formData.append("files[]", {
            uri: answerMsg.mediaUri,
            type: "image/jpeg", // or "video/mp4"
            name: answerMsg.text,
          } as any);
        } else {
          // 👇 send as JSON string [answer, question]
          const qaPair = JSON.stringify([answerMsg.text, q.text]);
          formData.append(`qa[${q.id}]`, qaPair);
        }
      }
    });

    const token = await AsyncStorage.getItem('token');
// console.log("formData",formData)
    if (token) {
      try {
        setIsLoading(true);
        const response = await api.chat_query_create(formData, token)
        setIsLoading(false);
        SuccessMessage({
          message: `Your Query has been submitted successfully`
        });
        
        // ⏳ Wait for 2 seconds before calling onFinish
        setTimeout(() => {
          onFinish();
         
        }, 2000);
      } catch (error: any) {
        setIsLoading(false);
       handleApiError(error,"query time error")
      }

      // console.log(formData)
    }

  };


  return (
    <SafeAreaView style={{ flex: 1 }} >
      <CustomHeader title="Texa Chatbot" imgSource={require('../../assets/img/profile_img.png')} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingBottom: 20 }} ref={scrollRef}>
              {chatHistory.map((msg, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubble,
                    msg.from === 'bot' ? styles.botBubble : styles.userBubble
                  ]}
                >
                  <Text style={{ color: msg.from === 'bot' ? '#000' : '#fff' }}>{msg.text}</Text>

                  {msg.type === 'options' && msg.from === 'bot' && (
                    <View style={{ marginTop: 5 }}>
                      {msg.options?.map((opt, i) => {
                        const isCurrent =
                          currentStep === -1 || questions[currentStep]?.text === msg.text;
                        return (
                          <TouchableOpacity
                            key={i}
                            style={styles.optionBtn}
                            onPress={isCurrent ? () => handleAnswer(opt) : undefined}
                            disabled={!isCurrent}
                          >
                            <Text style={styles.optionText}>{opt}</Text>

                          </TouchableOpacity>
                        );
                      })}

                    </View>
                  )}

                  {msg.type === 'file' && msg.from === 'bot' && (
                    <TouchableOpacity style={styles.optionBtn} onPress={pickMedia}>
                      <Text>📎 Attach picture or video</Text>
                    </TouchableOpacity>
                  )}

                  {msg.mediaUri && (
                    <Image source={{ uri: msg.mediaUri }} style={{ width: 200, height: 200, marginTop: 5 }} resizeMode="contain" />
                  )}
                </View>
              ))}
            </ScrollView>

            {((currentStep < questions.length && questions[currentStep]?.type === 'text') || isOther) && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={isOther ? 'Type your other answer...' : questions[currentStep]?.placeholder || 'Type your answer...'}
                  value={inputValue}
                  placeholderTextColor={"#787a7c"}
                  onChangeText={setInputValue}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={() => handleAnswer(inputValue)}>
                  <Text style={{ color: '#fff' }}>Send</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Loader loading={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatContainer: { flex: 1, padding: 10 },
  messageBubble: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '80%' },
  botBubble: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start' },
  userBubble: { backgroundColor: '#4CAF50', alignSelf: 'flex-end' },
  optionBtn: { padding: 8, backgroundColor: '#fff', borderRadius: 5, marginTop: 5, borderWidth: 1, borderColor: '#ccc' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  optionText: {
    color: '#000', // 👈 blue color (apne hisab se change kar sakte ho)
    fontWeight: '500'
  },

  input: {
    flex: 1,
    borderWidth: 1,
    color: "#000",
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8, // iOS ke liye thoda zyada
    fontSize: 16,
  },

  sendBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 15, justifyContent: 'center', marginLeft: 5, borderRadius: 20 }
});
