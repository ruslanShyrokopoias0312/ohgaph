import React from 'react'
import { View, Text, TextInput } from 'react-native'
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet()

/*
 * label, onChange, placeHolder, type
 */
export class FormInput extends React.Component {
    render() {
        return (
            <TextInput
                underlineColorAndroid={"transparent"}
                style={styles.textInput}
                keyboardType={this.getType()}
                onChangeText={this.props.onChange}
                placeholder={this.props.placeHolder}
                value={this.props.value}
            />
        )
    }

    getType() {
        switch(this.props.type) {
            case "default":
                return "default"
            case "numeric":
                return "numeric"
            default:
                return "default"
        }
    }
}

const styles = {
    textInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#e2668c',
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 4,
        color: '#333',
        fontWeight: '500',
        fontSize: isTablet ? 15 : 18,
        width: '48%',
    },
}
