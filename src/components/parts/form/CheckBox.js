import React from 'react'
import { View, Text, TextInput } from 'react-native'
import CheckBox from 'react-native-checkbox'

/*
 * onCheck
 */
export class FormCheckBox extends React.Component {
    render() {
        return (
            <View style={styles.checkBoxRow}>
                <CheckBox
                    label={this.props.label}
                    labelStyle={styles.checkBoxLabel}
                    checkboxStyle={styles.checkboxStyle}
                    checked={this.props.checkState}
                    onChange={this.props.onCheck}
                >
                    {this.props.children}
                </CheckBox>
            </View>
        )
    }
}

const styles = {
    checkBoxRow: {
        marginBottom: 10,
    },
    checkBoxLabel: {
        color: '#3f3f3f',
    },
    checkboxStyle: {
        borderColor: '#e2668c',
    },
}