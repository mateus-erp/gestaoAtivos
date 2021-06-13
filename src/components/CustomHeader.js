import React from 'react'
import { roxo, branco, claro } from '../scenes/cores'
import { View, Text, StyleSheet } from 'react-native'
import { useFonts, Pattaya_400Regular } from '@expo-google-fonts/pattaya';

export function CustomHeader({ subHeader, size=200 }) {
    const SubView = () => {
        if (subHeader == false){
            return null;
        }
        return (
            <View style={Styles.subHeader2}></View>
        );
    }
    const Styles = StyleSheet.create({
        header: {
            backgroundColor: roxo,
            height: size,
        },

        subHeader1: {
            height: 150,
            alignItems: 'center',
            justifyContent: 'center',
        },

        title: {
            color: claro,
            fontSize: 30,
        },

        subHeader2: {
            backgroundColor: branco,
            height: 50,
            borderTopLeftRadius: 100,
        },

    });

    let [fontsLoaded] = useFonts({
        Pattaya_400Regular,
    });

    if (!fontsLoaded) {
        return <Text>erro</Text>;
    }

    return (
        <View style={Styles.header}>
            <View style={Styles.subHeader1}>
                <Text style={{ color: claro, fontSize: 100, fontFamily: 'Pattaya_400Regular' }}>A</Text>
            </View>
            <SubView />
        </View>
    )
}