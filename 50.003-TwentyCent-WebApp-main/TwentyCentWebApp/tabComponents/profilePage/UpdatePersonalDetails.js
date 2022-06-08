import React from 'react';
import { Text, View } from 'react-native';
import styles from '../../style/styles';
import securityUtils from '../../backendUtils/securityUtils';

export default class UpdatePersonalDetails extends React.Component {

    constructor(props) {
        super(props);
        this.emailTextInput = null;
        this.state = {
            "emailAddress": "",
            "emailFieldIndicator": <Text style={styles.normalText}></Text>,
            "password": "",
            "passwordFieldIndicator": <Text style={styles.normalText}></Text>
        }
    }

    componentDidMount() {
    }

    updateEmailAddressField(text) {
        this.setState({"emailAddress":text});
    }

    updateEmailAddressIndicator(val) {
        var text = null;
        if (val===0) {
            text = "Successfully updated email address";
        }
        else if (val===3) {
            text = "Invalid email address";
        }
        else if (val===4) {
            text = "Failed: network error"
        }
        else {
            text = "";
        }
    this.setState({"emailAddressFieldIndicator":<Text style={styles.normalText}>{text}</Text>});
    }

    updatePasswordField(text) {
        this.setState({"password":text});
    }

    getEmailForm() {
        return [
            <Text style={styles.headerText}>Update email address</Text>,
            <Text style={styles.normalText}>Enter new email address</Text>,
            <TextInput
                ref={textInput => this.emailTextInput = textInput}
                style={styles.basicTextInput}
                placeholder="Enter email address"
                onChangeText={(text) => { this.updateEmailAddressField(text); }}
            />,
            <Button
            onPress={() => {
                if (!securityUtils.checkSanitizedEmail(this.state.emailAddress)) {
                    this.updateEmailAddressIndicator(3);
                }
                this.props.userObject.setEmailAddress(null,this.state.emailAddress,(val)=>{
                    this.updateEmailAddressIndicator(val);
                    if (val===-1) {
                        this.emailTextInput.clear();
                        this.updateEmailAddressField("");
                        this.props.logoutIndicator.indicateBadLogout();
                        this.props.loginNavigation.navigate("Login Page");
                        return;
                    }

                    if (val===0) {
                        this.emailTextInput.clear();
                        this.updateEmailAddressField("");
                        this.props.profilePage.setState({});
                    }
                    return;
                    
                });
            }}
            title="Update email"
          />
        ]
    }

    getPasswordForm() {
        return [
            <Text style={styles.headerText}>Update password</Text>,
            <Text style={styles.normalText}>Enter old password</Text>, // TODO
            <TextInput
                ref={textInput => this.emailTextInput = textInput}
                style={styles.basicTextInput}
                placeholder="Enter email address"
                onChangeText={(text) => { this.updateEmailAddressField(text); }}
            />,
            <Button
            onPress={() => {
                if (!securityUtils.checkSanitizedEmail(this.state.emailAddress)) {
                    this.updateEmailAddressIndicator(3);
                }
                this.props.userObject.setEmailAddress(null,this.state.emailAddress,(val)=>{
                    this.updateEmailAddressIndicator(val);
                    if (val===-1) {
                        this.emailTextInput.clear();
                        this.updateEmailAddressField("");
                        this.props.logoutIndicator.indicateBadLogout();
                        this.props.loginNavigation.navigate("Login Page");
                        return;
                    }

                    if (val===0) {
                        this.emailTextInput.clear();
                        this.updateEmailAddressField("");
                        this.props.profilePage.setState({});
                    }
                    return;
                    
                });
            }}
            title="Update email"
          />
        ]
    }

    getInstitutionInfo() {
        if (this.state.institutionInfo===null) return [<Text style={styles.headerText}>Institution info loading...</Text>];
        if (this.state.institutionInfo===-1) return [<Text style={styles.headerText}>Error loading institution info</Text>];
        
        return [
            <Text style={styles.headerText}>Institution Name</Text>,
            <Text style={styles.normalText}>{this.state.institutionInfo["name"]}</Text>,
            <Text style={styles.headerText}>Institution Address</Text>,
            <Text style={styles.normalText}>{this.state.institutionInfo["address"]}</Text> 
        ]
    }

    render() {
        return (
            <View style={styles.container}>
                {this.getBasicInfo()}
                <Text style={styles.normalText}>{'\n' }</Text>
                {this.getInstitutionInfo()}
            </View>
        );
    }

}