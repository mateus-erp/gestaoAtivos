import React from 'react'
import ignoreWarnings from 'react-native-ignore-warnings'
import Routes from './src/routes.js'

import firebase from 'firebase'
import {FIREBASE} from './src/config.js'

if(!firebase.apps.length) firebase.initializeApp(FIREBASE)

ignoreWarnings('Setting a timer');

export default function App() {
  return (<Routes />)
}