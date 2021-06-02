import React, {useState} from 'react'
import { TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { claro } from '../scenes/cores'
import DateTimePickerModal from "react-native-modal-datetime-picker";

export function CustomDateTime(props) {
    const { title, type } = props
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [valor, setValor] = useState("");

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (data) => {
        fortamata(data);
        hideDatePicker();
    };

    const fortamata = (data) => {
        console.log(type)
        { type == "time" ? horario(data) : Data(data) }
    }

    function horario(data){
        let horas = data.getHours().toString();
        let minutos = data.getMinutes().toString();
        let segundos = data.getSeconds().toString();
        let dataTime = "";

        { horas.length === 2 ? null : horas = "0" + horas }
        { minutos.length === 2 ? null : minutos = "0" + minutos }
        { segundos.length === 2 ? null : segundos = "0" + segundos }

        dataTime = horas + ":" + minutos + ":" + segundos
        console.log(dataTime);
        setValor(dataTime);
    }

    function Data(data) {
        let ano = data.getFullYear().toString();
        let mes = data.getMonth().toString();
        let dia = data.getDate().toString();
        let dataFormatada = "";

        { mes.length === 2 ? null : mes = "0" + mes }
        { dia.length === 2 ? null : dia = "0" + dia }

        dataFormatada = dia + "/" + mes + "/" + ano
        console.log(dataFormatada);
        setValor(dataFormatada);
    }

    return (
        <TouchableOpacity onPress={showDatePicker}>
            <View style={Styles.form}>
                <Text>{title}</Text>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode={type}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                <TextInput
                    value={valor}
                    editable={false}
                />
            </View>
        </TouchableOpacity>
    )
}

const Styles = StyleSheet.create({
    form: {
        margin: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: claro,
    },

    input: {
        height: 40,
        backgroundColor: claro,
    }
});
