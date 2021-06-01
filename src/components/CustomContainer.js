import React from 'react'
import { branco } from '../scenes/cores'
import { View, StyleSheet } from 'react-native'

export function CustomContainer(props) {  
    return (
        <View style={Styles.container}>
            {props.children}
        </View>
    )
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: branco,
    },
});
