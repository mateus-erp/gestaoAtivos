import React, {useState, useEffect} from 'react';
import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, AsyncStorage } from 'react-native';
import Constants from 'expo-constants';
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import firebase from 'firebase'

import {theme} from '../../themes/darkTheme'

import { CustomDate } from '../../components/CustomDate';
import { CustomTime } from '../../components/CustomTime';

export default function TelaCadastrarAgendaAluno({ navigation }) {
  const db = firebase.database()
  const ref = db.ref('agendas')

  const [agenda, setAgenda] = useState({dono: '', disciplina: '', sala: '',dias: '', horario: ''})
  const [loading, setLoading] = useState(false)
  const [dadosDropDownSalas, setDadosDropDownSalas] = useState([])

  useEffect(()=> {
    getSalas()
    getEmail()
  }, [])

  const [isDateVisible, setDateVisibility] = useState(false);
  const [isTimeVisible, setTimeVisibility] = useState(false);
  const [hora, setHorario] = useState("");
  const [date, setDate] = useState("");
  
  useEffect(()=> {
    getSalas()
    getEmail()
  }, []);

  const showDatePicker = () => {
    setDateVisibility(true);
  };

  const showTimePicker = () => {
    setTimeVisibility(true);
  };

  const hideDatePicker = () => {
    setDateVisibility(false);
  };

  const hideTimePicker = () => {
    setTimeVisibility(false);
  };

  const handleConfirm = (data) => {
    Data(data);
    hideDatePicker();
  };

  const handleConfirmTime = (data) => {
    horario(data)
    hideTimePicker();
  };

  function horario(data) {
    let horas = data.getHours().toString();
    let minutos = data.getMinutes().toString();
    let segundos = data.getSeconds().toString();
    let dataTime = "";

    { horas.length === 2 ? null : horas = "0" + horas }
    { minutos.length === 2 ? null : minutos = "0" + minutos }
    { segundos.length === 2 ? null : segundos = "0" + segundos }

    dataTime = horas + ":" + minutos + ":" + segundos
    setHorario(dataTime);
    setAgenda({ ...agenda, horario: dataTime })
  }

  function Data(data) {
    let ano = data.getFullYear().toString();
    let mes = data.getMonth().toString();
    let dia = data.getDate().toString();
    let dataFormatada = "";

    { mes.length === 2 ? null : mes = "0" + mes }
    { dia.length === 2 ? null : dia = "0" + dia }

    dataFormatada = dia + "/" + mes + "/" + ano
    setDate(dataFormatada);
    setAgenda({...agenda, dias: dataFormatada })
  }


  return (
    <View style={theme.container}>
      <View style={theme.header}>
        <Text style={theme.text_header}>Nova anotação</Text>
      </View>
      <View style={theme.content}>
        <View>
        <View style={{margin: 5, flexDirection: 'row'}}>
          <CustomDate
            onPress={showDatePicker}
            title="Data"
            type="date"
            placeholder="Informe a Data"
            isVisible={isDateVisible}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            value={agenda.date}
          />
        <CustomTime
          onPress={showTimePicker}
          title="Horário"
          type="time"
          placeholder="Informe o Horário"
          isVisible={isTimeVisible}
          onConfirm={handleConfirmTime}
          onCancel={hideDatePicker}
          value={agenda.hora}
        />
        </View>
        <View style={Styles.containerDosDados}>
          <TextInput
            value={agenda.disciplina}
            placeholder="Disciplina"
            onChangeText={texto => setAgenda({...agenda, disciplina: texto})}
            autoCapitalize={'sentences'}
            maxLength={50}
          />
        </View>
        <View style={Styles.containerDropDown}>
          <Dropdown
            label='Sala'
            data={dadosDropDownSalas}
            onChangeText={texto => setAgenda({...agenda, sala: texto})}
          />
        </View>
        </View>
        <View style={Styles.botaoContainer}>
        <TouchableOpacity style={theme.usual_button} onPress={()=>navigation.goBack()}>
          <Text style={theme.text_usual_button}>Retornar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={theme.usual_button} onPress={()=>inserirNovaAgenda()}>
          <Text style={theme.text_usual_button}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator animating={loading} size="large" color="#0000ff" />}
      </View>
    </View>
  )

  async function getSalas(){
    const ref = db.ref('locais_salas')
    let ordem = 'nomeLocal'
      try {
        let res = await ref.orderByChild(ordem).once('value')
          if(res.val()){
            let datalist= []
            res.forEach((e) => {
              datalist.push({value: e.val().nomeLocal})
            })
            setDadosDropDownSalas([])
            setDadosDropDownSalas(datalist)
          }else{
            Alert.alert('Atenção', 'Não existem salas cadastradas.')
            navigation.goBack()
          }
      } catch (error) {
        console.log(error)
        Alert.alert('Atenção', 'Erro a carregar as salas')
        navigation.goBack()
      }
  }

  async function getEmail(){
    let email = ''
        try {
           email = await AsyncStorage.getItem('@usuario')
        } catch (error) {
            console.log(error)
            Alert.alert('Atenção', 'Erro ao pegar o email do colaborador')
            navigation.goBack()
        }
    setAgenda({...agenda, dono: email})
  }

  function inserirNovaAgenda() {
    const {dono, disciplina, sala, horario, dias} = agenda
    if(dono==''){
      getEmail()
      inserirNovaAgenda()
    }else{
      if(disciplina=='' || sala==''|| horario=='', dias==''){
        Alert.alert('Atenção', 'Você precisa preencher todos os campos.')
      }else{
        metodoInserir()
      } 
    }
  }

  async function metodoInserir(){
    setLoading(true)
    const {dono, disciplina, sala, horario, dias} = agenda
      await ref.push({
        dono: dono,
        disciplina: disciplina,
        sala: sala,
        horario: horario,
        dias: dias,
      })
      .then(function(res){
        Alert.alert('Sucesso', 'Cadastro efetuado com sucesso.')
        navigation.goBack()
      })
      .catch(function(error){
        Alert.alert('Falha no sistema', 'Erro ao inserir nova disciplina.')
      })
      .finally(setLoading(false))
  }

}

const Styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerDropDown: {
    width: 300,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  botaoContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  redimensionarLogo: {
      width: 120,
      height: 120,
      resizeMode: 'contain',
      alignSelf: 'center',
  },
  titulo: {
    fontSize: 30,
    color: '#02246c',
    fontWeight: 'bold',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  containerDosDados: {
    margin: 10,
    borderBottomWidth: 2,
    width: 300,
    borderColor: '#e0ebeb',
    borderRadius: 10,
    alignSelf: 'center',
  },
  textoBotaoAcessar: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  textoBotaoCadastrar: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  botaoCadastrar: {
    width: 160,
    height: 50,
    backgroundColor: '#337861',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    margin: 5,
  },
  botaoAcessar: {
    width: 160,
    height: 50,
    backgroundColor: '#002566',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    margin: 5,
  },
});

