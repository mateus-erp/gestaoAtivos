import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, TextInput } from 'react-native';
import Constants from 'expo-constants';
import firebase from 'firebase'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'; 

import {theme} from '../../themes/darkTheme'

export default function TelaVerificarReservasSalas({ navigation }) {
  const db = firebase.database()
  const ref = db.ref(`reservas_salas/`)

  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [visualizacao, setVisualizacao] = useState({titulo: 'Espera', tipo: 'Em análise', icone: 'eye-slash'})
    
  useEffect(() => {
    getReservas()
  }, [])

  return (
    <View style={theme.container}>
      <View style={theme.header}>
        <Text style={theme.text_header}>Reservas</Text>
        <TouchableOpacity style={theme.actionbox} onPress={()=>refresh(visualizacao.tipo)}>
          <FontAwesome name="refresh" style={theme.icon_actionbox} />
        </TouchableOpacity>
      </View>
      <View style={theme.content}>
        <View style={{flexDirection: 'row'}}>
          <View style={theme.textbox}>          
            <TextInput
              style={{height: 40}}
              placeholder="Email"
              value={email}
              onChangeText={texto => setEmail(texto)}
              autoCapitalize={'none'}
            />
          </View>
          <TouchableOpacity onPress={()=>pesquisarPorBloco(email)} style={theme.actionbox}>
            <FontAwesome name="search" style={theme.icon_actionbox} />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={()=>navigation.navigate('TelaVerificarReservasEquipamentos')}>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <MaterialCommunityIcons name="projector" style={theme.icon_actionbox}/>
              <Text style ={theme.text_actionbox}>Equipamentos</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>mudarVisualizacao(visualizacao.tipo)}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <FontAwesome name={visualizacao.icone} style={theme.icon_actionbox}/>
              <Text style ={theme.text_actionbox}>{visualizacao.titulo}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        <FlatList
          data={dados}
          renderItem={({ item }) => (
            <View style={Styles.containerSalas}>
              <View style={{flex: 3}}>
                <Text style={{fontSize: 17, fontWeight: 'bold', marginLeft: 10, margin: 5}}>
                  Tipo: {item.tipoDeReserva}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 15,fontWeight: 'bold', marginLeft: 10}}>
                    Situação:
                  </Text>
                  <Text style={{fontSize: 15, marginLeft: 5, marginBottom: 5}}>
                    {item.situacao}
                  </Text>
                </View>
                <Text style={{fontSize: 15,fontWeight: 'bold', marginLeft: 10}}>
                  Solicitante:
                </Text>
                <Text style={{fontSize: 15, marginLeft: 10, marginBottom: 5}}>
                  {item.solicitante}
                </Text>
                <Text style={{fontSize: 15,fontWeight: 'bold', marginLeft: 10}}>
                  Período:
                </Text>
                <Text style={{fontSize: 15, marginLeft: 10, marginBottom: 5}}>
                  {item.dataRetirada} às {item.horaRetirada}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 15,fontWeight: 'bold', marginLeft: 10}}>
                    Sala:
                  </Text>
                  <Text style={{fontSize: 15, marginLeft: 5, marginBottom: 5}}>
                    {item.sala}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 15,fontWeight: 'bold', marginLeft: 10}}>
                    Motivo:
                  </Text>
                  <Text style={{fontSize: 15, marginLeft: 5, marginBottom: 5}}>
                    {item.motivo}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <TouchableOpacity style={Styles.containerBotaoAprovar} onPress={()=>responderSolicitacao(item.key, 'Aprovado')}>
                    <FontAwesome name="check" size={30} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={Styles.containerBotaoNegar} onPress={()=>responderSolicitacao(item.key, 'Negado')}>
                    <FontAwesome name="close" size={30} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
      <View>
        <TouchableOpacity style={Styles.botaoDeSair} onPress={()=>navigation.navigate('TelaSGP')}>
          <Text style={Styles.textoBotaoSair}>Retornar</Text>
        </TouchableOpacity>
      </View>

    </View>
  )

  function refresh(tipo){
    if(tipo=='Em análise'){
      getReservas()
    }else{
      getReservasTudo()
    }
  }

  async function pesquisarPorBloco(emailParaPesquisa){
    setLoading(true)
      if(emailParaPesquisa==''){
        Alert.alert('Atenção', 'Digite algum email.')
      }else{
        let res
        let ordem = 'solicitante'
        let email = `${emailParaPesquisa}`
          try {
            res = await ref.orderByChild(ordem).equalTo(email).once('value')
          } catch (error) {
            Alert.alert('Atenção', error)
          }

          if(res.val()){
            let datalist= []
            res.forEach((e) => {
              datalist.push({key: e.key, ...e.val()})
            })
            setDados([])
            setDados(datalist)
          }else{
            setDados([])
            Alert.alert('Atenção', 'Não existem reservas nesse email.')
          }    
      }
    setEmail('')
    setLoading(false)
  }

  function mudarVisualizacao(tipo){
    if(tipo=='Em análise'){
      setVisualizacao({titulo: 'Tudo', tipo: 'Tudo', icone: 'eye'})
      refresh('Tudo')
    }else{
      setVisualizacao({titulo: 'Normal', tipo: 'Em análise', icone: 'eye-slash'})
      refresh('Em análise')
    }
  }

  async function getReservas() {
    setLoading(true)
    let ordem = 'situacao'
    let tipo = 'Em análise'
    let res
      try {
        res = await ref.orderByChild(ordem).equalTo(tipo).once('value')
      } catch (error) {
        Alert.alert('Atenção', error)
      }

      if(res.val()){
        let datalist= []
        res.forEach((e) => {
          datalist.push({key: e.key, ...e.val()})
        })
        setDados([])
        setDados(datalist)
      }else{
        setDados([])
        Alert.alert('Atenção', 'Não existem reservas solicitadas.')
      }
    setLoading(false)
  }

  async function getReservasTudo() {
    setLoading(true)
    let ordem = 'situacao'
    let tipo = 'Em análise'
    let res
      try {
        res = await ref.orderByChild(ordem).startAt(tipo).once('value')
      } catch (error) {
        Alert.alert('Atenção', error)
      }

      if(res.val()){
        let datalist= []
        res.forEach((e) => {
          datalist.push({key: e.key, ...e.val()})
        })
        setDados([])
        setDados(datalist)
      }else{
        setDados([])
        Alert.alert('Atenção', 'Não existem reservas solicitadas.')
      }
    setLoading(false)
  }

  async function responderSolicitacao(key, resposta){
    setLoading(true)
    let respostaInput = resposta
    await ref.child(key).update({
      situacao: respostaInput,
    })
    .then((res) => {
      Alert.alert('Sucesso', `${respostaInput} com sucesso`)
      getReservas()
    })
    .catch((err) => {
      console.log(err)
      Alert.alert('Falha no sistema', 'Erro ao editar local.')
    })
    .finally(() => setLoading(false))
  }

}

const Styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'white',
  },
  containerBotaoAprovar: {
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
  containerBotaoNegar: {
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
  containerBotaoPesquisar: {
    width: 50,
    height: 50,
    backgroundColor: '#dae6c2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: '#284474',
    borderWidth: 1,
    marginRight: 10,
    marginTop: 5,
  },
  containerBotaoRefresh: {
    marginTop: 35,
  },
  containerBotaoEsquerdo: {
    width: 190,
    height: 50,
    backgroundColor: '#dae6c2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: '#284474',
    borderWidth: 1,
    margin: 5,
  },
  containerBotaoTudo: {
    width: 110,
    height: 50,
    backgroundColor: '#dae6c2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: '#284474',
    borderWidth: 1,
    margin: 5,
  },
  containerDosDados:{
    margin: 10,
    borderBottomWidth: 2,
    width: 240,
    borderColor: '#000',
    alignSelf: 'center',
  },
  containerDeDados:{
    margin: 5,
    borderColor: 'black',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: 400,
    maxHeight: '70%'
  },
  containerSalas:{
    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#fff',
    width: 320,
    height: 350,
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 3,
    alignItems: 'center',
  },
  containerSwitch: {
    flexDirection: 'row',
    margin: 5,
    alignItems: 'center',
  },
  botaoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titulo: {
    marginTop: 30,
    margin: 10,
    fontSize: 30,
    color: '#02246c',
    fontWeight: 'bold',
  },
  textoBotoesSuperiores: {
    fontSize: 15,
    color: '#02246c',
    fontWeight: 'bold',
  },
  textoBotaoSair: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
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

