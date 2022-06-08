import React from 'react';
import { db } from "./Login.js"
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

class tenantFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tenantsFeedList: [] }
  }

  componentDidMount() {
    db.ref('Audit Report').child('Non F&B').on("value", snapshot => {
      let tenantsFeedList = [];
      snapshot.forEach(snap => {
        tenantsFeedList.push(snap.val());
      });
      this.setState({
        tenantsFeedList: tenantsFeedList
      });
    });
  }

  render() {
    return (
      <View>
        <View>
          {
            this.state.tenantsFeedList.map(data => {
              return (
                <View>
                  <Text> Hello </Text>

                  <Text> {data.auditComments} </Text>
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
  containerView: {
    margin: 5
  }
})

export default tenantFeed;