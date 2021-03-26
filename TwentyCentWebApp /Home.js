//custom modules, each is a screen. firebase config in Login
import TestLanding from './TestLanding';
import AddTenant from './AddTenantPage'
import Dashboard from './Dashboard';
import ViewTenantsList from './TenantsListBackup'
import React from 'react';

//tab navigator modules, peer dependencies and instance
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

function Home({navigation,route}) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Tenants" component={AddTenant} />
      <Tab.Screen name="Test Landing Page"
        children={()=>{return (<TestLanding navigation={navigation} userCredential={route.params.userCredential}/>)}}
      />
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Tenants List" component={ViewTenantsList}/> 
    </Tab.Navigator>
  );
}

export default Home;