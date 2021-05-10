import React from 'react'
import { Text, View } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

import {theme} from '../../themes/darkTheme'
import ActionBox from '../../components/ActionBox'
import ActionButton from '../../components/ActionButton'

export default function TelaSGP({ navigation }) {
  return (
    <View style={theme.container}>
      <View style={theme.header}>
        <Text style={theme.text_header}>Bem-vindo, Fulano</Text>
        <Icon name= 'black-tie' style={{color: '#fff', fontSize: 35, alignSelf: 'center'}}></Icon>
      </View>
      <View style={theme.content}>
        <View style={theme.buttons}>
          <ActionBox title="Avaliar Reservas" icon="book"></ActionBox>
          <ActionBox title="Cadastrar Salas" icon="home"></ActionBox>
          <ActionBox title="Cadastrar Disciplinas" icon="tag"></ActionBox>
          <ActionBox title="Cadastrar Colaboradores" icon="address-card"></ActionBox>
          <ActionBox title="Cadastrar Equipamentos" icon="desktop"></ActionBox>
        </View>
        <View style={theme.logout}>
          <ActionButton icon='arrow-circle-left' title='Logout'></ActionButton>
        </View>
      </View>
      
    </View>
  );
}
