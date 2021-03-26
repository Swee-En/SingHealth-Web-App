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
  Button
} from 'react-native';


class ViewTenantsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tenantsList: [] }
  }

  componentDidMount() {
    db.ref('Tenant').on("value", snapshot => {
      let tenantsList = [];
      snapshot.forEach(snap => {
        tenantsList.push(snap.val());
      });
      this.setState({
        tenantsList: tenantsList
      });
    });
  }


  render() {
    return (
      <View style={styles.overallView}>

        <View style={styles.tenantsListView2}>

          <View style={styles.buttonView}>
            <Button title="Return"
              onPress={() => { alert('Code for Return navi') }}
            />
          </View>

          <Text style={styles.tenantsListView}>Tenants List</Text>

          <View style={styles.buttonView}>
            <Button title="Add New Tenant"
              onPress={() => { alert('Code for Add Tenant navi') }}
            />
          </View>

        </View>

        <View style={styles.headerView}>

          <View style={styles.textView}>
            <Text style={styles.textView3}>Tenant</Text>
          </View>

          <View style={styles.textView}>
            <Text style={styles.textView3}>Outlet</Text>
          </View>

          <View style={styles.textView}>
            <Text style={styles.textView3}>Store Location</Text>
          </View>

          <View style={styles.textView}>
            <Text style={styles.textView3}>Date of Entry</Text>
          </View>

          <View style={styles.textView}>
            <Text style={styles.textView3}>Date of Departure</Text>
          </View>

        </View>

        <View>
          {
            this.state.tenantsList.map(data => {
              return (
                <View style={styles.headerView}>

                  <View style={styles.textView}>
                    <Text style={styles.textView2}>{data.tenant}</Text>
                  </View>

                  <View style={styles.textView}>
                    <Text style={styles.textView2}>{data.outlet}</Text>
                  </View>

                  <View style={styles.textView}>
                    <Text style={styles.textView2}>{data.storeLocation}</Text>
                  </View>

                  <View style={styles.textView}>
                    <Text style={styles.textView2}>{data.dateOfEntry}</Text>
                  </View>

                  <View style={styles.textView}>
                    <Text style={styles.textView2}>{data.dateOfDeparture}</Text>
                  </View>

                </View>

              )
            })
          }
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({

  tenantsListView: {
    flexDirection: 'row',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 50
  },

  tenantsListView2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'lightsalmon',
  },

  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'skyblue',
    height: 80,
    margin: 20
  },

  textView2: {
    padding: 15
  },

  textView3: {
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'center',
    color: 'olivedrab',
    fontWeight: 'bold'
  },

  overallView: {
    margin: 5,
    backgroundColor: 'lightcyan'
  },

  textView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '15%',
    height: 80,
    backgroundColor: 'lavenderblush',
    justifyContent: 'center'
  },

  buttonView: {
    width: 100
  }
})
export default ViewTenantsList