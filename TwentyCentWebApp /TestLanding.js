import React, {useState} from 'react';
import { StyleSheet, Text, Image, View, TextInput, Button } from 'react-native';

import firebase from "firebase/app";
import "firebase/auth";

import styles from './styles';

const TestLanding = (props) => {
    console.log(props);
    const [indicator,setIndicator] = useState();
    return (
        <View>
            <Text style={styles.normalText}>
                Welcome, {props.userCredential.user.email}.{"\n"}
                UID: {props.userCredential.user.uid}  
            </Text>
            <Button
                title="Logout"
                onPress = {()=>{
                    firebase.auth().signOut()
                    .then(()=>{
                        props.navigation.navigate("Login Page");
                    })  
                    .catch((error) => {
                        setIndicator(
                            <Text style={styles.normalText}>Error: {error.code}</Text>
                        )
                    })
                }}
            />
            {indicator}
        </View>
    )
}
export default TestLanding;