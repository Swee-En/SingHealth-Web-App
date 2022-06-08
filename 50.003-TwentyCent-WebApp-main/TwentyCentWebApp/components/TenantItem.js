import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TenantItem = props => {
    return (
        <TouchableOpacity activeOpacity={0,0} onPress={props.onDelete.bind(this, props.id)} >
            <View style={styles.listItem}>
                <Text>{props.title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    listItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#ccc',
        borderColor: 'black',
        borderWidth: 1
    }
})

export default TenantItem;