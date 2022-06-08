import React from 'react';

import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

/**
 * Tab Component, implementing these basic functionalities:
 * - initialization of current user's object as this.loggedInUser
 * - initialization of dict of all TabComponents currently deployed as this.tabComponentRefs
 * - automatic refresh system that makes use of this.update(): essentially component's state is re-set
 *   to force re-rendering of data every 1 min. this.update() should be defined if updates are to be used
 * - functions this.enableUpdates() and this.disableUpdates() to enable/disable refreshes
 * - function this.logout() to facilitate logout - pass boolean to indicate whether the logout is a clean one
 * - if enableUpdate = true is passed as part of props, updates are enabled at initialization
 */
export default class TabComponent extends React.Component {
    
    constructor(props,enableUpdates) {
        super(props);
        this.loggedInUser = this.props.loggedInUser;
        this.interval = enableUpdates? setInterval(()=>{this.update();},60000) : null;
        this.logout = this.props.logout;
    }

    enableUpdates() {
        if (this.interval!==null) return;
        this.interval = setInterval(()=>{this.update();},60000);
    }

    disableUpdates() {
        if (this.interval===null) return;
        clearInterval(this.interval);
        this.interval = null;
    }

    update() {
        this.setState({});
    }

}