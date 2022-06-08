import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, Image, View, TextInput, Button } from 'react-native';
import firebase from "firebase/app";
import "firebase/auth";
import styles from '../style/styles';
import authUtils from "../backendUtils/authUtils";

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

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      "loginUsername": "",
      "loginPassword": "",
      "indicator": <Text style={styles.normalText}></Text>
    };
  }

  setLoginUsername(text) {
    this.setState({ "loginUsername": text });
  }

  setLoginPassword(text) {
    this.setState({ "loginPassword": text });
  }

  setIndicator(text) {
    this.setState({ "indicator": <Text style={styles.normalText}>{text}</Text> })
  }

  indicateBadLogout() {
    this.setIndicator("Error logging out")
  }

  indicateGoodLogout() {
    this.setIndicator("Logged out successfully");
  }


  render() {
    var usernameRef = null;
    var passwordRef = null;

    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Login{"\n"} </Text>
        <Text style={styles.normalText}>Username</Text>
        <TextInput
          nativeID="username"
          ref={textInput => usernameRef = textInput}
          style={styles.basicTextInput}
          placeholder="Enter username"
          onChangeText={(text) => { this.setLoginUsername(text); }}
        />
        <Text style={styles.normalText}>{"\n"}Password</Text>
        <TextInput
          nativeID="password"
          ref={textInput => passwordRef = textInput}
          style={styles.basicTextInput}
          secureTextEntry={true}
          placeholder="Enter password"
          onChangeText={(text) => { this.setLoginPassword(text); }}
        />
        <Text> {"\n"} </Text>
        <View nativeID="loginButton">
          <Button
            onPress={() => {
              authUtils.login(this.state.loginUsername, this.state.loginPassword, (val) => {
                if (val === 1) {
                  this.setIndicator("Error: Invalid credentials");
                }
                else if (val === 2) {
                  this.setIndicator("Error: Network error");
                }
                else {
                  usernameRef.clear();
                  passwordRef.clear();
                  this.setLoginUsername("");
                  this.setLoginPassword("");
                  this.setIndicator("");
                  this.props.navigation.navigate("Home", { "userObject": val, "loginPage": this });
                }
              });
            }}
            title="Login"
          />
        </View>

        {this.state.indicator}
      </View>
    )
  }
}