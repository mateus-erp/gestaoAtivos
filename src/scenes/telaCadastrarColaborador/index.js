import React, {useState, useEffect} from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import firebase from 'firebase'

import {theme} from '../../themes/darkTheme'

export default function TelaCadastrarColaborador({ navigation }) {
  const db = firebase.database()
  const ref = db.ref('usuarios/')
  const refDisc = db.ref('disciplinas/')

  const [confirmacaoSenha, setConfirmacaoSenha] = useState('')
  const [usuario, setUsuario] = useState({tipoDeColaborador: '', nome: '', email: '', senha: '', disciplina: ''})
  const [loading, setLoading] = useState(false)
  const [looping, setLooping] = useState(false)
  const [eProf, setEProf] = useState(false)
  const [disciplinas, setDisciplina] = useState([])
  const [carregadisciplinas, setcarregaDisciplina] = useState([])
  const [disc, setDisc] = useState(false)
  const [dadosDropDown, setDadosDropDown] = useState([
    {value: 'Aluno'},
    {value: 'Professor'},
    {value: 'SGP'}
  ])
  const Professor = () =>{
    return (
      <View style={Styles.containerDropDown}>
          <Dropdown onChangeText={(text)=>{ setDisc(text)}}
            label='Disciplina'
            data={disciplinas}
            onChangeText={texto => setUsuario({...usuario, disciplina: texto})}
            value={usuario.disciplina}
          />
        </View>
    )
  }
  
  useEffect(() =>{
    getDisciplinaInitial()
  },[looping])

  return (
    <View style={theme.container}>
      <View style={theme.header}>
        <Text style={theme.text_header}>Novo cadastro</Text>
      </View>
      <View style={theme.content}>
        <View style={{justifyContent:'flex-start', marginTop: 15}}>
        <View style={Styles.containerDropDown}>
          <Dropdown
            label='Tipo de colaborador'
            data={dadosDropDown}
            onChangeText={texto => {
              setUsuario({...usuario, tipoDeColaborador: texto})
              if(texto == 'Professor'){
                setEProf(true)
              }else{
                setEProf(false)
              }
            }}
          />
        </View>
        <View style={Styles.containerDosDados}>
          <TextInput
            style={{height: 40}}
            value={usuario.nome}
            placeholder="Nome completo"
            onChangeText={texto => setUsuario({...usuario, nome: texto})}
            autoCapitalize={'words'}
            keyboardType={'default'}
          />
        </View>
        <View style={Styles.containerDosDados}>
          <TextInput
            style={{height: 40}}
            value={usuario.email}
            placeholder="Email"
            onChangeText={texto => setUsuario({...usuario, email: texto})}
            autoCapitalize={'none'}
            keyboardType={'default'}
          />
        </View>
        <View style={Styles.containerDosDados}>
          <TextInput
            style={{height: 40}}
            value={usuario.senha}
            placeholder="Senha"
            onChangeText={texto => setUsuario({...usuario, senha: texto})}
            autoCapitalize={'none'}
            keyboardType={'number-pad'}
            secureTextEntry={true}
          />
        </View>
        <View style={Styles.containerDosDados}>
          <TextInput
            style={{height: 40}}
            value={confirmacaoSenha}
            placeholder="Confirme sua senha"
            onChangeText={texto => setConfirmacaoSenha(texto)}
            autoCapitalize={'none'}
            keyboardType={'number-pad'}
            secureTextEntry={true}
          />
        </View>
         { eProf == true ? <Professor />  : null } 
      </View>
      <View style={Styles.botaoContainer}>
        <TouchableOpacity style={theme.usual_button} onPress={()=>navigation.navigate('TelaSGP')}>
          <Text style={theme.text_usual_button}>Retornar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={theme.usual_button} onPress={()=>inserirNovoUsuario()}>
          <Text style={theme.text_usual_button}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator animating={loading} size="large" color="#0000ff" />}
    </View>
    </View>
  );

  function inserirNovoUsuario() {
    const {nome, email, senha, tipoDeColaborador} = usuario
    if(tipoDeColaborador==''){
      Alert.alert('Por favor', 'Selecione o tipo de colaborador')
    }else{
      if(nome=='' || email=='' || senha==''){
        Alert.alert('Aten????o', 'Voc?? precisa preencher todos os campos.')
      }else{
        if(senha==confirmacaoSenha){
          metodoInserir()
        }else{
          Alert.alert('Aten????o', 'As senhas digitadas n??o s??o as mesmas.')
        }
      } 
    }
  }

  async function metodoInserir(){
    setLoading(true)
    try {
      await ref.orderByChild('email').equalTo(`${usuario.email}`).limitToFirst(1).once("value", function(snapshot) {
        if(snapshot.val()){
          Alert.alert('Aten????o', 'Email j?? cadastrado.')
        }else{
          cadastrarNoFirebaseAuth()
        }
      })
    }catch{
      console.log(error)
      Alert.alert('Falha no sistema', 'Erro ao inserir novo usu??rio.')
    }
    setLoading(false)
  }

  async function cadastrarNoFirebaseAuth(){
    const {email, senha} = usuario
    let uid = ''
      await firebase.auth().createUserWithEmailAndPassword(`${email}`, `${senha}`)
          .then(function(res){
            uid = res.user.uid
          })
      if(uid==''){
        Alert.alert('Falha no sistema', 'Erro ao inserir novo usu??rio.')
      }else{
        cadastrarNoRealtimeDatabase(uid)
      }
  }

  async function cadastrarNoRealtimeDatabase(uid){
    const {tipoDeColaborador, nome, email, senha} = usuario
      await ref.child(uid).push({
        tipoDeColaborador: tipoDeColaborador,
        nome: nome,
        email: email,
        senha: senha,
      })      
      .then(function(res){
        Alert.alert('Sucesso', 'Cadastro efetuado com sucesso.')
        navigation.navigate('TelaSGP')
      })
      .catch(function(error){
        Alert.alert('Falha no sistema', 'Erro ao inserir novo usu??rio.')
      })
      if (tipoDeColaborador == 'Professor') {      
        consultaDisciplina()
        UpdaterDisciplina()
      }
  }

  async function getDisciplinaInitial() {
    setLoading(true)
    setDisciplina([])
    const refDis = db.ref('disciplinas')
      try {
        let res = await refDis.orderByChild('nome').once('value')
          if(res.val()){
            let datalist= []
            res.forEach((e) => {
              datalist.push({value:e.val().nome})
            })
            setDisciplina(datalist)
          }else{
            Alert.alert('N??o existem disciplinas cadastrados.')
          }
      } catch (error) {
        Alert.alert('Aten????o', `${error}`)
      }
    setLoading(false)
  }

  async function consultaDisciplina(){
    let DiscArray = []
    const refDis = db.ref('disciplinas/')
      await refDis.orderByChild('nome').equalTo(disc).on('child_added', async (e) => {        
        DiscArray.push({ key: e.key, ...e.val() })        
        setcarregaDisciplina({...carregadisciplinas,DiscArray})
      })
        await db.ref('disciplinas/')
            .child(DiscArray[0].key)
            .remove()
            .then(() => { });
      
    return DiscArray;
  }

  async function UpdaterDisciplina(){    
    const {tipoDeColaborador, nome, email, senha} = usuario
    await db.ref(`disciplinas/`).push({
      nome : disc ,
      professor : nome
    })    
  }

  /*async function getDisciplinaInitial() {
    let datalist = []  
    const refD = db.ref('disciplina')
    let res = await refD.orderByChild('nome').once('value').then((ev)=>{
      setLooping(true)
        ev.forEach((e) => {
          datalist.push({key: e.key, ...e.val()})
        })
        setDisciplina(datalist)
        console.log(datalist)
      })  
  }*/
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

