import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, AsyncStorage, StatusBar } from 'react-native';
import { Button } from 'react-native-paper'
import firebase from 'firebase'
import { roxo, cinza, branco, claro, escuro } from '../cores';
import { CustomContainer } from '../../components/CustomContainer';
import { CustomHeader } from '../../components/CustomHeader';
import { CustomButton } from '../../components/CustomButton';
import { CustomLink } from '../../components/CustomLink';
import { CustomInput } from '../../components/CustomInput';

export default function TelaLogin({ navigation }) {
  const db = firebase.database()
  const ref = db.ref('usuarios')

  const [usuario, setUsuario] = useState({email: '', senha: '', tipoDeColaborador: ''})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    limparDados()
  }, [])

  return (
    <CustomContainer>
      <CustomHeader />
      <View>
        <CustomInput 
          title="Email"
          placeholder="contato@gmail.com"
          keyboardType={'email-address'}
          autoCapitalize='none'
          value={usuario.email}
          onChangeText={texto => setUsuario({...usuario, email: texto})}
        />

        <CustomInput
          title="Senha"
          placeholder="*******"
          keyboardType={'numeric'}
          secureTextEntry={true}
          value={usuario.senha}
          onChangeText={texto => setUsuario({ ...usuario, senha: texto })}
        />

        <CustomButton
          title="Entrar"
          onPress={() => metodoLogin()}
        />

        <CustomLink
          title="Esqueceu sua senha? "
          strong="Recuperar"
          onPress={() => navigation.navigate('TelaResetarSenha')}
        />
      </View>
    </CustomContainer>
  )

  async function guardarNoAsync(){
    const {email} = usuario

    try {
      await AsyncStorage.removeItem('@usuario')
    } catch (error) {
      console.log(error)
      Alert.alert('Atenção', 'Erro ao remover o email do colaborador')
    }

    try {
      await AsyncStorage.setItem('@usuario',email)
    } catch (error) {
      console.log(error)
      Alert.alert('Atenção', 'Erro ao salvar o email do colaborador')
    }
  }

  async function metodoLogin(){
    setLoading(true)
    cadastrarNoAuth()
  }

  async function cadastrarNoAuth(){
    let uid = ''
    const {email, senha} = usuario
    await firebase.auth().signInWithEmailAndPassword(email, senha)
      .then(function(res){
          uid = res.user.uid
          getTipoDeColaborador(uid)
      })
      .catch(function(error){
        console.log(error)
        Alert.alert('Atenção', 'Usuário não encontrado')
      })
  }

  async function getTipoDeColaborador(uid){
    let datalist= []
    let res = await ref.child(uid).once("value")
      if(res.val()){
        res.forEach((e) => {
          datalist.push({key: e.key, ...e.val()})
        })
        irParaHome(datalist[0].tipoDeColaborador)
      }else{
        datalist = []
        limparDados()
        Alert.alert('Atenção', 'Tipo de colaborador não identificado')
      }
  }

  function irParaHome(tipoDeColaborador){
    guardarNoAsync()
      if(tipoDeColaborador=='Aluno'){
        navigation.navigate('TelaAluno')
      }else if(tipoDeColaborador=='Professor'){
        navigation.navigate('TelaProfessor')
      }else if(tipoDeColaborador=='SGP'){
        navigation.navigate('TelaSGP')
      }else{
        Alert.alert('Atenção', 'Tipo de usuário não identicado')
      }
    limparDados()
    setLoading(false)
  }

  function limparDados(){
    setUsuario({email: '', senha: ''})
  }

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

