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
        <Text style={theme.text_header}>Bem-vindo</Text>
        <Icon name= 'black-tie' style={{color: '#fff', fontSize: 35, alignSelf: 'center'}}></Icon>
      </View>
      <View style={theme.content}>
        <View style={theme.buttons}>
          <ActionBox title="Avaliar Reservas" icon="book" link={()=>navigation.navigate("TelaVerificarReservasEquipamentos")}></ActionBox>
          <ActionBox title="Configurar Locais" icon="home" link={()=>navigation.navigate("TelaConfigurarLocais")}></ActionBox>
          <ActionBox title="Cadastrar Disciplinas" icon="tag" link={()=>navigation.navigate("TelaCadastrarDisciplinas")}></ActionBox>
          <ActionBox title="Cadastrar Colaboradores" icon="address-card" link={()=>navigation.navigate("TelaCadastrarColaborador")}></ActionBox>
          <ActionBox title="Cadastrar Equipamentos" icon="desktop" link={()=>navigation.navigate("")}></ActionBox>
        </View>
        <View style={theme.logout}>
          <ActionButton icon='arrow-circle-left' title='Logout' link="TelaLogin"></ActionButton>
        </View>
      </View>
      
    </View>
  );
}
