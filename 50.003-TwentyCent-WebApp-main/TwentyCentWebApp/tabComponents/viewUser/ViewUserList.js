import React, { useState } from 'react';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import queryUtils from "../../backendUtils/queryUserUtil";  // to be updated when merged

import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { size } from 'lodash';

class ViewUserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userList: [] }
  }

  componentDidMount() {
    // console.log("fetching from db..")
    queryUtils.getUserList(this.props.userObject, (val) => {
      if (val === 0) {
        console.log("Error");
      }
      else if (val === 1) {
        console.log("Error");
      }
      else {
        // console.log(val);
        let userList = Array.from(val);
        this.setState({
          userList: userList
        }, () => {
          // console.log(this.state.userList);
        });
      }
    });
  }

  renderDataMap() {
    // console.log("renderDataMap() called");
    // console.log(this.state.userList);
    // console.log(typeof this.state.userList);
    // console.log(Object.prototype.toString.call(this.state.userList) == '[object Array]')

    if (this.state.userList != "") {
      // console.log("userList not blank");
      return (
        <View>
          {
            this.state.userList.map(function(data, i){
              return (
                <View style={styles.bodyView}>

                  <View style={styles.bodyTextView}>
                    <Text key={i} style={styles.bodyText}>{data.name}</Text>
                  </View>

                  <View style={styles.bodyTextView}>
                    <Text key={i} style={styles.bodyText}>{data.type ===0? "Admin": this.props.userObject.getType()===1? "Staff": "Tenant"} </Text>
                  </View>

                  <View style={styles.bodyTextView}>
                    <Text key={i} style={styles.bodyText}>{data.email}</Text>
                  </View>

                  <View style={styles.bodyTextView}>
                    <Text key={i} style={styles.bodyText}>{data.institutioinId}</Text>
                  </View>

                  <View style={styles.bodyTextView}>
                    <Text key={i} style={styles.bodyText}>{data.institutionName}</Text>
                  </View>

                  <View style={styles.bodyTextView}>
                    <Text key={i} style={styles.bodyText}>{data.username}</Text>
                  </View>

                </View>

              );
            })
          }

        </View>
      );
    } else {
      // unlikely bc it will at least show themselves but jic throws error and crashes page
      // console.log("userList blank..");
      return (
        <View>
          <Text>No other users or none that you have access to.</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.overallView}>

        <View style={styles.tenantsListView2}>

          <View style={styles.buttonView}>
            <Button
              title="Return"
              color="#f6ab59"
              onPress={() => { this.props.navigation.navigate('Dashboard', { "userObject": this.props.userObject }) }}
            />
          </View>

          <Text style={styles.tenantsListView}>User List</Text>

          <View style={styles.buttonView}>
            <Button
              title="Add New User"
              color="#f6ab59"
              onPress={() => { this.props.navigation.navigate("AddUserPage", { "userObject": this.props.userObject, "ViewUserList": this }); }}
            />
          </View>

        </View>

        <View style={styles.headerView}>

          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>Name</Text>
          </View>

          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>Type</Text>
          </View>

          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>Email</Text>
          </View>

          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>Institution ID</Text>
          </View>

          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>Institution Name</Text>
          </View>

          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>Username</Text>
          </View>

        </View>

        {this.renderDataMap()}

      </View>
    )
  }
}

const styles = StyleSheet.create({

  overallView: {
    margin: 5,
    backgroundColor: '#fff'
  },

  tenantsListView: {
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: 50,
    color: "white"
  },

  tenantsListView2: {
    flexDirection: 'row',
    justifyContent: "space-evenly",
    alignItems: 'center',
    backgroundColor: '#EF820D',
  },

  headerView: {
    flexDirection: 'row',
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 80,
    margin: 20,
    backgroundColor: '#EF820D',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },

  bodyView: {
    flexDirection: 'row',
    justifyContent: "space-evenly",
    alignItems: 'center',
    height: 80,
    margin: 10,
    backgroundColor: "#fff8e7",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },

  bodyText: {
    padding: 15
  },

  headerText: {
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold'
  },

  headerTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '15%',
    height: 80,
    justifyContent: 'center'
  },

  bodyTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '15%',
    height: 80,
    justifyContent: 'center'
  },

  buttonView: {
    width: 100
  }
})
export default ViewUserList