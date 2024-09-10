import { Text, View, FlatList, StyleSheet, Modal, ImageBackground, TouchableOpacity } from "react-native";

import { TopBar } from "../components/TopBar";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";
import { useCallback, useState } from "react";
import { DrawerNavigationProps, NativeStackNavigationProps } from "../utils/UtilsType";
import { buscarCampoEspecifico, buscarDadosInteressados } from "../utils/UtilsDB";
import useLoading from "../hooks/useLoading";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ModalLoanding from "../components/ModalLoanding";
import BotaoUsual from "../components/BotaoUsual";

const userPadrao = require('../assets/images/user.jpg');

interface InteressadosProps {
    route: {
        params: {
            animal_id: string;
            nome_animal: string;
            id_dono: string;
        };
    };
}

export default function Interessados({ route }: InteressadosProps) {

    const { user } = useAutenticacaoUser();

    const Loanding = useLoading();

    const navigationStack = useNavigation<NativeStackNavigationProps>();
    const navigationDrawer = useNavigation<DrawerNavigationProps>();

    const [interessados, setInteressados] = useState([]);
    const [tamLista, setTamLista] = useState(0);

    //console.log('route.params', route.params);

    useFocusEffect(
        useCallback(() => {

            if (user.uid == route.params.id_dono) {
                
                Loanding.setCarregando();

                async function carregar() {

                    const allInteressados: string[] = await buscarCampoEspecifico('Animals', route.params.animal_id, 'interessados');

                    console.log('allInteressados', allInteressados);

                    if (allInteressados) {
                        setTamLista(allInteressados.length);
                        await buscarDadosInteressados(allInteressados, setInteressados);

                        console.log('interessados', interessados);
                    }

                    Loanding.setPronto();
                };
                carregar();

            } else {
                navigationStack.navigate("DrawerRoutes");
            }

            return () => {
                Loanding.setParado();
                //console.log('Tela perdeu foco');
            };

        }, [])
    );

  

    const renderItem = ({ item, index }) => {
        const coluna = index % 2;
        return (
            <View style={[styles.item, coluna === 0 ? (index < (tamLista-1) ? styles.esquerda : styles.ultimoEsq) : (index < (tamLista-1) ? styles.direita : styles.ultimoDir)]}>

                {item.data().imagemPrincipalBase64 ? (
                        <ImageBackground
                            source={{ uri: `data:${item.data().imagemPrincipalBase64.mimeType};base64,${item.data().imagemPrincipalBase64.base64}` }}
                            imageStyle={{ borderRadius: 100 }}
                            resizeMode="cover"
                            style={styles.foto}
                        ></ImageBackground>

                    ) : (
                        <ImageBackground
                            source={userPadrao}
                            imageStyle={{ borderRadius: 100 }}
                            resizeMode="cover"
                            style={styles.foto}
                        ></ImageBackground>
                    )}

                <View style={styles.nomeIdade}>
                    <Text style={styles.texto}>{item.data().nome}</Text>
                    <Text style={styles.texto}>{item.data().idade}</Text>
                </View>

            </View>
        );
    };


    if (user.uid == route.params.id_dono) {

        return (
            <>
                <TopBar
                    nome={'Interessados | ' + route.params.nome_animal}
                    icone='voltar'
                    irParaPagina={() => navigationStack.getState().index > 0 ? navigationStack.goBack() : navigationStack.navigate('DrawerRoutes')}
                    cor='#cfe9e5'
                />

                <View style={styles.container}>

                    {Loanding.Pronto ?
                        <FlatList
                            data={interessados}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={{ alignItems: 'center' }}
                            style={{ marginTop: 12, backgroundColor: '#fafafa', flex: 1, }}
                            ListEmptyComponent={
                                <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 12, width: '80%', marginTop: 100 }}>
                                    <MaterialIcons name="favorite-border" size={48} color="rgba(0, 0, 0, 0.10)" />
                                    <Text style={{ marginLeft: 8, fontSize: 16, fontFamily: 'Roboto-Medium', width: 120, color: 'rgba(0, 0, 0, 0.15)', backgroundColor: '' }} >Nada por aqui...</Text>
                                </View>
                            }
                            ListFooterComponent={<View style={{ marginTop: 20, backgroundColor: 'rgba(0, 0, 0, 0)', width: '80%', height: 100 }} />}
                            numColumns={2}
                            key={2}
                        />

                        :
                        <Modal visible={Loanding.Carregando} animationType='fade' transparent={true}>
                            <ModalLoanding spinner={Loanding.Carregando} cor={'#cfe9e5'} />
                        </Modal>
                    }
                </View>

                <View style={{
                    backgroundColor: '#fafafa',
                    width: '100%',
                    alignItems: 'center',
                    height: 80,
                    justifyContent: 'center',
                }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigationDrawer.navigate("Conversas")}>
                                <BotaoUsual texto='IR PARA O CHAT' cor='#88c9bf' />
                            </TouchableOpacity>

                </View>


            </>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    item: {
        width: 160,
        height: 160,
        backgroundColor: '#fafafa',
        alignItems: 'center',
        marginBottom: 20
    },
    foto: {
        width: 100,
        height: 100,
        //backgroundColor: 'green',
        borderRadius: 100
    },
    esquerda: {
        marginRight: 40,
    },
    direita: {
        marginRight: 0,
        //backgroundColor: 'red'
    },
    ultimoEsq: {
        marginRight: 200,
        //backgroundColor: 'yellow',
    },
    ultimoDir: {
        //backgroundColor: 'gray',
    },
    texto: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        color: '#434343',
        
    },
    nomeIdade: {
        marginTop: 8,
        alignItems: 'center'
    }
});