import React, {useState} from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image, View, TextInput, Button } from 'react-native';

import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//custom modules, each is a screen. firebase config in Login
import Login from './Login';
import Home from './Home'

const Stack = createStackNavigator();

//goal today: take out tabs code Home() function and put into separate file. 

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login Page"
          component={Login}
          options={{title: "Login"}}
        />  
        <Stack.Screen
          name="Home"
          component={Home}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;