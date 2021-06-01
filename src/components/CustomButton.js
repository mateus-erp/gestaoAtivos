import React from 'react'
import { roxo, claro } from '../scenes/cores'
import { StyleSheet, Text } from 'react-native'
import { Button } from 'react-native-paper'

export function CustomButton(props, navigation) {
    const { title, onPress } = props

    return (
        <Button style={Styles.bottom} mode="outlined" onPress={onPress}><Text style={{ color: claro }}>{title}</Text></Button>
    )
}

const Styles = StyleSheet.create({
    bottom: {
        margin: 20,
        backgroundColor: roxo,
        borderRadius: 5,
        padding: 5,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 15,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },

});