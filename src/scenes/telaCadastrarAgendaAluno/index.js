import React, {useState, useEffect} from 'react';
import {ScrollView, View, StyleSheet, Alert, AsyncStorage } from 'react-native';
import Constants from 'expo-constants';
import firebase from 'firebase'
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';

import { CustomContainer } from '../../components/CustomContainer';
import { CustomHeader } from '../../components/CustomHeader';
import { CustomButton } from '../../components/CustomButton';
import { CustomLink } from '../../components/CustomLink';
import { CustomInput } from '../../components/CustomInput';
import { CustomField } from '../../components/CustomField';
import { CustomDate } from '../../components/CustomDate';
import { CustomTime } from '../../components/CustomTime';

export default function TelaCadastrarAgendaAluno({ navigation }) {
  const db = firebase.database();
  const ref = db.ref('agendas');
  const [agenda, setAgenda] = useState({ dono: undefined, disciplina: undefined, sala: undefined, professor: undefined, dias: undefined, horario: undefined });
  const [loading, setLoading] = useState(false);
  const [dadosDropDownSalas, setDadosDropDownSalas] = useState([]);
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
    <CustomContainer>
      <CustomHeader />
      <ScrollView>
        <CustomDate
          onPress={showDatePicker}
          title="Data"
          type="date"
          placeholder="Informe a Data"
          isVisible={isDateVisible}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          value={date}
        />

        <CustomTime
          onPress={showTimePicker}
          title="Horário"
          type="time"
          placeholder="Informe o Horário"
          isVisible={isTimeVisible}
          onConfirm={handleConfirmTime}
          onCancel={hideDatePicker}
          value={hora}
        />

        <CustomInput
          title="Disciplina"
          placeholder="Matemática"
          keyboardType={'default'}
          onChangeText={texto => setAgenda({ ...agenda, disciplina: texto })}
        />

        <CustomField title="Sala">
          <Dropdown
            data={dadosDropDownSalas}
            onChangeText={texto => setAgenda({ ...agenda, sala: texto })}
          />
        </CustomField>

        <CustomInput
          title="Professor"
          placeholder="Mateus"
          keyboardType={'default'}
          onChangeText={texto => setAgenda({ ...agenda, professor: texto })}
        />
      </ScrollView>
      <View>
        <CustomButton
          title="Cadastrar"
          onPress={() => inserirNovaAgenda()}
        />

        <CustomLink
          title="Voltar"
          onPress={() => navigation.navigate('TelaAluno')}
        />
      </View>
    </CustomContainer>
  );

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
            navigation.navigate('TelaAluno')
          }
      } catch (error) {
        console.log(error)
        Alert.alert('Atenção', 'Erro a carregar as salas')
        navigation.navigate('TelaAluno')
      }
  }

  async function getEmail(){
    let email = ''
        try {
           email = await AsyncStorage.getItem('@usuario')
        } catch (error) {
            console.log(error)
            Alert.alert('Atenção', 'Erro ao pegar o email do colaborador')
          navigation.navigate('TelaAluno')
        }
    setAgenda({...agenda, dono: email})
  }

  function inserirNovaAgenda() {
    if (agenda.dono == ''){
      getEmail()
      inserirNovaAgenda()
    }else{
      if (agenda.disciplina == undefined || agenda.sala == undefined || agenda.professor == undefined || agenda.horario == undefined || agenda.dias == undefined){
        Alert.alert('Atenção', 'Você precisa preencher todos os campos.')
      }else{
        metodoInserir()
      } 
    }
  }

  async function metodoInserir(){
    const { dono, disciplina, sala, professor, horario, dias } = agenda
      await ref.push({
        dono: dono,
        disciplina: disciplina,
        sala: sala,
        professor: professor,
        horario: horario,
        dias: dias,
      }).then((res) => {
        Alert.alert('Sucesso', 'Cadastro efetuado com sucesso.');
        navigation.navigate('TelaAluno');
      }).catch((error) => {
        Alert.alert('Falha no sistema', 'Erro ao inserir nova disciplina.');
      });
  }
}