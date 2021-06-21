import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import Constants from 'expo-constants';
import firebase from 'firebase';
import {theme} from '../../themes/darkTheme';
import { FontAwesome } from '@expo/vector-icons'; 

export default function TelaDisciplina({ navigation }) {
  const db = firebase.database()

  const ref = db.ref('disciplinas')

  const [disciplina, setDisciplina] = useState({ nome: '' })
  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState([])
  

  useEffect(() =>{
    getDisciplinaInitial()
  },[])

  return (
    <View style={theme.container}>
      <View style={theme.header}>
        <Text style={theme.text_header}>Disciplinas</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={getDisciplinaInitial} style={theme.icon_actionbox_white}>
            <FontAwesome name="refresh" style={theme.icon_actionbox_white}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('TelaCadastrarDisciplina')} style={theme.icon_actionbox_white}>
            <FontAwesome name="plus" style={theme.icon_actionbox_white}/>
          </TouchableOpacity>        
        </View>
      </View>
      <View style={theme.content}>
        <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
          <View style={Styles.containerDosDados}>
            <TextInput
            style={{height: 40}}
            value={disciplina.nome}
            placeholder = "Pesquisar por..."
            onChangeText = {()=>pesquisarPorBloco(`${disciplina.nome}`)}
            autoCapitalize = {'words'}
            keyboardType = {'default'}
          />
          </View>          
            <FontAwesome name="search" style={theme.icon_actionbox} />
        </View>
        <FlatList
          data={dados}
          renderItem={({ item }) => (
            <View style={theme.subcontainer_disc}>
              <View style={{flex: 1}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', margin: 10}}>
                  Nome: {item.nome}
                </Text>
              </View>
              <View>
                <TouchableOpacity key={item.key}  style={{margin: 15}} onPress={()=>{ detetarDisc(item.key) } }>
                  <FontAwesome name="trash" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={{margin: 15}} onPress={()=>navigation.navigate('TelaCadastrarDisciplina', {edit: true, key: item.key})}>
                  <FontAwesome name="pencil" size={25} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    </View>
  )

  function pesquisarPorBloco(DescParaPesquisa){
    if( DescParaPesquisa !='' ){
        setDisciplina(val => {disciplina.nome = val})
        setDados([])
          try {
            ref.orderByChild('nome').equalTo(`${DescParaPesquisa}`).once("value", function(snapshot) {
              if(snapshot.val()){
                let datalist= []
                snapshot.forEach((e) => {
                  datalist.push({key: e.key, ...e.val()})
                })
                setDados(datalist)
              }
            })
          } catch (error){
            console.log(error)
          }
    }  
  }

  async function detetarDisc(id){
    Alert.alert('Atenção','Deseja realmente excluir esta disciplina?',
        [
          { text: 'Cancelar' },
          {
            text: 'Sim',
            onPress: () => {
              db.ref('disciplinas/')
              .child(`${id}`)
              .remove().then(() =>{ 
                getDisciplinaInitial()
                })                
            },
          },
        ],
        { cancelable: true } 
      )
  }

  async function getDisciplinaInitial() {
    setLoading(true)
    setDados([])
    //const ref = db.ref('disciplina')
      try {
        let res = await ref.orderByChild('nome').once('value')
          if(res.val()){
            let datalist= []
            res.forEach((e) => {
              datalist.push({key: e.key, ...e.val()})
            })
            setDados(datalist)
          }else{
            Alert.alert('Não existem disciplinas cadastrados.')
          }
      } catch (error) {
        Alert.alert('Atenção', `${error}`)
      }
    setLoading(false)
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

