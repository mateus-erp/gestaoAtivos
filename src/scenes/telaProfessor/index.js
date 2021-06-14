import React, {useState} from 'react';
import { Text, View, ScrollView, StyleSheet, Alert, FlatList, Image, TouchableOpacity, Modal, AsyncStorage, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import firebase from 'firebase'
import { FontAwesome,MaterialCommunityIcons } from '@expo/vector-icons'; 
import Icon from 'react-native-vector-icons/FontAwesome'

import {theme} from '../../themes/darkTheme'

export default function TelaProfessor({ navigation }) {
  return (
    <View style={theme.container}>
      <View style={theme.header}>
        <Text style={theme.text_header}>Bem-vindo</Text>
        <Icon name= 'graduation-cap' style={{color: '#fff', fontSize: 35, alignSelf: 'center'}}></Icon>
      </View>
      <View style={theme.content}>
        <View style={theme.buttons}>
          <TouchableOpacity style={theme.actionbox} onPress={()=>navigation.navigate('TelaCadastrarAgendaProfessor')}>
            <View style={theme.icon_actionbox}>
              <Icon name='plus' style={theme.icon_actionbox}></Icon>
            </View>
            <Text style={theme.text_actionbox}>Cadastrar Agenda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={theme.actionbox} onPress={()=>navigation.navigate('TelaConsultaAgenda')}>
            <View style={theme.icon_actionbox}>
              <Icon name='book' style={theme.icon_actionbox}></Icon>
            </View>
            <Text style={theme.text_actionbox}>Minha agenda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={theme.actionbox} onPress={()=>navigation.navigate('TelaSolicitacaoReservasEquipamentos')}>
            <View style={theme.icon_actionbox}>
              <MaterialCommunityIcons name="projector" style={theme.icon_actionbox} />
            </View>
            <Text style={theme.text_actionbox}>Reservar Equipamento</Text>
          </TouchableOpacity>
          <TouchableOpacity style={theme.actionbox} onPress={()=>navigation.navigate('TelaSolicitacaoReservasSalas')}>
            <View style={theme.icon_actionbox}>
            <FontAwesome name="key" style={theme.icon_actionbox}/>
            </View>
            <Text style={theme.text_actionbox}>Reservar Sala</Text>
          </TouchableOpacity>
        </View>
      <View style={theme.logout}>
        <TouchableOpacity style={theme.actionbutton} onPress={()=>navigation.navigate('TelaLogin')}>          
          <Text style={theme.text_actionbutton}>Logout</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  )}
const Styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'white',
  },
  containerBotaoEditar: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#5da37f',
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerBotaoRemover: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#f51300',
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerInternoFlatList: {
    width: 250,
    height: 300,
    borderRadius: 15,
    backgroundColor: '#f6f6f6',
    justifyContent: 'center',
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerFlatList: {
    width:'90%',
    minHeight:'60%',
    maxHeight:'65%',
    backgroundColor: '#fff',
    justifyContent:'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerBotaoFecharModal: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#f52e20',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerBotaoAdicionar: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#30c959',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerBotaoAtualizar: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#0d0da3',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerModal: {
    flex:1,
    width:'90%',
    height:'50%',
    backgroundColor: '#f2cecb',
    justifyContent:'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 50,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  botaoContainer: {
    margin: 10,
    maxHeight: 350,
  },
  redimensionarLogo: {
      width: 120,
      height: 120,
      resizeMode: 'contain',
      margin: 10,
  },
  titulo: {
    fontSize: 30,
    color: '#02246c',
    fontWeight: 'bold',
  },
  textoBotoesSuperiores: {
    fontSize: 20,
    color: '#02246c',
    fontWeight: 'bold',
  },
  textoBotaoSair: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  botoesSuperiores: {
    width: 320,
    height: 70,
    backgroundColor: '#dae6c2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: '#284474',
    borderWidth: 1,
    margin: 10,
  },
  botaoDeSair: {
    width: 320,
    height: 70,
    backgroundColor: '#002566',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    margin: 10,
  },
});

