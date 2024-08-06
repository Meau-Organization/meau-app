import { ActivityIndicator, FlatList, ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Constants from 'expo-constants';

import { getAuth, db, doc, getDoc, collection, query, where, getDocs, updateDoc } from '../configs/firebaseConfig';
import { useCallback, useEffect, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import AvisoCadastro from "./AvisoCadastro";
import ModalLoanding from "../components/ModalLoanding";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CardAnimal from "../components/CardAnimal";

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import * as FileSystem from 'expo-file-system';

export default function Adotar() {


    //console.log("statusbar: " + Constants.statusBarHeight);

    const [currentUser, setCurrentUser] = useState(null);

    const [esperando, setEsperando] = useState(true);
    const [modal, setModal] = useState(true);

    const [animais, setAnimais] = useState([]);

    const buscarAnimais = async () => {

        try {
            const animalsRef = collection(db, 'Animals');

            const q = query(animalsRef, where('disponivel', '==', true));

            const snapshot = await getDocs(q);
            const animaisArray = [];

            snapshot.forEach((doc) => {
                animaisArray.push({ uid: doc.id, ...doc.data() });
                // uid (nome personalizado)
                //console.log(doc.id, " => ", doc.data());
            });

            setAnimais(animaisArray);

            setEsperando(false);

        } catch (error) {
            setEsperando(false);
            console.log(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setEsperando(true);

            const user = getAuth().currentUser;

            setCurrentUser(user);

            if (user) {
                console.log("Logado - Pagina Adotar");
                buscarAnimais();

            } else {
                setEsperando(false);
                console.log("SAIU");
            }

            return () => {
                //console.log('Tela perdeu foco');
            };

        }, [])
    );

    if (currentUser && !esperando) {
        // console.log("base64 comprimido: " + animais[0].imagemComprimidaBase64.base64.length + " bytes : " + animais[0].nomeAnimal);
        // console.log("base64 comprimido: " + animais[1].imagemComprimidaBase64.base64.length + " bytes : " + animais[1].nomeAnimal);
        // console.log("base64 comprimido: " + animais[2].imagemComprimidaBase64.base64.length + " bytes : " + animais[2].nomeAnimal);


        return (
            <ScrollView style={{ backgroundColor: '#fafafa' }}>
                <View style={styles.container}>

                    {animais.map((animal, index: number) => (

                        

                        <View key={animal.uid} style={{ flexDirection: 'row', width: '95.5%' }}>
                            <CardAnimal
                                id={animal.uid}
                                nome={animal.nomeAnimal}
                                tela={"DetalhesAnimalAdocao"}
                                foto={{ uri: `data:${"image/" + (animal.imagemComprimidaBase64.uri.split('.').pop() || 'unknown')};base64,${animal.imagemComprimidaBase64.base64}` }}
                                modo={'space-between'}
                                primeiro={index == 0 ? true : false}
                                sexo={animal.sexo}
                                idade={animal.idade}
                                porte={animal.porte}
                                cidade={animal.cidade}
                                estado={animal.estado}
                                disponivel={animal.disponivel}
                            />

                        </View>
                    ))}

                    <View style={{ marginTop: 20, backgroundColor: 'rgba(0, 0, 0, 0)', width: '80%', height: 100 }}></View>

                </View>
            </ScrollView>


        );

    } else {

        if (esperando)
            return (
                <Modal visible={esperando && modal} animationType='fade' transparent={true}>
                    <ModalLoanding spinner={esperando} />
                </Modal>
            );
        else
            return <AvisoCadastro topbar={false} />;

    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'center',
        //borderWidth: 1
    },
});