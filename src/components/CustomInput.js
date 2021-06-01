import React from 'react'
import { View, TextInput, Text, StyleSheet } from 'react-native'
import { roxo, cinza, branco, claro, escuro } from '../scenes/cores'

export function CustomInput(props, navigation) {
    const { title, placeholder, keyboardType, autoCapitalize, value, onChangeText, secureTextEntry } = props

    return (
        <View style={Styles.form}>
            <Text>{title}</Text>
            <TextInput
                style={Styles.input}
                placeholder={placeholder}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
        </View>
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
