import React, {useState, useEffect} from 'react';
import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import firebase from 'firebase'
import { FontAwesome } from '@expo/vector-icons'; 
import {theme} from '../../themes/darkTheme'
import * as Location from 'expo-location';


export default function TelaCadastrarLocal({ navigation }) {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const db = firebase.database()

  const [local, setLocal] = useState({
    tipoLocal: 'Sala multiuso',
    capacidade: '',
    bloco: '',
    andar: '',
    nomeLocal: '',
    descricao: '',
    latitude: '',
    longitude: '',
    corDoMarkador: '',
    })
  const [loading, setLoading] = useState(false)
  const [dadosDropDownBlocos, setDadosDropDownBlocos] = useState([
    {value: 'A'},
    {value: 'B'},
    {value: 'C'},
    {value: 'D'},
    {value: 'E'},
    {value: 'F'},
    {value: 'G'},
  ])
  const [dadosDropDownAndares, setDadosDropDownAndares] = useState([
    {value: 'Súbsolo'},
    {value: 'Térreo'},
    {value: '1º andar'},
    {value: '2º andar'},
    {value: '3º andar'},
    {value: '4º andar'},
  ])
  const [dadosDropDownTipoLocal, setDadosDropDownTipoLocal] = useState([
    {value: 'Sala multiuso'},
    {value: 'Serviços'},
    {value: 'Entradas'},
    {value: 'Estacionamento'},
  ])

  return (
    <View style={theme.container}>
      <View style={theme.header}>
        <Text style={theme.text_header}>Cadastrar local</Text>
      </View>
      <View style={theme.content}>
        <View style={{justifyContent:'flex-start', marginTop: 15}}>
          <View style={Styles.containerDropDown}>
            <Dropdown
              label='Tipo de local *'
              value={local.tipoLocal}
              data={dadosDropDownTipoLocal}
              onChangeText={texto => setLocal({...local, tipoLocal: texto})}
            />
          </View>
          <View style={Styles.containerDosDados}>
            <TextInput
              style={{height: 40}}
              value={local.capacidade}
              placeholder="Capacidade"
              onChangeText={texto => setLocal({...local, capacidade: texto})}
              maxLength={4}
              keyboardType={'number-pad'}
            />
          </View>
          <View style={Styles.containerDropDown}>
            <Dropdown
              label='Letra do bloco *'
              value={local.bloco}
              data={dadosDropDownBlocos}
              onChangeText={texto => setLocal({...local, bloco: texto})}
            />
          </View>
          <View style={Styles.containerDropDown}>
            <Dropdown
              label='Andar do local *'
              value={local.andar}
              data={dadosDropDownAndares}
              onChangeText={texto => setLocal({...local, andar: texto})}
            />
          </View>
          <View style={Styles.containerDosDados}>
            <TextInput
              style={{height: 40}}
              value={local.nomeLocal}
              placeholder="Nome do local *"
              onChangeText={texto => setLocal({...local, nomeLocal: texto})}
              maxLength={50}
            />
          </View>
          <View style={Styles.containerDosDados}>
            <TextInput
              value={local.descricao}
              placeholder="Descrição"
              onChangeText={texto => setLocal({...local, descricao: texto})}
              maxLength={115}
              multiline={true}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={Styles.containerBotaoLocalizacao} onPress={()=>getLatitude()}>
              <FontAwesome name="map-marker" size={25} color="#f21111" />
            </TouchableOpacity>
            <View style={Styles.containerDosDadosMetade}>
              <TextInput
                style={{height: 40, textAlign: 'center'}}
                value={local.latitude}
                placeholder="Latitude *"
                keyboardType={'number-pad'}
                maxLength={15}
                onChangeText={texto => setLocal({...local, latitude: texto})}
              />
            </View>
            <View style={Styles.containerDosDadosMetade}>
              <TextInput
                style={{height: 40, textAlign: 'center'}}
                value={local.longitude}
                placeholder="Longitude *"
                maxLength={15}
                onChangeText={texto => setLocal({...local, longitude: texto})}
                keyboardType={'number-pad'}
              />
            </View>
            <TouchableOpacity style={Styles.containerBotaoLocalizacao} onPress={()=>getLongitude()}>
              <FontAwesome name="map-marker" size={25} color="#f21111" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: -100, justifyContent: 'space-evenly'}}>
        <TouchableOpacity style={theme.usual_button} onPress={()=>navigation.goBack()}>
          <Text style={theme.text_usual_button}>Retornar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={theme.usual_button} onPress={()=>inserirNovoLocal()}>
          <Text style={theme.text_usual_button}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator animating={loading} size="large" color="#0000ff" />}
    </View>
  )

  function limparCampos(){
    setLocal({
      tipoLocal: 'Sala multiuso',
      capacidade: '',
      bloco: '',
      andar: '',
      nomeLocal: '',
      descricao: '',
      latitude: '',
      longitude: '',
      corDoMarkador: '',
    })
  }

  async function getLatitude() {
    setLocal({...local, latitude: JSON.stringify(location.coords.latitude)})
  }

  async function getLongitude() {
    setLocal({...local, longitude: JSON.stringify(location.coords.longitude)})
  }

  function inserirNovoLocal() {
    if(local.bloco=='' || local.andar=='' || local.nomeLocal=='' || local.latitude=='' || local.longitude==''){
      Alert.alert('Atenção', 'Você precisa preencher todos os campos.')
    }else{
      if(local.capacidade==''){
        if(local.tipoLocal=='Sala multiuso'){
          metodoInserirLocal('blue', 'locais_salas')
        }else if(local.tipoLocal=='Serviços'){
          metodoInserirLocal('red', 'locais_servicos')
        }else if(local.tipoLocal=='Estacionamento'){
          metodoInserirLocal('tan', 'locais_estacionamentos')
        }else if(local.tipoLocal=='Entradas'){
          metodoInserirLocal('green', 'locais_entradas')
        }else{
          Alert.alert('Atenção', 'Tipo não reconhecido.')
        }
      }else{
        if(local.capacidade<=0){
          Alert.alert('Atenção', 'A capacidade tem que ser maior de 1.')
        }else{
          if(local.tipoLocal=='Sala multiuso'){
            metodoInserirLocal('blue', 'locais_salas')
          }else if(local.tipoLocal=='Serviços'){
            metodoInserirLocal('red', 'locais_servicos')
          }else if(local.tipoLocal=='Estacionamento'){
            metodoInserirLocal('tan', 'locais_estacionamentos')
          }else if(local.tipoLocal=='Entradas'){
            metodoInserirLocal('green', 'locais_entradas')
          }else{
            Alert.alert('Atenção', 'Tipo não reconhecido.')
          }
        }
      }
    }
  }

  async function metodoInserirLocal(corMarkador, referencia){
    setLoading(true)
      if(local.tipoLocal=='Sala multiuso' && local.descricao==''){
        setLocal({...local, descricao: `Bloco e número: ${local.nomeLocal}, ${local.andar}.`})
      }
    let ref = db.ref(`${referencia}`)
    const res = await ref.push({
          tipoLocal: local.tipoLocal,
          capacidade: local.capacidade,
          bloco: local.bloco,
          andar: local.andar,
          nomeLocal: local.nomeLocal,
          descricao: local.descricao,
          longitude: local.longitude,
          latitude: local.latitude,
          corDoMarkador: `${corMarkador}`,
        })
        .then((res) => {
          Alert.alert('Sucesso', `Cadastro efetuado com sucesso`)
          limparCampos()
        })
        .catch((err) => {
          console.log(err)
          Alert.alert('Falha no sistema', 'Erro ao inserir novo local.')
        })
        .finally(() => setLoading(false))
  }
}

const Styles = StyleSheet.create({
  containerBotaoLocalizacao: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
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
  containerDosDados: {
    margin: 10,
    borderBottomWidth: 2,
    width: 300,
    borderColor: '#e0ebeb',
    borderRadius: 10,
    alignSelf: 'center',
  },
  containerDosDadosMetade: {
    marginTop: 5,
    borderBottomWidth: 2,
    width: 120,
    borderColor: '#e0ebeb',
    borderRadius: 10,
    alignSelf: 'center',
  },
  containerDoDropDown: {
    margin: 10,
    width: 300,
    alignSelf: 'center',
  },
  
});

