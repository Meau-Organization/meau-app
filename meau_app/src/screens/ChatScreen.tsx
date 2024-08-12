import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState, useCallback } from "react";

import { View, Modal, StyleSheet } from 'react-native';
import { TopBar } from "../components/TopBar";
import { GiftedChat, IMessage, Send } from "react-native-gifted-chat";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";

import { useAutenticacaoUser } from "../../assets/contexts/AutenticacaoUserContext";

import ModalLoanding from "../components/ModalLoanding";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { collection, db, doc, setDoc, onSnapshot, query, orderBy, updateDoc, arrayUnion, getDoc } from "../configs/firebaseConfig";


interface ChatScreenProps {
    route: {
        params: {
            dadosAnimal: {
                idAnimal: string;
                idDono: string;
                nomeAnimal: string;
                nomeDono: string;
                iconeDonoAnimal: any;
            },
            dadosInteressado: {
                idInteressado: string;
                nomeInteressado: string;
                iconeInteressado: any;
            },
            nomeTopBar: string;
        };
    };
}

export default function ChatScreen({ route }: ChatScreenProps) {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'ChatScreen'>>();

    const { user, dadosUser } = useAutenticacaoUser();

    const [mensagens, setMensagens] = useState<IMessage[]>([]);
    const [esperando, setEsperando] = useState(false);
    const [criarChat, setCriarChat] = useState(true);

    const { dadosAnimal, dadosInteressado, nomeTopBar } = route.params;

    const idChat = 'chat-' + dadosAnimal.idDono + '-' + dadosInteressado.idInteressado + '-' + dadosAnimal.idAnimal;
    //console.log(idChat);




    useFocusEffect(
        useCallback(() => {

            setEsperando(true);
            const unsubscribe = buscarMensagens();

            return () => {
                //console.log('Tela perdeu foco');
                if (unsubscribe) {
                    unsubscribe();
                    console.log('..........................desmontou');
                }
            };
        }, [])
    );

    const acoesChat = async (novasMensagens: IMessage[]) => {
        console.log('acoes chat')

        novasMensagens.forEach((novaMensagem) => {

            const texto = novaMensagem.text;
            console.log(texto);

            if (dadosAnimal.idDono != dadosInteressado.idInteressado) {

                if (criarChat) {
                    createChat(texto);

                } else {
                    enviarMensagem(texto);
                }
            } else {
                alert("Você não pode enviar mensagens para si mesmo");
            }
        });
    };

    const createChat = async (msg: string) => {
        console.log('createChat')
        const data = Date.now();

        try {

            const chatMsgRef = doc(db, 'Chats', idChat, 'messages', Math.floor(Date.now() * Math.random()).toString(36));

            await setDoc(chatMsgRef, {
                conteudo: msg,
                dataMsg: data,
                sender: user.uid,
            });

            const chatRef = doc(db, 'Chats', idChat);
            await setDoc(chatRef, {
                nomeAnimal: dadosAnimal.nomeAnimal,
                nomeDono: dadosAnimal.nomeDono,
                nomeInteressado: dadosInteressado.nomeInteressado,
                iconeDonoAnimal: dadosAnimal.iconeDonoAnimal,
                iconeInteressado: dadosInteressado.iconeInteressado,
            });

            const refDonoAnimal = doc(db, 'Users', dadosAnimal.idDono);
            const refInteressado = doc(db, 'Users', dadosInteressado.idInteressado);

            await updateDoc(refDonoAnimal, {
                userChats: arrayUnion(idChat)
            });
            await updateDoc(refInteressado, {
                userChats: arrayUnion(idChat)
            });

            console.log('Criou o chat');

            setCriarChat(false);

        } catch (error) {
            console.log('erro ao criar chat: ' + error);
        }
    };

    const enviarMensagem = async (msg: string) => {
        const data = Date.now();

        try {
            const chatRef = doc(db, 'Chats', idChat, 'messages', Math.floor(Date.now() * Math.random()).toString(36));

            await setDoc(chatRef, {
                conteudo: msg,
                dataMsg: data,
                sender: user.uid,
            });

            console.log('enviou');
        } catch (error) {
            console.log('erro ao enviar');
        }
    };

    function buscarMensagens(): (() => void) | null {
        console.log('Buscando mensagens');

        try {
            const msgsRef = collection(db, 'Chats', idChat, 'messages');
            const messagesQuery = query(msgsRef, orderBy('dataMsg'));

            const unsubscribe = onSnapshot(messagesQuery, (docs) => {

                const novasMensagens: IMessage[] = [];

                docs.forEach((doc) => {
                    const formatoIMessage = {
                        _id: doc.id,
                        text: doc.data().conteudo,
                        createdAt: new Date(parseInt(doc.data().dataMsg)),
                        user: {
                            _id: doc.data().sender,
                            name: doc.data().sender === dadosAnimal.idDono ? dadosAnimal.nomeDono : dadosInteressado.nomeInteressado,
                            avatar:
                                doc.data().sender === dadosAnimal.idDono ?
                                    `data:${dadosAnimal.iconeDonoAnimal.mimeType};base64,${dadosAnimal.iconeDonoAnimal.base64}`
                                    :
                                    `data:${dadosInteressado.iconeInteressado.mimeType};base64,${dadosInteressado.iconeInteressado.base64}`
                        },
                    } as IMessage;

                    novasMensagens.push(formatoIMessage);
                });

                if (novasMensagens.length < 1) {
                    setCriarChat(true);
                    setMensagens([]);
                    console.log('Chat deve ser criado.');
                } else {
                    setCriarChat(false);
                    setMensagens(novasMensagens.reverse());
                    console.log('Chat ja existe');
                }

                setEsperando(false);
            });

            return unsubscribe;

        } catch (error) {
            console.error("Erro ao buscar mensagens: " + error);
            setEsperando(false);
            return null;
        }
    }

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 100,
                    backgroundColor: '#88c9bf',
                    marginRight: 10,
                    marginBottom: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <MaterialIcons name="send" size={24} color="#fff" />
                </View>
            </Send>
        );
    };

    return (
        <>
            <TopBar
                nome={nomeTopBar}
                icone='voltar'
                irParaPagina={() => navigation.goBack()}
                cor='#88c9bf'
            />
            {!esperando ?
                <View style={{ flex: 1 }}>

                    <GiftedChat
                        messages={mensagens}
                        onSend={acoesChat}
                        user={{
                            _id: user.uid,
                            name: dadosUser.nome
                        }}
                        timeFormat="HH:mm"
                        showAvatarForEveryMessage={true}
                        showUserAvatar={true}
                        placeholder="Digite sua mensagem aqui..."
                        renderSend={renderSend}
                    />
                </View>
                :
                <Modal visible={esperando} animationType='fade' transparent={true}>
                    <ModalLoanding spinner={esperando} cor={'#cfe9e5'} />
                </Modal>
            }
        </>
    );

}

const styles = StyleSheet.create({
    mini_foto: {
        width: 112,
        height: 112,
        borderRadius: 100,
        backgroundColor: 'black',

    },
});