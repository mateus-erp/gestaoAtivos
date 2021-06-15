import React, {useState, useEffect} from 'react';
import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import firebase from 'firebase';
import {theme} from '../../themes/darkTheme';
import { FontAwesome } from '@expo/vector-icons'; 
import { roxo } from '../cores';

export default function TelaCadastrarDisciplina({ navigation }) {
  const db = firebase.database()
  const ref = db.ref('disciplinas')

  const [disciplina, setDisciplina] = useState({ nome: ''})
  const [loading, setLoading] = useState(false)
/*
useEffect(()=>{
  getdisc()
})

  async function getdisc() {    
      if(edit == true){      
      let res = await db.ref(`disciplinas/`).child(`${key}`).once('value')
      setDisciplina({
        nome: `${res.val().nome}`,        
      })
    
    }
  }
*/
  return (
    <View style={Styles.containerPrincipal}>
      <Text style={Styles.titulo}>Nova Disciplina</Text>
      <ScrollView style={{maxHeight: 250, margin: 30}}>
        <View style={Styles.containerDosDados}>
          <TextInput
            style={{height: 30}}
            value={disciplina.nome}
            placeholder="Disciplinas"
            onChangeText={texto => setDisciplina({...disciplina, nome: texto})}
            autoCapitalize={'words'}
            keyboardType={'default'}
          />
        </View>
      </ScrollView>
      <View style={Styles.botaoContainer}>
        <TouchableOpacity style={Styles.botaoCadastrar} onPress={()=>inserirNovaDisciplina()}>
          <Text style={Styles.textoBotaoCadastrar}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator animating={loading} size="large" color="#0000ff" />}
      
    </View>
  );

  function inserirNovaDisciplina() {
    if(disciplina.nome=='')
      Alert.alert('Atenção', 'Você precisa preencher o informar o nome da disciplina')
    metodoInserir();
  }

  async function metodoInserir(){
    setLoading(true)
    try {
      await ref.orderByChild('nome').equalTo(`${disciplina.nome}`).limitToFirst(1).once("value", function(snapshot) {
        if(snapshot.val()){
          Alert.alert('Atenção', 'disciplina já cadastrado.')
        }else{
          cadastrarNoFirebaseAuth()
        }
      })
    }catch{
      console.log(error)
      Alert.alert('Falha no sistema', 'Erro ao inserir nova Disciplina.')
    }
    setLoading(false)
  }

  async function cadastrarNoFirebaseAuth(){
    const {nome} = disciplina
    let uid = ''
      await ref.push({nome:nome}).then( res => {
        Alert.alert('Sucesso ,disciplina inserida!')
      } )
      if(uid==''){
        Alert.alert('Falha no sistema', 'Erro ao inserir nova disciplina.')
      }else{
        cadastrarNoRealtimeDatabase(uid)
      }
  }
  
  async function cadastrarNoRealtimeDatabase(uid){
    const { nome } = disciplina
      await ref.child(uid).push({
        nome: nome
      })
      .then(function(res){
        Alert.alert('Sucesso', 'Cadastro efetuado com sucesso.')
      })
      .catch(function(error){
        Alert.alert('Falha no sistema', 'Erro ao inserir novo usuário.')
      })
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
  botaoContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  titulo: {
    fontSize: 30,
    color: '#02246c',
    fontWeight: 'bold',
    alignSelf: 'center',
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
    backgroundColor: roxo,
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

