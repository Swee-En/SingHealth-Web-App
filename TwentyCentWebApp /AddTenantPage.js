import React, { useState } from 'react';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import firebase from 'firebase/app';
import "firebase/auth";

//for db 
import "firebase/storage";
import "firebase/database";
import {db} from "./Login.js"

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

class AddTenantPage extends React.Component {
  constructor() {
    super();
    this.state = {
      tenant: "",
      outlet: "",
      storeLocation: "",
      dateOfEntry: "",
      dateOfDeparture: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

  handleChange(date) {
    this.setState({
      dateOfEntry: date
    })
  }

  handleChange2(date2) {
    this.setState({
      dateOfDeparture: date2
    })
  }

  addButtonHandle() {
    {
      if (this.state.tenant != "" &&
        this.state.outlet != "" &&
        this.state.storeLocation != "" &&
        this.state.dateOfEntry != "" &&
        this.state.dateOfDeparture != "") {
        db.ref('Tenant').child(this.state.tenant).set({
          tenant: this.state.tenant,
          outlet: this.state.outlet,
          storeLocation: this.state.storeLocation,
          dateOfEntry: this.state.dateOfEntry.toLocaleString(),
          dateOfDeparture: this.state.dateOfDeparture.toLocaleString()
        });
      }
      else {
        alert("Please give an input for all fields.")
      }
    }
  }

  render() {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Add New Tenant</Text>

 <View style={styles.datePickerView}>

{/*
please do not modify the spacing for this text
it is for alignment purposes
*/}

<Text style={styles.enterDateText}>Enter date of entry        </Text>

<DatePicker
  selected={this.state.dateOfEntry}
  onChange={this.handleChange}
  style={styles.datePickerStyle}
  name="dateOfEntry"
  minDate={new Date()}
  dateFormat="dd/MM/yyyy"
/>

</View >

<View style={styles.datePickerView}>

<Text style={styles.enterDateText}>Enter date of departure</Text>

<DatePicker
  style={styles.datePickerStyle}
  selected={this.state.dateOfDeparture}
  onChange={this.handleChange2}
  name="dateOfDeparture"
  minDate={this.state.dateOfEntry}
  dateFormat="dd/MM/yyyy"
/>

</View>

        <TextInput
          placeholder="Tenant"
          onChangeText={(text) => {
            this.setState({
              tenant: text
            })
          }}
          style={styles.input}
          value={this.state.tenant}
        />

        <TextInput
          placeholder="Outlet"
          onChangeText={(text) => {
            this.setState({
              outlet: text
            })
          }}
          style={styles.input}
          value={this.state.outlet}
        />

        <TextInput
          placeholder="Store Location"
          onChangeText={(text) => {
            this.setState({
              storeLocation: text
            })
          }}
          style={styles.input}
          value={this.state.storeLocation}
        />

       

        <View style={styles.buttonView}>

          <View style={styles.buttonIndividualView}>
            <Button
              title="Add" onPress={() => {
                this.addButtonHandle()
              }} />
          </View>

          <View style = {styles.buttonIndividualView}>
            <Button
              title="Return" onPress = {() => {alert('Please code for navi.') }}
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
    backgroundColor: 'floralwhite'
  },

  errorMessageStyle: {
    paddingLeft: 20,
    fontsize: 10,
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
    margin: 20,
    height: 50,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'midnightblue',
    backgroundColor: 'orange'
  },

  input: {
    paddingLeft: 10,
    width: '95%',
    height: 30,
    borderWidth: 2,
    borderColor: 'skyblue',
    margin: 20
  },

  datePickerStyle: {
    width: '100%',
    borderWidth: 50,
    borderColor: 'skyblue',
    height: 10,
    margin: 20
  },

  datePickerView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    wdith: '100%'
  },

  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonIndividualView: {
    marginHorizontal: 100,
    marginVertical: 20,
    width: 100
  }
})
export default AddTenantPage;
