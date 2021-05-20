import React, {Component, useState} from 'react';
import { StatusBar, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { roxo, cinza, branco, claro, escuro } from '../cores'
import { Button } from 'react-native-paper'

export default function TelaResetarSenha({ navigation }) {
  const [email, setEmail] = useState('');


  return (
    <View style={Styles.container}>
      <View style={Styles.header}>
        <View style={Styles.subHeader1}>
          <Text style={Styles.title}>Recuperar Senha</Text>
        </View>
        <View style={Styles.subHeader2}></View>
      </View>
      <View>
        <View style={Styles.form}>
          <Text>Email</Text>
          <TextInput
            style={Styles.input}
            placeholder="contact@gmail.com"
            keyboardType={'email-address'}
            autoCapitalize='none'
          />
        </View>
        <Button style={Styles.bottom} mode="outlined"><Text style={{ color: claro }}>Recuperar</Text></Button>
        <TouchableOpacity style={Styles.fotter} onPress={() => navigation.navigate('TelaLogin')}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </View>
      <StatusBar/>
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: branco,
  },

  header: {
    backgroundColor: roxo,
    height: 200,
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

  form: {
    margin: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: claro,
  },

  input: {
    height: 40,
    backgroundColor: claro,
  },

  bottom: {
    margin: 20,
    backgroundColor: roxo,
    borderRadius: 5,
    padding: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },

  fotter: {
    alignItems: 'center',
  },
});

