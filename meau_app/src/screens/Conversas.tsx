import Constants from 'expo-constants';
import { useCallback, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import BotaoUsual from "../components/BotaoUsual";
import { buscarUltimaMensagem } from "../utils/UtilsDB";
import ChatComponent from "../components/ChatComponent";
import ModalLoanding from "../components/ModalLoanding";
import { NativeStackNavigationProps } from "../utils/UtilsType";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";
import { collection, db, doc, getDoc, onSnapshot, orderBy, query } from "../configs/FirebaseConfig";
import useLoading from '../hooks/useLoading';
import { StatusBar } from 'expo-status-bar';

export default function Conversas() {

    const navigationStack = useNavigation<NativeStackNavigationProps>();

    const { user } = useAutenticacaoUser();

    const Loanding = useLoading();

    const [refreshing, setRefreshing] = useState(false);

    const [dadosConversas, setDadosConversas] = useState(null);

    const listeners = [];

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    useFocusEffect(
        useCallback(() => {

            if (!refreshing) {
                Loanding.setCarregando();
            }
            buscarUserChats();

            return () => {
                setDadosConversas([]);
                Loanding.setParado();
                listeners.forEach(unsubscribe => unsubscribe());
                console.log('.......................... Desmontou listeners Conversas');
            };
        }, [])
    );

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const buscarUserChats = async () => {
        console.log('buscarUserChats');

        const userChatDocRef = collection(db, 'Users', user.uid, 'UserChats');
        const userChatQuery = query(userChatDocRef, orderBy('data', 'desc'));

        const unsubscribeUserChats = onSnapshot(userChatQuery, async (snapshotUserChats) => {

            if (refreshing) {
                Loanding.setCarregando();
            }

            if (snapshotUserChats.docs.length > 0) {
                if (snapshotUserChats.docs) {

                    const promises = snapshotUserChats.docs.map(async (userChat: any) => {

                        const chatRef = doc(db, 'Chats', userChat.data().idChat);
                        const snapshotChat = await getDoc(chatRef);

                        const [_, idDono, idInteressado, idAnimal] = userChat.data().idChat.split('-');
                        const pacoteUltimaMensagem = await buscarUltimaMensagem(userChat.data().idChat, user.uid);
                        if (!pacoteUltimaMensagem) {
                            Loanding.setPronto();
                        }

                        return {
                            idDono,
                            idInteressado,
                            idAnimal,
                            pacoteUltimaMensagem,
                            idChat: userChat.data().idChat,
                            dadosChat: snapshotChat.data()
                        };
                    });

                    const dados = await Promise.all(promises);
                    const dadosFiltrados = dados.filter(item => item.pacoteUltimaMensagem !== null);

                    setDadosConversas(dadosFiltrados);

                } else {
                    setDadosConversas([]);
                }

            } else {
                console.log('Chats não encontrados');
                setDadosConversas([]);
            }

            Loanding.setPronto();
        });

        listeners.push(unsubscribeUserChats);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const onRefresh = async () => {
        setRefreshing(true);
        await buscarUserChats();
        setRefreshing(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <View style={styles.container}>
                <StatusBar style="dark" backgroundColor='#88c9bf' />

                {Loanding.Pronto ?

                    <FlatList
                        data={dadosConversas}
                        keyExtractor={item => item.idChat}
                        renderItem={({ item }) => (

                            <View key={item.idChat} style={{ flexDirection: 'row', width: '100%' }}>

                                <ChatComponent
                                    titulo={
                                        user.uid == item.idInteressado ?                // Se eu (usuario online) sou o interessado
                                            item.dadosChat.nomeDono                     // Mostre o nome do dono na lista de conversas
                                            :                                           // Caso contrário, eu (usuario online) sou o Dono
                                            item.dadosChat.nomeInteressado}             // Mostre o nome do interessado na lista de conversas

                                    nomeAnimal={item.dadosChat.nomeAnimal}
                                    ultimaMensagem={item.pacoteUltimaMensagem.ultimaMensagem ? item.pacoteUltimaMensagem.ultimaMensagem.conteudo : ''}
                                    data={item.pacoteUltimaMensagem.ultimaMensagem ? item.pacoteUltimaMensagem.ultimaMensagem.dataMsg : ''}

                                    foto={
                                        user.uid == item.idInteressado ?                // Se eu (usuario online) sou o interessado
                                            item.dadosChat.iconeDonoAnimal              // Mostre o icone do dono na lista de conversas
                                            :                                           // Caso contrário, eu (usuario online) sou o Dono
                                            item.dadosChat.iconeInteressado}            // Mostre o icone do interessado na lista de conversas

                                    onPress={() => navigationStack.navigate('ChatScreen', {
                                        idChat: item.idChat,
                                        nomeTopBar: user.uid == item.idInteressado ?                                        // Se eu (usuario online) sou o interessado
                                            item.dadosChat.nomeDono + ' | ' + item.dadosChat.nomeAnimal                     // Mostre o nome do dono na topBar
                                            :                                                                               // Caso contrário, eu (usuario online) sou o Dono
                                            item.dadosChat.nomeInteressado + ' | ' + item.dadosChat.nomeAnimal,             // Mostre o nome do interessado na topBar


                                    })}
                                    novaMensagem={item.pacoteUltimaMensagem.contador}
                                />

                            </View>
                        )}
                        contentContainerStyle={{ backgroundColor: '#fafafa', alignItems: 'center' }}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 12, width: '80%', marginTop: 100 }}>
                                <Ionicons name="chatbubbles" size={48} color="rgba(0, 0, 0, 0.10)" />
                                <Text style={{ marginLeft: 8, fontSize: 16, fontFamily: 'Roboto-Medium', width: 120, color: 'rgba(0, 0, 0, 0.15)', backgroundColor: '' }} >Nada por aqui...</Text>
                            </View>
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
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
                <TouchableOpacity onPress={() => console.log('Botão pressionado')}>
                    <BotaoUsual texto='FINALIZAR UM PROCESSO' cor='#88c9bf'/>
                </TouchableOpacity>

            </View>

        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16 - Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center'
    },

});