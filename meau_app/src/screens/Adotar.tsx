import { useCallback, useState } from "react";
import CardAnimal from "../components/CardAnimal";
import ModalLoanding from "../components/ModalLoanding";
import { useFocusEffect } from "@react-navigation/native";
import { db, collection, query, where, getDocs } from '../configs/FirebaseConfig';
import { FlatList, Modal, StyleSheet, Text, View } from "react-native";
import { useAutenticacaoUser } from '../assets/contexts/AutenticacaoUserContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useLoading from '../hooks/useLoading';
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Adotar() {

    //console.log("statusbar: " + Constants.statusBarHeight);

    const Loanding = useLoading();

    const [animais, setAnimais] = useState([]);

    const { user } = useAutenticacaoUser();

    const buscarAnimais = async () => {

        try {
            const animalsRef = collection(db, 'Animals');

            const q = query(animalsRef, where('disponivel', '==', true));



            const snapshot = await getDocs(q);
            const animaisArray = [];

            snapshot.forEach((doc) => {
                const animalData = doc.data();

                const interessadosIds = animalData.interessados || [];

                // Se o id do user online esta na lista de interessados, então o pet é um favorito dele
                const isFavorito = interessadosIds.find((interessadoId) => user ? interessadoId ===  user.uid : interessadoId ===  '');

                const dadosAnimal = {
                    uid: doc.id,
                    ...animalData,
                    curtido: !!isFavorito
                };

                animaisArray.push(dadosAnimal);
            });

            setAnimais(animaisArray);

            Loanding.setPronto();

        } catch (error) {
            Loanding.setPronto();
            console.log(error);
        }
    };

    useFocusEffect(
        useCallback(() => {

            Loanding.setCarregando();

            buscarAnimais();

            return () => {
                setAnimais([]);
                Loanding.setParado();
                console.log('Tela perdeu foco');
            };

        }, [])
    );




    return (


        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor='#ffd358' />

            { Loanding.Pronto ?

                <FlatList
                    data={animais}
                    keyExtractor={item => item.uid}
                    renderItem={({ item }) => (
                        <View key={item.uid} style={{ flexDirection: 'row', width: '95.5%' }}>

                            <CardAnimal
                                idAnimal={item.uid}
                                nome={item.nomeAnimal}
                                tela={"DetalhesAnimalAdocao"}
                                foto={{ uri: `data:${"image/" + (item.imagemComprimidaBase64 ? item.imagemComprimidaBase64.uri.split('.').pop() : '' || 'unknown')};base64,${item.imagemComprimidaBase64 ? item.imagemComprimidaBase64.base64 : ''}` }}
                                modo={'space-between'}
                                sexo={item.sexo}
                                idade={item.idade}
                                porte={item.porte}
                                cidade={item.cidade}
                                estado={item.estado}
                                disponivel={item.disponivel}
                                idDono={item.usuario_id}
                                foiCurtido={item.curtido}
                            />

                        </View>

                    )}
                    contentContainerStyle={{ backgroundColor: '#fafafa', alignItems: 'center' }}
                    ListEmptyComponent={

                        <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 12, width: '80%', marginTop: 100 }}>
                            <MaterialIcons name="pets" size={48} color="rgba(0, 0, 0, 0.10)" />
                            <Text style={{ marginLeft: 8, fontSize: 16, fontFamily: 'Roboto-Medium', width: 120, color: 'rgba(0, 0, 0, 0.15)', backgroundColor: '' }} >Nada por aqui...</Text>
                        </View>

                    }
                    ListFooterComponent={<View style={{ marginTop: 20, backgroundColor: 'rgba(0, 0, 0, 0)', width: '80%', height: 100 }} />}
                />

                :
                <Modal visible={Loanding.Carregando} animationType='fade' transparent={true}>
                    <ModalLoanding spinner={Loanding.Carregando} />
                </Modal>
            }
        </View>
    );


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        //borderWidth: 1
    },
});