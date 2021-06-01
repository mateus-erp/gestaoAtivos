import React from 'react'
import { roxo } from '../scenes/cores'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

export function CustomLink(props, navigation) {
    const { title, strong, onPress } = props

    return (
        <TouchableOpacity style={Styles.fotter} onPress={onPress}>
            <Text>{title}<Text style={{ color: roxo }}>{strong}</Text></Text>
        </TouchableOpacity>
    )
}

const Styles = StyleSheet.create({

    fotter: {
        alignItems: 'center',
    },

});
