import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

import { theme } from '../../themes/darkTheme'
import ActionBox from '../../components/ActionBox'

export default function TelaAluno({ navigation }) {
  return (
    <View style={theme.container}>
      <View style={theme.header}>
        <Text style={theme.text_header}>Bem-vindo</Text>
        <Icon name='user' style={{ color: '#fff', fontSize: 35, alignSelf: 'center' }}></Icon>
      </View>
      <View style={theme.content}>
        <View style={theme.buttons}>
          <ActionBox title="Cadastrar Agenda" icon="book" link={() => navigation.navigate("TelaCadastrarAgendaAluno")}></ActionBox>
        </View>
        <View style={theme.logout}>
          <TouchableOpacity style={theme.actionbutton} onPress={() => navigation.navigate('TelaLogin')}>
            <Text style={theme.text_actionbutton}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
