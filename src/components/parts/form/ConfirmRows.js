import React from 'react'
import { View, Text } from 'react-native'

export const ConfirmRows = (props) => {
    const rows = [
        {
            label: "お名前",
            value: props.state.name,
        },
        {
            label: "〒",
            value: props.state.postal,
        },
        {
            label: "住所",
            value: props.state.address,
        },
        {
            label: "電話番号",
            value: props.state.phone,
        },
    ]
    const rowsDom = rows.map(row => {
        return (
            <View style={styles.confirmRow} key={row.value}>
                <Text style={styles.confirmRowLabel}>{row.label}</Text>
                <Text style={styles.confirmRowValue}>{row.value}</Text>
            </View>
        )
    })

    const containerStyle = (props.isCard) ? styles.cardContainer : container

    return (
        <View style={containerStyle}>
            {rowsDom}
        </View>
    )
}

const styles = {
    container: {},
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    confirmRow: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 15,
    },
    confirmRowLabel: {
        borderRightWidth: 1,
        borderStyle: 'solid',
        borderRightColor: '#7f7f7f',
        flex: 3,
        fontSize: 18,
    },
    confirmRowValue: {
        flex: 6,
        fontSize: 18,
        paddingLeft: 10,
    },
}