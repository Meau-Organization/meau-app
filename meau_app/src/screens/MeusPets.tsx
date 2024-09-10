import Constants from 'expo-constants';
import { useCallback, useState } from "react";
import CardAnimal from "../components/CardAnimal";
import ModalLoanding from "../components/ModalLoanding";
import { useFocusEffect } from "@react-navigation/native";
import { Modal, StyleSheet, Text, View } from "react-native";
import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";
import { db, collection, query, where, getDocs, doc, updateDoc } from '../configs/FirebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useLoading from '../hooks/useLoading';
import { StatusBar } from 'expo-status-bar';

export default function MeusPets() {

    const { user } = useAutenticacaoUser();

    const Loanding = useLoading();

    const [meusPets, setMeusPets] = useState([]);

    useFocusEffect(
        useCallback(() => {

            Loanding.setCarregando();

            buscarMeusPets(user.uid);

            return () => {
                setMeusPets([]);
                Loanding.setParado();
                //console.log('Tela perdeu foco');
            };

        }, [])
    );

    const buscarMeusPets = async (usuario_id: string) => {

        try {
            const animalsRef = collection(db, 'Animals');

            const q = query(animalsRef, where('usuario_id', '==', usuario_id));

            const snapshot = await getDocs(q);
            const meus_pets = [];

            snapshot.forEach((doc) => {
                meus_pets.push({ uid: doc.id, ...doc.data() });
            });

            setMeusPets(meus_pets);

            Loanding.setPronto();

        } catch (error) {
            Loanding.setPronto();
            console.log(error);
        }
    };

    const updateEstadoAnimal = async (id: string, estado: boolean) => {
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

    return (

        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor='#88c9bf' />

            {Loanding.Pronto ?
                <FlatList
                    data={meusPets}
                    keyExtractor={item => item.uid}
                    renderItem={({ item }) => (
                        <View key={item.uid} style={{ flexDirection: 'row', width: '95.5%' }}>

                            <CardAnimal
                                idAnimal={item.uid}
                                nome={item.nomeAnimal}
                                tela={"DetalhesAnimal"}
                                foto={{ uri: `data:${"image/" + (item.imagemComprimidaBase64 ? item.imagemComprimidaBase64.uri.split('.').pop() : '' || 'unknown')};base64,${item.imagemComprimidaBase64 ? item.imagemComprimidaBase64.base64 : ''}` }}
                                modo={'space-around'}
                                trocaIcone={true}
                                corCard={'#cfe9e5'}
                                meusPets={true}
                                disponivel={item.disponivel}
                                updateEstadoAnimal={updateEstadoAnimal}
                                idDono={item.usuario_id}
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
                    <ModalLoanding spinner={Loanding.Carregando} cor={'#cfe9e5'} />
                </Modal>
            }

        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
});