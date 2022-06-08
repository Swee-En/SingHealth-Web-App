import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css'
// import DropDownPicker from 'react-native-dropdown-picker';
import queryUtils from "../../backendUtils/queryUserUtil";  // to be updated when merged

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';

class AddUserPage extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      type: "",
      email: "",
      institutionId: "",
      username: "",
      password: "",
    }
  }

  // async changeAccType(value) {
  //   if (value == -1) {
  //     alert("Please select an account type.");
  //     this.setState({ type: "" });
  //   } else {
  //     // state does not set or lags behind 
  //     this.setState({ type: value }, () => {
  //       //callback
  //       console.log(this.state.type) 
  //     });
  //   }
  // }

  addButtonHandle() {
    {
      if (this.state.name != "" &&
        this.state.type != "" &&
        this.state.email != "" &&
        this.state.institutionId != "" &&
        this.state.username != "" &&
        this.state.password != "" 
      ) {
        queryUtils.addUser(this.props.userObject, 
                          this.state.name, 
                          parseInt(this.state.type), 
                          this.state.email, 
                          parseInt(this.state.institutionId), 
                          this.state.username, 
                          this.state.password, 
          (val) => {
          if (val === 0) {
            console.log("Error");
          }
          else if (val === 1) {
            console.log("Error");
          }
          else {
            console.log(val);
            // returns {"userId": queryInt[0]["id"]}
            alert("New User ID is: " + val.userId);

            // clear input fields, reset states
            this.passwordInput.clear();
            this.setState({
              name: "",
              type: "",
              email: "",
              institutionId: "",
              username: "",
              password: "",
            })
          }
        });
      }
      else {
        console.log(this.state.name != "");
        console.log(this.state.type != "");
        console.log(this.state.email != "");
        console.log(this.state.institutionId != "");
        console.log(this.state.username != "");
        console.log(this.state.password != "");
        alert("Please give an input for all fields correctly.")
      }
    }
  }

  render() {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Add New User</Text>

        <TextInput
          placeholder="Name"
          onChangeText={(text) => {
            this.setState({
              name: text
            })
          }}
          style={styles.input}
          value={this.state.name}
        />

        {/* <DropDownPicker
          items={[
            { label: '== PICK ACCOUNT TYPE ==', value: -1 },
            { label: 'Admin', value: 0 },
            { label: 'Staff', value: 1 },
            { label: 'Tenant', value: 2 }
          ]}
          defaultValue={-1}
          style={styles.dropDown}
          onChangeItem={item => this.changeAccType(item.value) }
        /> */}

        <TextInput
          placeholder="Account Type"
          onChangeText={(text) => {
            this.setState({
              type: text
            })
          }}
          style={styles.input}
          value={this.state.type}
        />
        <Text style={styles.normalText}>Enter 0-2 only. 0: Admin, 1: Staff, 2: Tenant</Text>

        <TextInput
          placeholder="Email"
          onChangeText={(text) => {
            this.setState({
              email: text
            })
          }}
          style={styles.input}
          value={this.state.email}
        />

        <TextInput
          placeholder="InstitutionId"
          onChangeText={(text) => {
            this.setState({
              institutionId: text
            })
          }}
          style={styles.input}
          value={this.state.institutionId}
        />

        <TextInput
          placeholder="Username"
          onChangeText={(text) => {
            this.setState({
              username: text
            })
          }}
          style={styles.input}
          value={this.state.username}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => {
            this.setState({
              password: text
            })
          }}
          style={styles.input}
          value={this.state.Password}
          ref={passwordInput => { this.passwordInput = passwordInput }}
        />


        <View style={styles.buttonView}>

          <View style={styles.buttonIndividualView}>
            <Button
              title="Return"
              color="#f6ab59"
              onPress={() => {var a = { "userObject": this.props.userObject, "AddUserPage": this };console.log(a.AddUserPage); this.props.navigation.navigate("ViewUserList", { "userObject": this.props.userObject, "AddUserPage": this }); }}
            />
          </View>

          <View style={styles.buttonIndividualView}>
            <Button
              title="Add"
              color="#EF820D"
              onPress={() => { this.addButtonHandle() }}
            />
          </View>

        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'column',
    margin: 20,
    justifyContent: 'space-around',
    backgroundColor: '#fff8e7',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },

  errorMessageStyle: {
    paddingLeft: 20,
    fontSize: 10,
    color: 'red'
  },

  enterDateText: {
    paddingLeft: 5,
    margin: 20,
    fontWeight: 'bold',
    color: 'midnightblue'
  },

  title: {
    paddingLeft: 10,
    height: 50,
    fontSize: 30,
    color: 'white',
    backgroundColor: '#EF820D',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },

  input: {
    paddingLeft: 10,
    width: '95%',
    height: 30,
    borderWidth: 2,
    borderColor: '#f6ab59',
    margin: 20
  },

  // dropDown: {
  //   paddingLeft: 10,
  //   width: '95%',
  //   height: 30,
  //   borderWidth: 2,
  //   borderColor: '#f6ab59',
  //   margin: 20
  // },

  normalText: {
    paddingLeft: 40,
    width: '95%',
    fontSize: 12
  },

  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonIndividualView: {
    marginHorizontal: 100,
    marginVertical: 20,
    width: 100
  }
})
export default AddUserPage;
