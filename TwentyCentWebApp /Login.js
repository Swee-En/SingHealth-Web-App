import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, Image, View, TextInput, Button } from 'react-native';
import firebase from "firebase/app";
import "firebase/auth";
import styles from './styles';

//for db 
import "firebase/storage";
import "firebase/database";

var firebaseConfig = {
  apiKey: "AIzaSyDrdBdePTKow8RfjS4GoDoDcjSN5x_WbC4",
  authDomain: "singhealth-prototype-1.firebaseapp.com",
  databaseURL: "https://singhealth-prototype-1-default-rtdb.firebaseio.com",
  projectId: "singhealth-prototype-1",
  storageBucket: "singhealth-prototype-1.appspot.com",
  messagingSenderId: "846135941919",
  appId: "1:846135941919:web:f13c704dac489bac4aae2a"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const db = app.database();


const Login = ({navigation}) => {
  const [loginEmailAddress,setLoginEmailAddress] = useState("");
  const [loginPassword,setLoginPassword] = useState("");
  const [indicator,setIndicator] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Login{"\n"} </Text>
      <Text style={styles.normalText}>Email address</Text>
      <TextInput
        style={{ height: 40, borderColor: 'black', borderWidth: 1 }}
        placeholder="Enter email address"
        onChangeText={(text)=>{setLoginEmailAddress(text);}}
      />
      <Text style={styles.normalText}>{"\n"}Password</Text>
      <TextInput
        style={{ height: 40, borderColor: 'black', borderWidth: 1}}
        secureTextEntry={true}
        placeholder="Enter password"
        onChangeText={(text)=>{setLoginPassword(text);}}
      />
      <Text> {"\n"} </Text>
      <Button
        onPress={() => {
          firebase.auth()
          .signInWithEmailAndPassword(loginEmailAddress,loginPassword)
          .then((userCredential)=>{
            navigation.navigate("Home",{userCredential:userCredential});
          })
          .catch((err)=>{
            setIndicator(
              <Text style={styles.normalText}>Error: {err.code}</Text>
            );
          });
        }}
        title="Login"
      />
      {indicator}
    </View>
  )
}
export default Login;

/*
export default function App() {
  return (
    <View style={styles.container}>
      <Image source={{uri:"https://gd.image-gmkt.com/li/056/394/1161394056.g_520-w-et_g.jpg"}} style={{width: 200, height: 200}} />
      <Text>Big Brother is watching.</Text>
      <StatusBar style="auto" />
    </View>
  );
}*/
