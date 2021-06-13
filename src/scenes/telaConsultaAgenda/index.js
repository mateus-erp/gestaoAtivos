import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import firebase from 'firebase'
import { roxo, claro, branco, escuro } from '../cores';
import { useFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Pattaya_400Regular } from '@expo-google-fonts/pattaya';
import * as SecureStore from 'expo-secure-store';

export default function TelaConsultaAgenda({ navigation }) {
    var lista;
    let [loop, setLoop] = useState(false);
    const [agenda, setAgenda] = useState([]);
    const [animating, setAnimating] = useState({ load: false });
    const db = firebase.database();
    const renderItem = (props) => {
        const { item, index } = props;
        const { key } = item;
        return (
            <View style={{ margin: 10 }}>
                <View style={Styles.box}>
                    <View style={Styles.topBox}>
                        <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 20, color: claro }}>{item.disciplina}</Text>
                    </View>
                    <Text style={[Styles.content, { fontFamily: 'Roboto_400Regular' }]}>Data: {item.dias}</Text>
                    <Text style={[Styles.content, { fontFamily: 'Roboto_400Regular' }]}>Horário: {item.horario}</Text>
                    <Text style={[Styles.content, { fontFamily: 'Roboto_400Regular' }]}>Sala: {item.sala}</Text>
                    <Text style={[Styles.content, { fontFamily: 'Roboto_400Regular' }]}>Professor: {item.professor}</Text>
                    <View style={Styles.bottomBox}>
                        <Pressable onPress={async () => deletaItem(key, index)}>
                            <Icon name="trash" size={20} color="red"></Icon>
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    }

    useEffect(() => {
        verificaAgenda();
    }, [loop])

    const Carregamento = () => {
        return (
            <View style={{ zIndex: 1, position: 'absolute', padding: 100, alignSelf: 'center' }}>
                <ActivityIndicator animating={animating.load} size="large" color={claro} />
            </View>
        )
    }

    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Pattaya_400Regular
    });

    if (!fontsLoaded) {
        return null;
    }

    async function verificaAgenda() {
        lista = [];
        setAnimating({ load: true});
        const ref = db.ref('agendas');
        try {
            const email = await SecureStore.getItemAsync("email");
            let query = await ref.orderByChild('dono').equalTo(email).on("child_added", (e) => {
                console.log("e",e);
                lista.push({ key: e.key, ...e.val() });
                setLoop(true);
            });

        } catch (error) {
            console.log(error);
        }
        setAgenda(lista);
        //console.log(agenda);
        setAnimating({ load: false });
    }

    async function deletaItem(key, index) {
        setAnimating({ load: true });
        try {
            await db.ref('/agendas/')
            .child(key)
            .remove()
            .then(() => {
                console.log("Deletou");
                lista.slice(1, index);
                verificaAgenda();
            });
        } catch(error){
            console.log(error)
        }
        setAnimating({ load: false });
    }

    return (
        <View style={Styles.container}>
            <View style={{ height: 50 }}>
                <Pressable onPress={() => navigation.navigate("TelaAluno")} style={{ position: 'absolute', margin: 10, padding: 10 }}>
                    <Icon name="chevron-left" size={20} color={escuro}></Icon>
                </Pressable>
            </View>

            {animating.load ? <Carregamento /> : null}

            <FlatList
                data={agenda}
                renderItem={renderItem}
                keyExtractor={(item, index) => String(index)}
            />
            <View style={{ height: 50, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{ color: claro, fontSize: 30, fontFamily: 'Pattaya_400Regular' }}>A</Text>
            </View>
        </View>
    )
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: roxo,
    },

    box: {
        width: 300,
        height: 200,
        backgroundColor: branco,
        alignSelf: 'center',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,

        elevation: 18,
    },

    content: {
        margin: 5,
        fontSize: 15,
    },

    topBox: {
        padding: 10,
        backgroundColor: escuro,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        alignItems: 'center',
    },

    bottomBox: {
        padding: 10,
        backgroundColor: branco,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bottom: {
        backgroundColor: claro,
        padding: 5,
        borderRadius: 20,
        position: 'absolute',
        width: 320,
        alignSelf: 'center',
    },
});


