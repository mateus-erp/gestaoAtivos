import React from 'react';

import 'react-native-gesture-handler'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TelaLogin from './scenes/telaLogin'

export default function Routes() {
    const AppStack = createStackNavigator()
    return(
        <NavigationContainer>
            <AppStack.Navigator screenOptions={{ headerShown: false }}>
                <AppStack.Screen name="TelaLogin" component={TelaLogin} />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}
