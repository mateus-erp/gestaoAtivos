import React, { useState } from 'react'
import { View, Text, Alert, AsyncStorage }from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import firebase from 'firebase'
import { theme } from '../../themes/darkTheme'

export default function TelaLogin({ navigation }) {
  const db = firebase.database()
  const ref = db.ref('usuarios')

  const [usuario, setUsuario] = useState({email: '', senha: '', tipoDeColaborador: ''})
  const [loading, setLoading] = useState(false)

  async function submit(){
    setLoading(true)
    cadastrarNoAuth()
  }

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
    
    return (
        <View style={theme.container}>
            <View style={{flex: 0.3, alignItems: 'center', justifyContent: 'center', margin: 5, flexDirection: 'column'}}>
                <Text style={theme.header}>Login com E-mail</Text>
            </View>

            <View>
                <TextInput 
                    style={{height: 40}}
                    placeholder="Email"
                    value={usuario.email}
                    onChangeText={texto => setUsuario({...usuario, email: texto})}
                    autoCapitalize={'none'}
                    keyboardType={'default'}
                />
                <TextInput
                    style={{height: 40}}
                    placeholder="Senha"
                    value={usuario.senha}
                    onChangeText={texto => setUsuario({...usuario, senha: texto})}
                    autoCapitalize={'none'}
                    keyboardType={'numeric'}
                    secureTextEntry={true}
                />
                <Button mode="outlined" onPress={submit}>Entrar</Button>
                <Button mode="outlined" onPress={()=>navigation.navigate('signup')}>ou Registre-se</Button>
            </View>
        </View>
    );
}