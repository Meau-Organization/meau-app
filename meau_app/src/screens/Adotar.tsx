import { ActivityIndicator, FlatList, ImageBackground, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from 'expo-constants';

import { getAuth, db, doc, getDoc, collection, query, where, getDocs } from '../configs/firebaseConfig';
import { useCallback, useEffect, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import AvisoCadastro from "./AvisoCadastro";
import ModalLoanding from "../components/ModalLoanding";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CardAnimal from "../components/CardAnimal";


export default function Adotar() {

    //console.log("statusbar: " + Constants.statusBarHeight);

    const [currentUser, setCurrentUser] = useState(null);

    const [esperando, setEsperando] = useState(true);
    const [modal, setModal] = useState(true);

    const [animais, setAnimais]  = useState([]);

    const buscarAnimais = async () => {

        try {
            const animalsRef = collection(db, 'Animals');

            const q = query(animalsRef);

            const snapshot = await getDocs(q);
            const animaisArray = [];

            snapshot.forEach((doc) => {
                animaisArray.push({ uid: doc.id, ...doc.data() });
                // uid (nome personalizado)
                //console.log(doc.id, " => ", doc.data());
            });

            setAnimais(animaisArray);

            setEsperando(false);

        } catch(error) {
            setEsperando(false);
            console.log(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            
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
        // console.log(animais[0].imagemBase64.assets[0].base64);
        // console.log(animais[0].imagemBase64.assets[0].mimeType);

        return(
            <ScrollView style={{backgroundColor: '#fafafa'}}>
                <View style={styles.container}>
                    
                    {animais.map((animal, index : number) => (
                        
                        <View key={animal.uid} style={{ flexDirection: 'row',  width: '95.5%' }}>
                            
                            <CardAnimal
                                primeiro={ index == 0 ? true : false}
                                modo={'space-between'}
                                nome={animal.nomeAnimal}
                                sexo={animal.sexo}
                                idade={animal.idade}
                                porte={animal.porte}
                                cidade={animal.cidade}
                                estado={animal.estado}
                                id={animal.uid}
                                imagem={animal.imagemBase64}
                            />

                        </View>
                    ))}

                    <View style={{marginTop:20, backgroundColor: 'rgba(0, 0, 0, 0)', width: '80%', height: 100}}></View>



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