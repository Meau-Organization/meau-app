
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { collection, db, doc, getDoc, onSnapshot } from "../configs/firebaseConfig";
import { useCallback, useState } from "react";
import { useAutenticacaoUser } from "../../assets/contexts/AutenticacaoUserContext";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ChatComponent from "../components/ChatComponent";

import BotaoUsual from "../components/BotaoUsual";
import ModalLoanding from "../components/ModalLoanding";
import { buscarUltimaMensagem } from "../utils/Utils";
import Constants from 'expo-constants';

import { Ionicons } from '@expo/vector-icons';

export default function Conversas() {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'Conversas'>>();

    const { user } = useAutenticacaoUser();

    const [esperando, setEsperando] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [dadosConversas, setDadosConversas] = useState(null);

    const listeners = [];

    useFocusEffect(
        useCallback(() => {
            if (!refreshing){
                setEsperando(true);
            }

            buscarUserChats();

            return () => {
                console.log('............ desativou listeners');
                listeners.forEach(unsubscribe => unsubscribe());
            };
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true); // Inicia Animação do Refresh
        // Recarregar os dados
        await buscarUserChats();
        setRefreshing(false);
    }

    const buscarUserChats = async () => {
        console.log('buscarUserChats');

        const userDocRef = doc(db, 'Users', user.uid);

        const unsubscribeUserChats = onSnapshot(userDocRef, async (snapshotUserChats) => {

            if (refreshing){
                setEsperando(true);
            }


            if (snapshotUserChats.exists()) {

                const userChats = snapshotUserChats.data().userChats;
                //console.log("userChats: " + userChats);

                if (userChats) {
                    const promises = userChats.map(async (userChat) => {

                        const chatRef = doc(db, 'Chats', userChat);
                        const snapshotChat = await getDoc(chatRef);

                        const [_, idDono, idInteressado, idAnimal] = userChat.split('-');
                        const pacoteUltimaMensagem = await buscarUltimaMensagem(userChat, user.uid);
                        //console.log("----->>> pacoteUltimaMensagem", pacoteUltimaMensagem.contador);
                        //const pacoteUltimaMensagem = {ultimaMensagem: ultimaMensagem, contador: 0}

                        const unsubscribe = onSnapshot(
                            collection(db, 'Chats', userChat, 'messages'),

                            (snapshot) => {
                                //console.log('------------------------> nova mensagem')

                                let contadorNovasMsgs = 0;
                                const mensagens = snapshot.docs.map(doc => {
                                    if (!doc.data().lido && user.uid != doc.data().sender) {
                                        contadorNovasMsgs++;
                                        //Alert.alert('Nova mensagem', contadorNovasMsgs.toString() + ' : id: ' + user.uid + ' sd: ' + doc.data().sender);
                                    }
                                    return doc.data();
                                });

                                mensagens.sort((a, b) => {
                                    return b.dataMsg - a.dataMsg;
                                });
                                //console.log(mensagens[0]);
                                const ultimaMensagemAtualizada = mensagens[0];

                                setDadosConversas(prevConversas => {
                                    return prevConversas.map(conversa => {
                                        if (conversa.idChat === userChat) {
                                            // console.log('---------------------------------------------------------------------> ', conversa.ultimaMensagem);
                                            // console.log('---------------------------------------------------------------------> ', ultimaMensagemAtualizada);
                                            return {
                                                ...conversa,
                                                pacoteUltimaMensagem: { ultimaMensagem: ultimaMensagemAtualizada, contador: contadorNovasMsgs } || conversa.pacoteUltimaMensagem,
                                            };
                                        }
                                        return conversa;
                                    });
                                });
                            }
                        );
                        listeners.push(unsubscribe);

                        return { idChat: userChat, idDono, idInteressado, idAnimal, dadosChat: snapshotChat.data(), pacoteUltimaMensagem };
                    });

                    const dados = await Promise.all(promises);
                    setDadosConversas(dados.filter(item => item.dadosChat !== undefined));

                    //console.log("dados: ", dados);

                } else {
                    setDadosConversas([]);
                }

            } else {
                console.log('Chats não encontrados');
            }

            setEsperando(false);
        });

        listeners.push(unsubscribeUserChats);
    };

    //console.log("esperando: " + esperando);
    //console.log("novaMensagem: " + novaMensagem);


    if (!esperando) {
        return (
            <>
                

                    <View style={styles.container}>

                            <FlatList
                                data={dadosConversas}
                                keyExtractor={item => item.idChat}
                                renderItem={({ item }) => (

                                    <View key={item.idChat} style={{ flexDirection: 'row', width: '100%' }}>

                                        <ChatComponent
                                            titulo={
                                                user.uid == item.idInteressado ?            // Se eu (usuario online) sou o interessado
                                                    item.dadosChat.nomeDono                 // Mostre o nome do dono na lista de conversas
                                                    :                                                   // Caso contrário, eu (usuario online) sou o Dono
                                                    item.dadosChat.nomeInteressado}         // Mostre o nome do interessado na lista de conversas

                                            nomeAnimal={item.dadosChat.nomeAnimal}
                                            ultimaMensagem={item.pacoteUltimaMensagem.ultimaMensagem ? item.pacoteUltimaMensagem.ultimaMensagem.conteudo : ''}
                                            data={item.pacoteUltimaMensagem.ultimaMensagem ? item.pacoteUltimaMensagem.ultimaMensagem.dataMsg : ''}

                                            foto={
                                                user.uid == item.idInteressado ?            // Se eu (usuario online) sou o interessado
                                                    item.dadosChat.iconeDonoAnimal          // Mostre o icone do dono na lista de conversas
                                                    :                                                   // Caso contrário, eu (usuario online) sou o Dono
                                                    item.dadosChat.iconeInteressado}        // Mostre o icone do interessado na lista de conversas

                                            onPress={() => navigation.navigate('ChatScreen', {
                                                dadosAnimal: {
                                                    idAnimal: item.idAnimal,
                                                    idDono: item.idDono,
                                                    nomeAnimal: item.dadosChat.nomeAnimal,
                                                    nomeDono: item.dadosChat.nomeDono,
                                                    iconeDonoAnimal: item.dadosChat.iconeDonoAnimal,
                                                },
                                                dadosInteressado: {
                                                    idInteressado: item.idInteressado,
                                                    nomeInteressado: item.dadosChat.nomeInteressado,
                                                    iconeInteressado: item.dadosChat.iconeInteressado,
                                                },
                                                nomeTopBar: user.uid == item.idInteressado ?    // Se eu (usuario online) sou o interessado
                                                    item.dadosChat.nomeDono                 // Mostre o nome do dono na topBar
                                                    :                                                   // Caso contrário, eu (usuario online) sou o Dono
                                                    item.dadosChat.nomeInteressado          // Mostre o nome do interessado na topBar

                                            })}
                                            novaMensagem={item.pacoteUltimaMensagem.contador}
                                        />

                                    </View>
                                )}
                                contentContainerStyle={{ backgroundColor: '#fafafa', alignItems: 'center' }}
                                ListEmptyComponent={
                                    <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 12, width: '80%', marginTop: 100 }}>
                                        <Ionicons name="chatbubbles" size={48} color="rgba(0, 0, 0, 0.10)" />
                                        <Text style={{ marginLeft: 8, fontSize: 16, fontFamily: 'Roboto', width: 120, color: 'rgba(0, 0, 0, 0.15)', backgroundColor: '' }} >Nada por aqui...</Text>
                                    </View>
                                }
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }

                            />


                    </View>
                

                <View style={{
                    // Posiciona o botão 24dp acima da parte inferior da tela            
                    backgroundColor: '#fafafa',
                    width: '100%',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={() => console.log('Botão pressionado')}>
                        <BotaoUsual texto='FINALIZAR UM PROCESSO' cor='#88c9bf' marginBottom={24}
                        />
                    </TouchableOpacity>

                </View>

            </>

        );
    } else {

        return (
            <Modal visible={esperando} animationType='fade' transparent={true}>
                <ModalLoanding spinner={esperando} cor={'#cfe9e5'} />
            </Modal>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16 - Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        //backgroundColor: 'red',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center'
    },

});