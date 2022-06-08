import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Collapse} from 'react-collapse';
import _ from "lodash"
import TabComponent from '../TabComponent';
import styles from '../../style/styles';

import queryUtils from '../../backendUtils/queryUtils';
import Utils from '../../utils/utils';

class Dashboard extends TabComponent {

  constructor(props) {
    super(props,true);
    this.state = {"displayed": [false,false,false], "notifications": null, "issues": null, "outlets": false};
    this.update();
  }

  update() {
    queryUtils.getDashboardInfo(this.loggedInUser,(val)=>{
      if (val==-1) {
        this.logout(false);
        return;
      }
      if (val==1) {
        this.setState({"notifications": false, "issues": false, "outlets": false});
        return;
      }

      var issueItemsList = "issues" in val? this.compileIssueItemsList(val) : null;
      var outletItemsList = "outlets" in val? this.compileOutletsItemsList(val) : null;

      this.setState({"notifications": this.compileNotificationItemsList(val), "issues": issueItemsList, "outlets": outletItemsList});

    });
    super.update();
  }

  getComparatorByProperty(property) {
    const prop = property;
    return (a,b)=>{
      if (a[prop]<b[prop]) return -1;
      else if (a[prop]===b[prop]) return 0;
      return 1;

    }
  }

  compileNotificationItemsList(val) {
    var notificationItemsList = [];
    for (var i=0;i<val.notifications.length;i++) {
      notificationItemsList.push({
        "id": val.notifications[i]["notificationId"],
        "text": `${Utils.secondsToTimestamp(val.notifications[i]["time"])}: ${val.notifications[i]["senderName"]}: ${val.notifications[i]["message"]}`
      });
    }
    notificationItemsList.sort(this.getComparatorByProperty("id"));
    return notificationItemsList;
  }

  compileIssueItemsList(val) {
    var issueItemsList = [];
    for (var i=0;i<val.issues.length;i++) {
      val.issues[i]["deadlineInt"] = Date.parse(val.issues[i]["deadline"]);
      issueItemsList.push(val.issues[i]);
    }
    issueItemsList.sort(this.getComparatorByProperty("deadlineInt"));
    return issueItemsList;
  }

  compileOutletsItemsList(val) {
    var outletItemsList = [];
    for (var i=0;i<val.outlets.length;i++) outletItemsList.push(val.outlets[i]);
    outletItemsList.sort(this.getComparatorByProperty("outletId"));
    return outletItemsList; 
  }

  /**
   * 0: notifications, 1: issues, 2: outlets
   * @param {Number} choice choice of section to render
   */
  renderSection(choice) {
    if ((!Number.isInteger(choice))||choice<0||choice>2) throw "Dashboard: renderSection(): invalid input";

    const headers = ["Notifications", "Pending Issues", "Outlets"];

    var updatedDisplayedArray = this.state.displayed.slice(0,3);
    updatedDisplayedArray[choice] = !updatedDisplayedArray[choice];
    const updatedDisplayedArrayFinal = updatedDisplayedArray;
    /*var additionalActions = ()=>{};
    if (choice===0) {
        additionalActions = (isDisplaying)=>{
        if (!isDisplaying&&this.state.notifications.length!=0) {
          var notificationIdList = [];
          for (var i=0;i<this.state.notifications.length;i++) notificationIdList.push(this.state.notifications[i]["id"]);
          queryUtils.markNotifications(
            this.loggedInUser,
            (val)=>{
              if (val===-1) {
                this.logout(false);
              }
              this.dataUpdate();
              return;
            },
            notificationIdList
          );
        }
      };
    }*/

    return (
      <View style={styles.dashboardContainer}>
        <TouchableOpacity
          style={styles.dashboardColumnHeader}
          onPress={()=>{this.setState({"displayed":updatedDisplayedArrayFinal});}}
        >
          <Text style={styles.headerTextWhite}>{headers[choice]}</Text>
        </TouchableOpacity>
        <Collapse isOpened={this.state.displayed[choice]}>
          {this.renderDataTable(choice)}
        </Collapse>
      </View>
    )
  }

  renderDataTable(choice) {
    if ((!Number.isInteger(choice))||choice<0||choice>2) throw "Dashboard: renderDataTable(): invalid input";
    switch(choice) {
      case 0:
        return this.renderNotifTable();
      case 1:
        return this.renderIssueTable();
      case 2:
        return this.renderOutletTable();
    }
  }

  renderNotifTable() {
    if (this.state.notifications===null) return (
      <Text style={styles.normalText}>Loading...</Text>
    );
    if (this.state.notifications===false) return (
      <Text style={styles.normalText}>Error loading data</Text>
    );
    if (this.state.notifications.length===0) return (
      <Text style={styles.normalText}>No notifications</Text>
    );
    return (
      <FlatList
        data={this.state.notifications}
        renderItem={this.renderNotifItem}
        keyExtractor={item=>item.id}
      />
    );
    
  }
  
  renderNotifItem({item}) {
    return (
      <View>
        <Text style={styles.normalText}>{item.text}</Text>
      </View>
    );
  }

  renderIssueTable() {
    if (this.state.issues===null) return (
      <Text style={styles.normalText}>Loading...</Text>
    );
    if (this.state.issues===false) return (
      <Text style={styles.normalText}>Error loading data</Text>
    );
    if (this.state.issues.length===0) return (
      <Text style={styles.normalText}>No unresolved audit issues</Text>
    );
    return (
      <FlatList
        data={this.state.issues}
        renderItem={this.renderIssueItem}
        keyExtractor={item=>item.issueId}
      />
    );
  }

  renderIssueItem({item}) {
    
    var componentList = [];
    if ("tenantName" in item) componentList.push(<Text style={styles.normalText}>{`Audit #${item.auditId}: ${item.tenantName} (Outlet #${item.outletId} @ ${item.outletAddress})`}</Text>);
    else componentList.push(<Text style={styles.normalText}>{`Audit #${item.auditId}: Outlet #${item.outletId} @ ${item.outletAddress}`}</Text>);
    componentList.push(<Text style={styles.subnormalText}>{`Description: ${item.description}`}</Text>);
    componentList.push(<Text style={styles.subnormalText}>{`Deadline: ${item.deadline}`}</Text>);
    return (
      <View>
        {componentList}
      </View>
    );
  }

  renderOutletTable() {
    if (this.state.outlets===null) return (
      <Text style={styles.normalText}>Loading...</Text>
    );
    if (this.state.outlets===false) return (
      <Text style={styles.normalText}>Error loading data</Text>
    );
    if (this.state.outlets.length===0) return (
      <Text style={styles.normalText}>No outlets are available in your institution</Text>
    );
    return (
      <FlatList
        data={this.state.outlets}
        renderItem={this.renderOutletItem}
        keyExtractor={item=>item.outletId}
      />
    );
    
  }

  renderOutletItem({item}) {
    
    var componentList = [];
    componentList.push(<Text style={styles.normalText}>{`Outlet #${item.outletId} @ ${item.outletAddress}`}</Text>);
    componentList.push(<Text style={styles.subnormalText}>{`Current tenant: ${item.tenantId===null?"None":item.tenantName}`}</Text>);
    if (item.tenantId!==null) componentList.push(<Text style={styles.subnormalText}>{`Contract period: ${item.validity_start} to ${item.validity_end}`}</Text>);
    return (
      <View>
        {componentList}
      </View>
    );
  }

  render() {

    var componentList = [];
    componentList.push(this.renderSection(0));
    if (this.loggedInUser.getType()!==0) componentList.push(this.renderSection(1));
    if (this.loggedInUser.getType()===1) componentList.push(this.renderSection(2));
    return (

      <View>
        {componentList}
      </View>
    );
  }

  componentWillUnmount() {
    this.disableUpdates();
  }
}

export default Dashboard