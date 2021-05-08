import React from 'react';

import 'react-native-gesture-handler'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TelaLogin from './scenes/telaLogin'
import TelaSGP from './scenes/telaSGP'

export default function Routes() {
    const AppStack = createStackNavigator()
    return(
        <NavigationContainer>
            <AppStack.Navigator screenOptions={{ headerShown: false }}>
                <AppStack.Screen name="TelaLogin" component={TelaLogin} />
                <AppStack.Screen name="TelaSGP" component={TelaSGP} />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}
