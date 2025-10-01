
import React from "react";
import { TextInput as RNTextInput, StyleSheet } from 'react-native';



const Textinput = ({ style = {}, ...props }) => {
    return <RNTextInput style={[styles.input,style]} {...props}/>;

}

const styles=StyleSheet.create({
    input:{
     height:45,
     width:'90%',
     borderColor:'gray',
     borderWidth:1,
     paddingHorizontal:10,
      alignSelf:'center',
      marginTop:16,
     borderRadius:15

    }
})
export default Textinput;