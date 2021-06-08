import React, { useState } from 'react'
import { TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { claro } from '../scenes/cores'
import DateTimePickerModal from "react-native-modal-datetime-picker";

export function CustomTime(props) {
    const { title, type, onPress, isVisible, onConfirm, onCancel, value, placeholder } = props
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={Styles.form}>
                <Text>{title}</Text>
                <DateTimePickerModal
                    isVisible={isVisible}
                    mode={type}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                />
                <TextInput
                    value={value}
                    editable={false}
                    placeholder={placeholder}
                />
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
