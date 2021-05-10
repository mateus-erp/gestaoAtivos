import React from 'react'
import { LogBox } from 'react-native'
import Routes from './src/routes.js'

import firebase from 'firebase'
import {FIREBASE} from './src/config.js'

if(!firebase.apps.length) firebase.initializeApp(FIREBASE)

LogBox.ignoreLogs(['Setting a timer']);

export default function App() {
  return (<Routes />)
}