import { Alert } from "react-native";

export const handleApiError = (error: any, context: string = "") => {
  console.log(`\n==== ❌ API Error ${context ? `(${context})` : ""} ====`);
  
  let userMessage = "Something went wrong. Please try again.";

  if (error.response) {
    // Server ne response diya lekin 200 nahi
    console.log("🔴 Backend Error Response:", error.response.data);
    console.log("🔴 Backend Status Code:", error.response.status);
    console.log("🔴 Backend Headers:", error.response.headers);

    // Agar backend custom message bhejta hai
    userMessage = error.response.data?.message || `Server Error (${error.response.status})`;
  } else if (error.request) {
    // Request gaya lekin response nahi mila (Network error / server down)
    console.log("🟠 No Response received from server:", error.request);
    userMessage = "Network Error: Unable to reach the server. Please check your internet.";
  } else {
    // Axios config ya frontend issue
    console.log("⚠️ Axios Config/Other Error:", error.message);
    userMessage = error.message || "Unexpected error occurred.";
  }

  console.log("⚡ Full Error Object:", error);
  console.log("=================================\n");

  // User ko warning alert dikhao
  Alert.alert(context || "Error", userMessage);
};
