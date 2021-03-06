import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, TextInput } from 'react-native';
import Constants from 'expo-constants';
import MapView, { Marker, Polyline } from 'react-native-maps'
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import firebase from 'firebase'
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'; 

import {theme} from '../../themes/darkTheme'

export default function TelaConfigurarLocais({ navigation }) {
  const db = firebase.database()

  const [local, setLocal] = useState({titulo: 'Salas multiuso', tipoLocal: 'Sala multiuso', referencia: 'locais_salas'})
  const [bloco, setBloco] = useState('')
  const [dados, setDados] = useState([])
  const [dadosDropDownBlocos, setDadosDropDownBlocos] = useState([
    {value: 'A'},
    {value: 'B'},
    {value: 'C'},
    {value: 'D'},
    {value: 'E'},
    {value: 'F'},
    {value: 'G'},
  ])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    getLocalInitial()
  }, [])

  
  return (
    <View style={theme.container}>
      <View style={theme.header}>
        <Text style={theme.text_header}>{local.titulo}</Text>
      </View>
      <View style={theme.content}>
        <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
          <View style={theme.dropdown}>
            <View style={theme.dropdown}>
              <Dropdown
                label='Bloco *'
                value={bloco}
                data={dadosDropDownBlocos}
                onChangeText={texto => setBloco(texto)}
              />
            </View>
          </View>
          <TouchableOpacity onPress={()=>pesquisarPorBloco(`${bloco}`)} style={theme.small_buttons}>
            <FontAwesome name="search" style={theme.icon_actionbox} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>refresh()} style={theme.small_buttons}>
            <FontAwesome name="refresh" style={theme.icon_actionbox}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('TelaCadastrarLocal')} style={theme.small_buttons}>
            <FontAwesome name="plus" style={theme.icon_actionbox}/>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'space-evenly', marginTop: -20}}>
        <TouchableOpacity onPress={()=>mudarReferencia('Estacionamentos', 'Estacionamento', 'locais_estacionamentos')} style={theme.small_buttons}>
            <FontAwesome5 name="parking" style={theme.icon_actionbox} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>mudarReferencia('Servi??os', 'Servi??os', 'locais_servicos')} style={theme.small_buttons}>
            <FontAwesome name="bullhorn" style={theme.icon_actionbox}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>mudarReferencia('Entradas', 'Entradas', 'locais_entradas')} style={theme.small_buttons}>
            <FontAwesome name="arrow-circle-up" style={theme.icon_actionbox} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>mudarReferencia('Salas multiuso', 'Sala multiuso', 'locais_salas')} style={theme.small_buttons}>
            <MaterialCommunityIcons name="google-classroom" style={theme.icon_actionbox} />
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        <FlatList
          data={dados}
          renderItem={({ item }) => (
            <View style={theme.subcontainer}>
              <View style={{flex: 1}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', margin: 10}}>
                  Nome: {item.nomeLocal}
                </Text>
                <Text style={{fontSize: 15, marginLeft: 10}}>
                  Local: bloco {item.bloco} - {item.andar}
                </Text>
                <Text style={{fontSize: 15, marginLeft: 10}}>
                  Capacidade: {item.capacidade}
                </Text>
                <Text style={{fontSize: 15, marginLeft: 10}}>
                  Descri????o: {item.descricao || 'Sem descri????o'}
                </Text>
                <MapView style={{ margin: 10, width: 200, height: 100 }}
                  initialRegion={{latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude), latitudeDelta: 0.001,longitudeDelta: 0.001}}
                  liteMode={true}
                >
                  <Marker
                    key={item.key}
                    coordinate={{latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude)}}
                    pinColor={item.corDoMarkador}
                  />
                </MapView>
              </View>
              <View>
                <TouchableOpacity style={{margin: 15}} onPress={()=>delLocal(item.key)}>
                  <FontAwesome name="trash" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={{margin: 15}} onPress={()=>navigation.navigate('TelaEditarLocal', {tipoLocal: `${local.tipoLocal}`, key: item.key})}>
                  <FontAwesome name="pencil" size={25} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>

    </View>
  );

  function refresh(){
    getLocalInitial()
    setBloco('')
  }

  function pesquisarPorBloco(blocoParaPesquisa){
    setLoading(true)
      if(blocoParaPesquisa==''){
        Alert.alert('Aten????o', 'Selecione algum bloco.')
      }else{
        setDados([])
        const ref = db.ref(`${local.referencia}`)
          try {
            ref.orderByChild('bloco').equalTo(`${blocoParaPesquisa}`).once("value", function(snapshot) {
              if(snapshot.val()){
                let datalist= []
                snapshot.forEach((e) => {
                  datalist.push({key: e.key, ...e.val()})
                })
                setDados(datalist)
              }else{
                Alert.alert('Aten????o', 'N??o existem locais cadastrados nesse bloco.')
              }
            })
          } catch (error) {
            console.log(error)
            Alert.alert('Aten????o', 'Erro a carregar o local')
          }
      }
    setBloco('')
    setLoading(false)
  }

  function mudarReferencia(titulo, tipo, refer){
    setLocal({})  
      try {
        setLocal({titulo: titulo, tipoLocal: tipo, referencia: refer})
      } catch (error) {
        console.log(error)
        Alert.alert('Aten????o', 'Erro a carregar o local')
      }
    getLocalAfter(refer)
  }

  async function getLocalAfter(refer) {
    setLoading(true)
    setDados([])
    const ref = db.ref(`${refer}`)
      try {
        let res = await ref.orderByChild('bloco').once('value')
          if(res.val()){
            let datalist= []
            res.forEach((e) => {
              datalist.push({key: e.key, ...e.val()})
            })
            setDados(datalist)
          }else{
            Alert.alert('Aten????o', 'N??o existem locais cadastrados.')
          }
      } catch (error) {
        Alert.alert('Aten????o', `${error}`)
      }
    setLoading(false)
  }

  async function getLocalInitial() {
    setLoading(true)
    setDados([])
    const ref = db.ref(`${local.referencia}`)
      try {
        let res = await ref.orderByChild('bloco').once('value')
          if(res.val()){
            let datalist= []
            res.forEach((e) => {
              datalist.push({key: e.key, ...e.val()})
            })
            setDados(datalist)
          }else{
            Alert.alert('Aten????o', 'N??o existem locais cadastrados.')
          }
      } catch (error) {
        Alert.alert('Aten????o', `${error}`)
      }
    setLoading(false)
  }

  async function delLocal(id){
    setLoading(true)
    let referencia = 'locais_salas'
      if(local.tipoLocal=='Sala multiuso'){
        referencia = 'locais_salas'
      }else if(local.tipoLocal=='Servi??os'){
        referencia = 'locais_servicos'
      }else if(local.tipoLocal=='Estacionamento'){
        referencia = 'locais_estacionamentos'
      }else if(local.tipoLocal=='Entradas'){
        referencia = 'locais_entradas'
      }else{
        Alert.alert('Aten????o', 'Tipo n??o reconhecido.')
      }
    let ref = db.ref(`${referencia}`)
      try {
        Alert.alert('Aten????o','Deseja realmente excluir este local?',
          [
            { text: 'Cancelar' },
            {
              text: 'Sim',
              onPress: () => {
                ref.child(`${id}`).remove()
                getLocalInitial()
              },
            },
          ],
          { cancelable: true }
        )
      } catch (error) {
        Alert.alert('Aten????o', `${error}`)
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
  containerBotaoPesquisar: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  containerDropDown: {
    width: 70,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  containerDosDados:{
    borderBottomWidth: 2,
    width: 70,
    borderColor: '#e0ebeb',
    borderRadius: 10,
    alignSelf: 'center',
  },
  containerBotaoRefresh: {
    width: 50,
    height: 50,
    backgroundColor: '#dae6c2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: '#284474',
    borderWidth: 1,
    margin: 5,
    marginLeft: 8,
    marginTop: 15,
  },
  containerBotaoAdicionar: {
    width: 50,
    height: 50,
    backgroundColor: '#dae6c2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: '#284474',
    borderWidth: 1,
    margin: 5,
    marginTop: 15,
  },
  containerBotoesLocais: {
    width: 50,
    height: 50,
    backgroundColor: '#dae6c2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: '#284474',
    borderWidth: 1,
    margin: 5,
  },
  containerDeDados:{
    margin: 15,
    marginTop: 15,
    marginBottom: 10,
    borderColor: 'black',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    maxHeight: '70%'
  },
  containerSalas:{
    flexDirection: 'row',
    margin: 5,
    backgroundColor: '#ffffff',
    width: 300,
    height: 280,
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 3,
    alignItems: 'center',
  },
  botaoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titulo: {
    marginTop: 30,
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
    margin: 5,
  },
});

