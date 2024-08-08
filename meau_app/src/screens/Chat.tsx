import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect, useCallback } from "react";

import { View, Text, Modal } from 'react-native';
import { TopBar } from "../components/TopBar";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";

import { set, ref, realtime, onValue, get, queryReal, limitToLast } from "../configs/firebaseConfig";
import { useAutenticacaoUser } from "../../assets/contexts/AutenticacaoUserContext";
import { orderByChild } from "firebase/database";
import ModalLoanding from "../components/ModalLoanding";


interface ChatScreenProps {
    route: {
        params: {
            chatId?: string;
            otherUserId?: string;
            nomeOtherUser?: string;
            animalId?: string;
            chatData?: any;
        };
    };
}

interface Message {
    key: string;
    conteudo: string;
    dataMsg: string;
    sender: string;
}

export default function ChatScreen({ route }: ChatScreenProps) {

    const { chatId, otherUserId, nomeOtherUser, animalId } = route.params;
    //console.log("Dados rota: " + " chatId: " + chatId + " otherUserId: " + otherUserId + " nomeOtherUser: " + nomeOtherUser + " animalId: " + animalId);

    const { user } = useAutenticacaoUser();

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'ChatScreen'>>();

    const [mensagens, setMensagens] = useState<IMessage[]>([]);
    const [esperando, setEsperando] = useState(false);
    const [criarChat, setCriarChat] = useState(false);

    let idChat: string;

    useFocusEffect(
        useCallback(() => {
            setEsperando(true);

            buscarMensagens();

            return () => {
                //console.log('Tela perdeu foco');
            };

        }, [])
    );


    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: nomeOtherUser
        });

    }, [navigation, nomeOtherUser]);

    if (chatId == undefined) {
        idChat = 'chat-' + otherUserId + '-' + user.uid + '-' + animalId;
    } else {
        idChat = chatId;
    }
    //console.log("idChat: " + idChat);

    const createChat = async (msg: string) => {

        const data = Date.now();

        try {
            const userChatRef1 = ref(realtime, `userChats/${otherUserId}/${idChat}`);
            const userChatRef2 = ref(realtime, `userChats/${user.uid}/${idChat}`);

            set(ref(realtime, 'chats/' + idChat + '/messages/' + Math.floor(Date.now() * Math.random()).toString(36)), {
                conteudo: msg,
                dataMsg: data,
                sender: user.uid,
            });
            await set(userChatRef1, true);
            await set(userChatRef2, true);

            atualizarMensagens();

            console.log('Criou o chat');
            setCriarChat(false);

        } catch (error) {
            console.log('erro ao criar chat');
        }
    };

    const enviarMensagem = async (msg: string) => {

        const data = Date.now();

        console.log(idChat);

        try {


            await set(ref(realtime, 'chats/' + idChat + '/messages/' + Math.floor(Date.now() * Math.random()).toString(36)), {
                conteudo: msg,
                dataMsg: data,
                sender: user.uid,
            });

            atualizarMensagens();

            console.log('enviou');

        } catch (error) {
            console.log('erro ao enviar');
        }

    };

    const acoesChat = async (novasMensagens: IMessage[]) => {



        novasMensagens.forEach((novaMensagem) => {

            const texto = novaMensagem.text;
            console.log(texto);

            if (user.uid != otherUserId) {

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


    const buscarMensagens = async () => {
        console.log('Buscando mensagens');

        try {

            const msgsRef = ref(realtime, `chats/${idChat}/messages`);
            const messagesQuery = queryReal(msgsRef, orderByChild('dataMsg'));

            const msgs = [];
            await get(messagesQuery).then((snapshot) => {
                if (snapshot.exists()) {
                    //console.log(snapshot.val());
                    snapshot.forEach((childSnapshot) => {

                        const ultimaMensagem = childSnapshot.val();
                        msgs.push({ key: childSnapshot.key, ...ultimaMensagem });
                    });
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

            if (msgs.length < 1) {
                setCriarChat(true);
                console.log('Chat deve ser criado.');
            } else {
                setCriarChat(false);
                inserirNovasMensagens(msgs.reverse());
                console.log('Chat ja existe');
            }

            setEsperando(false);

        } catch (error) {
            console.error("Erro ao buscar mensagens: " + error);
        }


    }

    const atualizarMensagens = async () => {
        console.log('Atualizando mensagens');

        try {
            const msgsRef = ref(realtime, `chats/${idChat}/messages`);
            const messagesQuery = queryReal(msgsRef, orderByChild('dataMsg'), limitToLast(1));

            const msgs = [];
            onValue(messagesQuery, (snapshot) => {

                snapshot.forEach((childSnapshot) => {

                    const ultimaMensagem = childSnapshot.val();
                    msgs.push({ key: childSnapshot.key, ...ultimaMensagem });
                });
            });
            //console.log(msgs.length);

            inserirNovasMensagens(msgs);

        } catch (error) {
            console.error("Erro ao atualizar mensagens: " + error);
        }

    };

    const inserirNovasMensagens = (novasMensagens: Message[]) => {
        setMensagens((mensagensAnteriores: IMessage[]) => {
            const mensagemMap = new Map(mensagensAnteriores.map((msg) => [msg._id, msg]));

            novasMensagens.forEach((msg) => {
                const iMessage: IMessage = {
                    _id: msg.key,
                    text: msg.conteudo,
                    createdAt: new Date(parseInt(msg.dataMsg)),
                    user: {
                        _id: msg.sender,
                        name: msg.sender == otherUserId ? nomeOtherUser : 'teste',
                        avatar: null,
                    },
                };

                mensagemMap.set(iMessage._id, iMessage);
            });

            return Array.from(mensagemMap.values());
        });
    };



    if (!esperando) {

        return (
            <View style={{ flex: 1 }}>
                <TopBar
                    nome={nomeOtherUser}
                    icone='voltar'
                    irParaPagina={() => navigation.goBack()}
                    cor='#88c9bf'
                />
                <GiftedChat
                    messages={mensagens}
                    onSend={acoesChat}
                    user={{
                        _id: user.uid
                    }}
                />
            </View>
        );
    } else {

        return (
            <Modal visible={esperando} animationType='fade' transparent={true}>
                <ModalLoanding spinner={esperando} cor={'#cfe9e5'} />
            </Modal>
        );
    }



}