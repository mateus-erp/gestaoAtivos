import React from 'react'
import { LogBox } from 'react-native'
import { Route } from './src/routes'
import firebase from 'firebase'
import {FIREBASE} from './src/config.js'

if(!firebase.apps.length) firebase.initializeApp(FIREBASE)

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
LogBox.ignoreLogs(['Warning: componentWillReceiveProps']);

export default function App() {
  return (<Route />)
}