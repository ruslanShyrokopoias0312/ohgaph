import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import DeviceInfo from 'react-native-device-info'

export class FormSubmit extends React.Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onSubmit}
                style={styles.submit}
            >
                <Text style={styles.submitLabel}>{this.props.label}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = {
    submit: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1,
        marginTop: 20,
        marginBottom: 12,
        paddingVertical: DeviceInfo.isTablet() ? 13 : 15,
        backgroundColor: 'rgb(56,161,213)',
    },
    submitLabel: {
        textAlign: 'center',
        color: '#fff',
        fontSize: DeviceInfo.isTablet() ? 15 : 17,
        letterSpacing: 2,
    },
}