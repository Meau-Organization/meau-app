import { FlatList, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from 'expo-constants';

import { getAuth, db, collection, query, where, getDocs } from '../configs/firebaseConfig';
import { useCallback, useEffect, useState } from "react";
import ModalLoanding from "../components/ModalLoanding";
import { useFocusEffect } from "@react-navigation/native";
import AvisoCadastro from "./AvisoCadastro";
import CardAnimal from "../components/CardAnimal";


export default function MeusPets() {

    const [modal, setModal] = useState(true);

    const [meusPets, setMeusPets]  = useState([]);

    const buscarMeusPets = async (usuario_id : string) => {

        try {
            const animalsRef = collection(db, 'Animals');

            const q = query(animalsRef, where('usuario_id', '==', usuario_id));

            const snapshot = await getDocs(q);
            const meus_pets = [];

            snapshot.forEach((doc) => {
                meus_pets.push({ uid: doc.id, ...doc.data() });
                //console.log(doc.id, " => ", doc.data());
            });

            setMeusPets(meus_pets);

            setEsperando(false);

        } catch(error) {
            setEsperando(false);
            console.log(error);
        }
    };

    const [currentUser, setCurrentUser] = useState(null);
    const [esperando, setEsperando] = useState(true);

    useFocusEffect(
        useCallback(() => {
            
            const user = getAuth().currentUser;

            setCurrentUser(user);

            if (user) {
                console.log("Logado - Pagina Meus Pets");
                buscarMeusPets(user.uid);

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

        //console.log(meusPets[0].imagemBase64);

        return(
            <ScrollView style={{backgroundColor: '#fafafa'}}>
                <View style={styles.container}>

                    {meusPets.map((animal, index : number) => (
                        
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
                                trocaIcone={true}
                                id={animal.uid}
                                foto = {{uri: `data:${animal.imagemBase64.assets[0].mimeType};base64,${animal.imagemBase64.assets[0].base64}`}}
                                tela={"DetalhesAnimal"}
                            />

                        </View>
                    ))}

                    <View style={{marginTop:20, backgroundColor: 'rgba(0, 0, 0, 0)', width: '80%', height: 100}}></View>



                </View>
            </ScrollView>


        );

    } else {
        if (esperando) {
            return (
                <Modal visible={esperando && modal} animationType='fade' transparent={true}>
                    <ModalLoanding spinner={esperando} />
                </Modal>
            );

        } else {
            return <AvisoCadastro topbar={false} />;
        }

    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'center',
    },
});