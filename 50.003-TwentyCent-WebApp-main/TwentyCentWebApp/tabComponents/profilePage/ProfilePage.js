import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
import styles from '../../style/styles';
import queryUtils from '../../backendUtils/queryUtils';
import TabComponent from '../TabComponent';

export default class ProfilePage extends TabComponent {

    constructor(props) {
        super(props);

        //institutionInfo stores the returned json string of 3 fields from db
        this.state = {"institutionInfo":null};
        queryUtils.getInstitutionInfo(this.loggedInUser,(val)=>{
            if (Number.isInteger(val)) {
                if (val===1) {
                    this.setState({"institutionInfo":-1});
                    return;
                }
                this.logout(false);
                return;
            }
            this.setState({"institutionInfo":val});
            return;
        });
    }

    componentDidMount() {
    }

    getBasicInfo() {
        const componentHeaders = ["Name","User ID","User Type","Email address"];
        const componentData = [
            this.loggedInUser.getName(),
            this.loggedInUser.getId()+"",
            this.loggedInUser.getType()===0? "Admin": this.loggedInUser.getType()===1? "Staff": "Tenant",
            this.loggedInUser.getEmailAddress()
        ];
        var basicDetails = [];
        for (var i=0;i<componentHeaders.length;i++) {
            basicDetails.push(<Text style={styles.headerText}>{componentHeaders[i]}</Text>);
            basicDetails.push(<Text style={styles.normalText}>{componentData[i]}</Text>);
        }
        basicDetails.push(<Text style={styles.normalText}>{'\n' }</Text>);
        return basicDetails;
    }

    //LOCALLY defined method, rendering purpose, not to be confused with wrapper fn of the same name in queryUtils.js
    getInstitutionInfo() {
        if (this.state.institutionInfo===null) return [<Text style={styles.headerText}>Institution info loading...</Text>,<Text style={styles.normalText}>{'\n' }</Text>];
        if (this.state.institutionInfo===-1) return [<Text style={styles.headerText}>Error loading institution info</Text>,<Text style={styles.normalText}>{'\n' }</Text>];
        
        return [
            <Text style={styles.headerText}>Institution Name</Text>,
            <Text style={styles.normalText}>{this.state.institutionInfo["name"]}</Text>,
            <Text style={styles.headerText}>Institution Address</Text>,
            <Text style={styles.normalText}>{this.state.institutionInfo["address"]}</Text>,
            <Text style={styles.normalText}>{'\n' }</Text>
        ]
    }

    render() {
        return (
            <View style={styles.container}>
                {this.getBasicInfo()}
                {this.getInstitutionInfo()}
                <Button
                    title="Logout"
                    onPress={() => {
                        this.logout(true);
                    }}
                />
            </View>
        );
    }

}