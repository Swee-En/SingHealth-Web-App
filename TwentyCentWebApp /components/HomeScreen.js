import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//TODO: integrate Sheriann's code into the return portion 
function DashboardScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Dashboard</Text>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Dashboard')}
      />
    </View>
  );
}

//TODO
function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Notifications')} />
    </View>
  );
}

const Tab = createBottomTabNavigator();

function Home()  {
    return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={DashboardScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default Home();