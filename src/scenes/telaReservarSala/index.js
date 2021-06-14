import React, {useState, useEffect} from 'react'
import { View, Alert, StyleSheet, TouchableOpacity, FlatList, Text, ActivityIndicator, AsyncStorage, TextInput } from 'react-native'
import Constants from 'expo-constants';
import firebase from 'firebase'

import { theme } from '../../themes/darkTheme';

import { CustomDate } from '../../components/CustomDate';
import { CustomTime } from '../../components/CustomTime';

export default function TelaReservarSalas({ navigation }){
    const db = firebase.database()
    const ref = db.ref('reservas_salas/')
    const refer = db.ref('locais_salas/')

    const [reserva, setReserva] = useState({
        tipoDeReserva: 'Sala',
        situacao: 'Em análise',
        motivo: '',
        solicitante: '',
        dataRetirada: '',
        horaRetirada: '',
        sala: '',
    })
    const [dados, setDados] = useState([])
    const [loading, setLoading] = useState(false)

    const [isDateVisible, setDateVisibility] = useState(false);
    const [isTimeVisible, setTimeVisibility] = useState(false);
    const [hora, setHorario] = useState("");
    const [date, setDate] = useState("");
  
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
    setReserva({ ...reserva, horaRetirada: dataTime })
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
    setReserva({...reserva, dataRetirada: dataFormatada })
  }

    useEffect(() =>{
        getEmail()
    },[])

    return(
        <View style={theme.container}>
            <View style={theme.header}>
                <Text style={theme.text_header}>Solicitar sala</Text>
            </View>
            <View style={theme.content}>
                <View style={{margin: 5, flexDirection: 'row'}}>
                    <CustomDate
                        onPress={showDatePicker}
                        title="Data"
                        type="date"
                        placeholder="Informe a Data"
                        isVisible={isDateVisible}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        value={reserva.date}
                    />
                    <CustomTime
                    onPress={showTimePicker}
                    title="Horário"
                    type="time"
                    placeholder="Informe o Horário"
                    isVisible={isTimeVisible}
                    onConfirm={handleConfirmTime}
                    onCancel={hideDatePicker}
                    value={reserva.hora}
                    />
                </View>
                <View style={{borderWidth: 0.2, borderRadius: 20}}>
                    <TextInput
                        style={{height: 40, textAlign: 'center'}}
                        placeholder="Motivo"
                        value={reserva.motivo}
                        onChangeText={texto => setReserva({...reserva, motivo: texto})}
                        autoCapitalize={'sentences'}
                        maxLength={20}
                    />
                </View>
                <View style={Styles.containerFlatList}>
                    <FlatList
                        data={dados}
                        renderItem={({ item }) => (
                            <View style={{margin: -25}}>
                                <TouchableOpacity onPress={() => setReserva({...reserva, sala: item.nomeLocal})} style={theme.text_actionbox}>
                                    <Text style={theme.text_actionbox}>Sala: {item.nomeLocal}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View>
            {reserva.sala!='' && <Text style={Styles.textoDadosFlatList}>Local escolhido: {reserva.sala}</Text>}
            {loading && <ActivityIndicator animating={loading} size="large" color="#0000ff" />}
            <View style={Styles.botaoContainer}>
                <TouchableOpacity style={theme.usual_button} onPress={()=>navigation.goBack()}>
                <Text style={theme.text_usual_button}>Retornar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={theme.usual_button} onPress={()=>inserirNovaReserva()}>
                <Text style={theme.text_usual_button}>Reservar</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
    )

    async function getEmail(){
        let email = ''
            try {
               email = await AsyncStorage.getItem('@usuario')
            } catch (error) {
                console.log(error)
                Alert.alert('Atenção', 'Erro ao pegar o email do colaborador')
                navigation.goBack()
            }
        setReserva({ ...reserva, solicitante: `${email}` })
        getLocal(refer)
    }

    async function getLocal(refer) {
        setLoading(true)
        const ref = db.ref(refer)
          try {
            let res = await ref.orderByChild('nomeLocal').once('value')
              if(res.val()){
                let datalist= []
                res.forEach((e) => {
                  datalist.push({key: e.key, ...e.val()})
                })
                setDados([])
                setDados(datalist)
              }else{
                Alert.alert('Atenção', 'Não existem locais cadastrados.')
              }
          } catch (error) {
            console.log(error)
            Alert.alert('Atenção', 'Erro a carregar o local')
          }
        setLoading(false)
      }

    function inserirNovaReserva() {
        if(reserva.dataRetirada==''){
            Alert.alert('Atenção', 'Você precisa escolher uma data.')
        }else{
            if(reserva.horaRetirada==''){
                Alert.alert('Atenção', 'Você precisa escolher uma data.')
            }else{
                if(reserva.sala==''){
                    Alert.alert('Atenção', 'Você precisa escolher uma sala.')
                }else{
                    metodoInserir()
                }
            }
        }
    }

    async function metodoInserir(){
        setLoading(true)
        const res = await ref.push({
            tipoDeReserva: reserva.tipoDeReserva,
            solicitante: reserva.solicitante,
            situacao: reserva.situacao,
            motivo: reserva.motivo,
            dataRetirada: reserva.dataRetirada,
            horaRetirada: reserva.horaRetirada,
            sala: reserva.sala
        })
        .then((res) => {
            Alert.alert('Sucesso', 'Solicitação para reservar efetuada com sucesso.')
            navigation.goBack()
        })
        .catch((err) => {
            console.log(err)
            Alert.alert('Falha no sistema', 'Erro ao socilitar reserva.')
        })
        .finally(() => {
            setLoading(false)
        })
    }

}

const Styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerFlatList: {
        margin: 5,
        width:'95%',
        height:'50%',
        backgroundColor: '#fff',
        justifyContent:'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    containerBotaoFlatList: {
        width: 200,
        height: 80,
        borderRadius: 15,
        backgroundColor: '#f6f6f6',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    containerDosDados: {
        marginBottom: 5,
        borderBottomWidth: 2,
        width: 200,
        borderColor: '#000',
        borderRadius: 10,
    },
    botaoContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 8,
    },
    redimensionarLogo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        margin: 10,
    },
    textoBotaoAcessar: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },
    textoData: {
        textAlign: 'center',
        fontSize: 15,
    },
    textoDadosFlatList: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    textoBotaoCadastrar: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },
    titulo: {
        margin: 30,
        fontSize: 30,
        color: '#02246c',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    botaoCadastrar: {
        width: 160,
        height: 50,
        backgroundColor: '#002566',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        margin: 5,
    },
    botaoAcessar: {
        width: 160,
        height: 50,
        backgroundColor: '#acd54a',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        margin: 5,
    },
})