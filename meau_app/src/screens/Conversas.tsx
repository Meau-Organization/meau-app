
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { ScrollView } from "react-native-gesture-handler";
import { collection, db, doc, getDoc, onSnapshot } from "../configs/firebaseConfig";
import { useCallback, useState } from "react";
import { useAutenticacaoUser } from "../../assets/contexts/AutenticacaoUserContext";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    const [dadosConversas, setDadosConversas] = useState(null);

    const [novaMensagem, setNovaMensagem] = useState<number>(0);

    const listeners = [];

    useFocusEffect(
        useCallback(() => {

            setEsperando(true);
            buscarUserChats();

            return () => {
                console.log('............ desativou listeners');
                listeners.forEach(unsubscribe => unsubscribe());
            };
        }, [])
    );

    const buscarUserChats = async () => {

        const userDocRef = doc(db, 'Users', user.uid);

        const unsubscribeUserChats = onSnapshot(userDocRef, async (snapshotUserChats) => {

            setEsperando(true);

            if (snapshotUserChats.exists()) {

                const userChats = snapshotUserChats.data().userChats;
                //console.log("userChats: " + userChats);

                if (userChats) {
                    const promises = userChats.map(async (userChat) => {

                        const chatRef = doc(db, 'Chats', userChat);
                        const snapshotChat = await getDoc(chatRef);

                        const [_, idDono, idInteressado, idAnimal] = userChat.split('-');
                        const pacoteUltimaMensagem = await buscarUltimaMensagem(userChat, user.uid);
                        console.log("----->>> pacoteUltimaMensagem", pacoteUltimaMensagem.contador);
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
                                                pacoteUltimaMensagem: {ultimaMensagem: ultimaMensagemAtualizada, contador: contadorNovasMsgs } || conversa.pacoteUltimaMensagem,
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
    console.log("novaMensagem: " + novaMensagem);

    if (!esperando) {
        return (
            <>
                <ScrollView style={{ backgroundColor: '#fafafa' }}>

                    <View style={styles.container}>

                        {dadosConversas != null && dadosConversas.length > 0 && dadosConversas ?
                            dadosConversas.map((dadoConversa: any) => (

                                <View key={dadoConversa.idChat} style={{ flexDirection: 'row', width: '100%' }}>

                                    <ChatComponent
                                        titulo={
                                            user.uid == dadoConversa.idInteressado ?            // Se eu (usuario online) sou o interessado
                                                dadoConversa.dadosChat.nomeDono                 // Mostre o nome do dono na lista de conversas
                                                :                                                   // Caso contrário, eu (usuario online) sou o Dono
                                                dadoConversa.dadosChat.nomeInteressado}         // Mostre o nome do interessado na lista de conversas

                                        nomeAnimal={dadoConversa.dadosChat.nomeAnimal}
                                        ultimaMensagem={dadoConversa.pacoteUltimaMensagem.ultimaMensagem ? dadoConversa.pacoteUltimaMensagem.ultimaMensagem.conteudo : ''}
                                        data={dadoConversa.pacoteUltimaMensagem.ultimaMensagem ? dadoConversa.pacoteUltimaMensagem.ultimaMensagem.dataMsg : ''}

                                        foto={
                                            user.uid == dadoConversa.idInteressado ?            // Se eu (usuario online) sou o interessado
                                                dadoConversa.dadosChat.iconeDonoAnimal          // Mostre o icone do dono na lista de conversas
                                                :                                                   // Caso contrário, eu (usuario online) sou o Dono
                                                dadoConversa.dadosChat.iconeInteressado}        // Mostre o icone do interessado na lista de conversas

                                        onPress={() => navigation.navigate('ChatScreen', {
                                            dadosAnimal: {
                                                idAnimal: dadoConversa.idAnimal,
                                                idDono: dadoConversa.idDono,
                                                nomeAnimal: dadoConversa.dadosChat.nomeAnimal,
                                                nomeDono: dadoConversa.dadosChat.nomeDono,
                                                iconeDonoAnimal: dadoConversa.dadosChat.iconeDonoAnimal,
                                            },
                                            dadosInteressado: {
                                                idInteressado: dadoConversa.idInteressado,
                                                nomeInteressado: dadoConversa.dadosChat.nomeInteressado,
                                                iconeInteressado: dadoConversa.dadosChat.iconeInteressado,
                                            },
                                            nomeTopBar: user.uid == dadoConversa.idInteressado ?    // Se eu (usuario online) sou o interessado
                                                dadoConversa.dadosChat.nomeDono                 // Mostre o nome do dono na topBar
                                                :                                                   // Caso contrário, eu (usuario online) sou o Dono
                                                dadoConversa.dadosChat.nomeInteressado          // Mostre o nome do interessado na topBar

                                        })}
                                        novaMensagem={dadoConversa.pacoteUltimaMensagem.contador}
                                        

                                    />


                                </View>

                            ))

                            :
                            <>
                                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '', borderRadius: 12, width: '80%', marginTop: 100 }}>
                                    <Ionicons name="chatbubbles" size={48} color="rgba(0, 0, 0, 0.10)" />
                                    <Text style={{ marginLeft: 8, fontSize: 16, fontFamily: 'Roboto', width: 120, color: 'rgba(0, 0, 0, 0.15)', backgroundColor: '' }} >Nada por aqui...</Text>
                                </View>
                            </>
                        }


                    </View>
                </ScrollView>

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