import { FlatList, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from 'expo-constants';

import { getAuth, db, collection, query, where, getDocs, doc, updateDoc } from '../configs/firebaseConfig';
import { useCallback, useEffect, useState } from "react";
import ModalLoanding from "../components/ModalLoanding";
import { useFocusEffect } from "@react-navigation/native";
import AvisoCadastro from "./AvisoCadastro";
import CardAnimal from "../components/CardAnimal";
import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";


export default function MeusPets() {

    const { user } = useAutenticacaoUser();

    const [modal, setModal] = useState(true);

    const [meusPets, setMeusPets]  = useState([]);

    const buscarMeusPets = async (usuario_id : string) => {

        try {
            const animalsRef = collection(db, 'Animals');

            const q = query(animalsRef, where('usuario_id', '==', usuario_id));

            const snapshot = await getDocs(q);
            const meus_pets = [];

            snapshot.forEach((doc) => {
                meus_pets.push({ uid: doc.id, ...doc.data()});
            });

            setMeusPets(meus_pets);

            setEsperando(false);

        } catch(error) {
            setEsperando(false);
            console.log(error);
        }
    };

    const [esperando, setEsperando] = useState(true);

    const updateEstadoAnimal = async (id : string, estado: boolean) => {
        try {
          // Referência ao documento específico
          const documentReference = doc(db, 'Animals', id);
      
          // Atualizar o campo específico
          await updateDoc(documentReference, {
            disponivel: estado
          });
      
          console.log('Campo atualizado com sucesso!');
        } catch (error) {
          console.error('Erro ao atualizar o campo: ', error);
        }
      };

    useFocusEffect(
        useCallback(() => {

            setEsperando(true);
            
            buscarMeusPets(user.uid);

            return () => {
                //console.log('Tela perdeu foco');
            };

        }, [])
    );

    if (!esperando) {

        //console.log(meusPets[0].imagemBase64);

        return(
            <ScrollView style={{backgroundColor: '#fafafa'}}>
                <View style={styles.container}>

                    {meusPets.map((animal, index : number) => (
                        
                        <View key={animal.uid} style={{ flexDirection: 'row',  width: '95.5%' }}>
                            
                            <CardAnimal

                                id={animal.uid}
                                nome={animal.nomeAnimal}
                                tela={"DetalhesAnimal"}
                                foto={{ uri: `data:${"image/" + (animal.imagemComprimidaBase64.uri.split('.').pop() || 'unknown')};base64,${animal.imagemComprimidaBase64.base64}` }}
                                modo={'space-around'}
                                primeiro={ index == 0 ? true : false}
                                trocaIcone={true}
                                corCard={'#cfe9e5'}
                                meusPets={true}
                                disponivel={animal.disponivel}
                                updateEstadoAnimal={updateEstadoAnimal}
                            />

                        </View>
                    ))}

                    <View style={{marginTop:20, backgroundColor: 'rgba(0, 0, 0, 0)', width: '80%', height: 100}}></View>



                </View>
            </ScrollView>


        );

    } else {

        return (
            <Modal visible={esperando && modal} animationType='fade' transparent={true}>
                <ModalLoanding spinner={esperando} cor={'#cfe9e5'} />
            </Modal>
        );

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