import React, {useState, useEffect} from 'react';
import { ActivityIndicator, View, Text, Alert, AsyncStorage } from 'react-native';
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

  const [usuario, setUsuario] = useState({email: '', senha: '', tipoDeColaborador: ''});
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState({load: false});

  const Carregamento = () => {
    return (
    <View style={{ zIndex: 1, position: 'absolute', padding: 100, alignSelf: 'center' }}>
        <ActivityIndicator animating={animating.load} size="large" color={claro} />
    </View>
    )
  }


  useEffect(() => {
    limparDados()
  }, [])

  console.log(animating.load)

  return (
    <CustomContainer>
      <CustomHeader />
      { animating.load ? <Carregamento /> : null}
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
    setAnimating({ load: true });
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
        setAnimating({email: false});
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
        setAnimating({ email: false });
        Alert.alert('Atenção', 'Tipo de colaborador não identificado')
      }
  }

  function irParaHome(tipoDeColaborador){
    guardarNoAsync()
      if(tipoDeColaborador=='Aluno'){
        setAnimating({email: false});
        navigation.navigate('TelaAluno')
      }else if(tipoDeColaborador=='Professor'){
        setAnimating({email: false});
        navigation.navigate('TelaProfessor')
      }else if(tipoDeColaborador=='SGP'){
        setAnimating({email: false});
        navigation.navigate('TelaSGP')
      }else{
        setAnimating({email: false});
        Alert.alert('Atenção', 'Tipo de usuário não identicado')
      }
    limparDados()
    setLoading(false)
  }

  function limparDados(){
    setUsuario({email: '', senha: ''})
  }

}


