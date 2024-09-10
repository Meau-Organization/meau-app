import { useCallback, useState } from "react";
import ModalLoanding from "../components/ModalLoanding";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, Modal, StyleSheet, Text, View } from "react-native";
import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";
import CardAnimal from '../components/CardAnimal';
import { buscarDadosFavoritos } from '../utils/UtilsDB';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useLoading from '../hooks/useLoading';
import { StatusBar } from "expo-status-bar";

export default function Favoritos() {

    const { user, buscarDadosUsuario } = useAutenticacaoUser();

    const Loanding = useLoading();

    const [favoritos, setFavoritos] = useState([]);

    useFocusEffect(
        useCallback(() => {

            const atualizarFavoritos = async () => {
                Loanding.setCarregando();

                const retornoImediatoDadosUser = await buscarDadosUsuario(user.uid);
                if (retornoImediatoDadosUser.favoritos) {
                    await buscarDadosFavoritos(retornoImediatoDadosUser.favoritos, setFavoritos);
                }
                Loanding.setPronto();

            };
            atualizarFavoritos();

            return () => {
                setFavoritos([]);
                Loanding.setParado();
                console.log('Tela Favoritos perdeu foco');
            };

        }, [])
    );


    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor='#88c9bf' />

            {Loanding.Pronto ?
                <FlatList
                    data={favoritos}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View key={item.id} style={{ flexDirection: 'row', width: '95.5%' }}>
                            <CardAnimal
                                idAnimal={item.id}
                                nome={item.data().nomeAnimal}
                                tela={"DetalhesAnimalAdocao"}
                                foto={{ uri: `data:${"image/" + (item.data().imagemComprimidaBase64 ? item.data().imagemComprimidaBase64.uri.split('.').pop() : '' || 'unknown')};base64,${item.data().imagemComprimidaBase64 ? item.data().imagemComprimidaBase64.base64 : ''}` }}
                                modo={'space-between'}
                                sexo={item.data().sexo}
                                idade={item.data().idade}
                                porte={item.data().porte}
                                cidade={item.data().cidade}
                                estado={item.data().estado}
                                disponivel={item.data().disponivel}
                                idDono={item.data().usuario_id}
                                foiCurtido={true}
                                favoritos={favoritos}
                                setFavoritos={setFavoritos}
                                corCard='#cfe9e5'
                            />

                        </View>

                    )}
                    contentContainerStyle={{ backgroundColor: '#fafafa', alignItems: 'center' }}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 12, width: '80%', marginTop: 100 }}>
                            <MaterialIcons name="favorite-border" size={48} color="rgba(0, 0, 0, 0.10)" />
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