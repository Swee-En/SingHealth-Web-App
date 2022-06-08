//custom modules, each is a screen. firebase config in Login
import Dashboard from './dashboard/Dashboard';
import ProfilePage from './profilePage/ProfilePage';
import ViewUserList from './viewUser/ViewUserList';
import AddUser from './editUser/AddUserPage';
import React from 'react';

//tab navigator modules, peer dependencies and instance
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import nonFBChecklist from './checklist/nonFBChecklist';
import FBChecklist from './checklist/FBChecklist';
import covidChecklist from './checklist/covidChecklist';
const Tab = createBottomTabNavigator();

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.loggedInUser = this.props.route.params.userObject;
    this.loginPageRef = this.props.route.params.loginPage;
    this.navigation = this.props.navigation;

    this.logout = (val) => {
      if (val) this.loginPageRef.indicateGoodLogout();
      else this.loginPageRef.indicateBadLogout();
      this.navigation.navigate("Login Page");
    }
    this.logout = this.logout.bind(this);
  }


  conditionalTabLoad() {

    var tabList = [];
    switch (this.loggedInUser.getType()) {
      case 0:
        tabList.push(<Tab.Screen name="User List" children={() => { return (<ViewUserList navigation={this.navigation} userObject={this.loggedInUser} />) }} />);
        tabList.push(<Tab.Screen name="Add User" children={() => { return (<AddUser navigation={this.navigation} userObject={this.loggedInUser} />) }} />); 
        break;
      case 1:
        tabList.push(<Tab.Screen name="Tenants List" children={() => { return (<ViewUserList navigation={this.navigation} userObject={this.loggedInUser} />) }} />);
        tabList.push(<Tab.Screen name="Add Tenant" children={() => { return (<AddUser navigation={this.navigation} userObject={this.loggedInUser} />) }} />);
        break;
    }
    if (this.loggedInUser.getType() !== 2) {
      tabList.push(<Tab.Screen name="covidChecklist" component={covidChecklist} />);
      tabList.push(<Tab.Screen name="nonFBChecklist" component={nonFBChecklist} />);
      tabList.push(<Tab.Screen name="FBChecklist" component={FBChecklist} />);
    }
    return tabList;
  }

  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Dashboard"
          children={() => { return (<Dashboard navigation={this.navigation} loggedInUser={this.loggedInUser} logout={this.logout} />) }}
        />
        <Tab.Screen name="Profile Page"
          children={() => { return (<ProfilePage navigation={this.navigation} loggedInUser={this.loggedInUser} logout={this.logout} />) }}
        />
        {this.conditionalTabLoad()}
      </Tab.Navigator>
    );
  }
}