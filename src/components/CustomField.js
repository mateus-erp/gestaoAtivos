import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { claro } from '../scenes/cores'

export function CustomField(props) {
    const { title, onPress } = props

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={Styles.form}>
                <Text>{title}</Text>
                {props.children}
            </View>
        </TouchableOpacity>
    )
}

const Styles = StyleSheet.create({
    form: {
        margin: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: claro,
    },

    input: {
        height: 40,
        backgroundColor: claro,
    }
});
