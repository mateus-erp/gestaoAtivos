import React, {useState, useEffect} from 'react'
import { View, Dimensions, ScrollView, Alert, Switch, StyleSheet, TouchableOpacity, Text, ActivityIndicator, AsyncStorage } from 'react-native'
import Constants from 'expo-constants';
import firebase from 'firebase'

import { theme } from '../../themes/darkTheme';

import { CustomDate } from '../../components/CustomDate';
import { CustomTime } from '../../components/CustomTime';

export default function TelaReservarEquipamento({ navigation }){
    const db = firebase.database()
    const ref = db.ref('reservas_equipamentos/')
    
    const [reserva, setReserva] = useState({
        tipoDeReserva: 'Equipamento',
        situacao: 'Em análise',
        solicitante: '',
        dataRetirada: '',
        horaRetirada: '',
        adaptadorMacbook: false,
        adaptadorVGA: false,
        caixaDeSom: false,
        datashow: false,
        filtroDeLinha: false,
        mouse: false,
        notebook: false
    })
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
                <Text style={theme.text_header}>Solicitar equipamento</Text>
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
                        value={date}
                    />
                    <CustomTime
                    onPress={showTimePicker}
                    title="Horário"
                    type="time"
                    placeholder="Informe o Horário"
                    isVisible={isTimeVisible}
                    onConfirm={handleConfirmTime}
                    onCancel={hideDatePicker}
                    value={hora}
                    />
                </View>
                
                <ScrollView style={{maxHeight: 300, marginTop: -75}}>
                    <View style={Styles.containerSwitch}>
                        <Switch
                            trackColor={{ false: "#c0c4bc", true: "#799E34" }}
                            thumbColor={reserva.adaptadorMacbook ? "#6FDE0E" : "#6f706e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => alterarValor('adaptadorMacbook')}
                            value={reserva.adaptadorMacbook}
                        />
                        <Text style={theme.text_actionbox}>Adaptador para Macbook</Text>
                    </View>
                    <View style={Styles.containerSwitch}>
                        <Switch
                            trackColor={{ false: "#c0c4bc", true: "#799E34" }}
                            thumbColor={reserva.adaptadorVGA ? "#6FDE0E" : "#6f706e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => alterarValor('adaptadorVGA')}
                            value={reserva.adaptadorVGA}
                        />
                        <Text style={theme.text_actionbox}>Adaptador VGA</Text>
                    </View>
                    <View style={Styles.containerSwitch}>
                        <Switch
                            trackColor={{ false: "#c0c4bc", true: "#799E34" }}
                            thumbColor={reserva.caixaDeSom ? "#6FDE0E" : "#6f706e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => alterarValor('caixaDeSom')}
                            value={reserva.caixaDeSom}
                        />
                        <Text style={theme.text_actionbox}>Caixa de som</Text>
                    </View>
                    <View style={Styles.containerSwitch}>
                        <Switch
                            trackColor={{ false: "#c0c4bc", true: "#799E34" }}
                            thumbColor={reserva.datashow ? "#6FDE0E" : "#6f706e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => alterarValor('datashow')}
                            value={reserva.datashow}
                        />
                        <Text style={theme.text_actionbox}>Datashow</Text>
                    </View>
                    <View style={Styles.containerSwitch}>
                        <Switch
                            trackColor={{ false: "#c0c4bc", true: "#799E34" }}
                            thumbColor={reserva.filtroDeLinha ? "#6FDE0E" : "#6f706e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => alterarValor('filtroDeLinha')}
                            value={reserva.filtroDeLinha}
                        />
                        <Text style={theme.text_actionbox}>Filtro de Linha</Text>
                    </View>
                    <View style={Styles.containerSwitch}>
                        <Switch
                            trackColor={{ false: "#c0c4bc", true: "#799E34" }}
                            thumbColor={reserva.mouse ? "#6FDE0E" : "#6f706e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => alterarValor('mouse')}
                            value={reserva.mouse}
                        />
                        <Text style={theme.text_actionbox}>Mouse</Text>
                    </View>
                    <View style={Styles.containerSwitch}>
                        <Switch
                            trackColor={{ false: "#c0c4bc", true: "#799E34" }}
                            thumbColor={reserva.notebook ? "#6FDE0E" : "#6f706e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => alterarValor('notebook')}
                            value={reserva.notebook}
                        />
                        <Text style={theme.text_actionbox}>Notebook</Text>
                    </View>
                </ScrollView>
                <View style={Styles.botaoContainer}>
                    <TouchableOpacity style={theme.usual_button} onPress={()=>navigation.goBack()}>
                    <Text style={theme.text_usual_button}>Retornar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={theme.usual_button} onPress={()=>inserirNovaReserva()}>
                    <Text style={theme.text_usual_button}>Reservar</Text>
                    </TouchableOpacity>
                </View>
                {loading && <ActivityIndicator animating={loading} size="large" color="#0000ff" />}
            </View>
        </View>
    )

    function alterarValor(nome) {
        setReserva({ ...reserva, [nome]: !reserva[nome] })
    }

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
    }

    function inserirNovaReserva() {
        if(reserva.dataRetirada==''){
          Alert.alert('Atenção', 'Você precisa escolher uma data.')
        }else{
            if(reserva.horaRetirada==''){
                Alert.alert('Atenção', 'Você precisa escolher uma data.')
            }else{
                if(reserva.adaptadorMacbook==false && reserva.adaptadorVGA==false && reserva.caixaDeSom==false
                    && reserva.datashow==false && reserva.filtroDeLinha==false && reserva.mouse==false && reserva.notebook==false){
                    Alert.alert('Atenção', 'Você precisa selecionar pelo menos um equipamento.')
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
            dataRetirada: reserva.dataRetirada,
            horaRetirada: reserva.horaRetirada,
            adaptadorMacbook: reserva.adaptadorMacbook,
            adaptadorVGA: reserva.adaptadorVGA,
            caixaDeSom: reserva.caixaDeSom,
            datashow: reserva.datashow,
            filtroDeLinha: reserva.filtroDeLinha,
            mouse: reserva.mouse,
            notebook: reserva.notebook,
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
    containerSwitch: {
        flexDirection: 'row',
        marginTop: -15,
        alignItems: 'center',
    },
    imagemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerDosDados: {
        margin: 15,
        borderBottomWidth: 2,
        width: 150,
        borderColor: '#e0ebeb',
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
    textoBotaoCadastrar: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    }
})