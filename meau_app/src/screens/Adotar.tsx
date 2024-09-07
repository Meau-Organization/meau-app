import Constants from 'expo-constants';
import { useCallback, useState } from "react";
import CardAnimal from "../components/CardAnimal";
import ModalLoanding from "../components/ModalLoanding";
import { useFocusEffect } from "@react-navigation/native";
import { db, collection, query, where, getDocs } from '../configs/FirebaseConfig';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Adotar() {

    //console.log("statusbar: " + Constants.statusBarHeight);

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
            buscarAnimais();

            return () =>  {
                //console.log('Tela perdeu foco');
            };

        }, [])
    );


    if (!esperando) {

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
                                usuarioId={animal.usuario_id}
                            />

                        </View>
                    ))}

                    <View style={{ marginTop: 20, backgroundColor: 'rgba(0, 0, 0, 0)', width: '80%', height: 100 }}></View>

                    <TouchableOpacity></TouchableOpacity>

                </View>
            </ScrollView>


        );

    } else {

        return (
            <Modal visible={esperando && modal} animationType='fade' transparent={true}>
                <ModalLoanding spinner={esperando} />
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
        //borderWidth: 1
    },
});