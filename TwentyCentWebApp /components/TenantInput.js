import React, { useState } from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';

const TenantInput = props => {
    const [enteredTenant, setEnteredTenant] = useState('');

    const tenantInputHandler = (enteredText) => {
        setEnteredTenant(enteredText);
      };

    return (
        <View style={styles.inputContainer}>
            <TextInput
                placeholder="Add Tenants"
                style={styles.input}
                onChangeText={tenantInputHandler}
                value={enteredTenant}
            />
            <Button title="ADD" onPress={props.onAddTenant.bind(this, enteredTenant)} />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
    
      input: {
        width: 200,
        borderBottomColor: 'black',
        borderBottomWidth: 1
      }
});

export default TenantInput;