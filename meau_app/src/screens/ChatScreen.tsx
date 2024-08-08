import React, { useCallback, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

import { getAuth, db, doc, getDoc, collection, set, ref, realtime, get, queryReal, orderByChild, limitToLast, child } from "../configs/firebaseConfig";
import { useAutenticacaoUser } from '../../assets/contexts/AutenticacaoUserContext';
import { useFocusEffect } from '@react-navigation/native';
import { onValue } from 'firebase/database';

interface Message {
    key: string;
    conteudo: string;
    dataMsg: string;
    sender: string;
}

interface Messages {
    [key: string]: Message;
}

interface ChatScreenProps {
    route: {
        params: {
            idDono: string;
            idInteressado: string;
            idAnimal: string;
            msg: string;
        };
    };
}



const ChatScreen = ({ route }: ChatScreenProps) => {

    const { idDono, idInteressado, idAnimal } = route.params;

    const [esperando, setEsperando] = useState(true);
    const [criarChat, setCriarChat] = useState(false);

    const { user } = useAutenticacaoUser();

    useFocusEffect(
        useCallback(() => {
            setEsperando(true);

            buscarMensagens();

            return () => {
                //console.log('Tela perdeu foco');
            };

        }, [])
    );


    const [mensagens, setMensagens] = useState<Message[]>([]);
    const [texto, setTexto] = useState('');

    const acoesChat = async () => {

        if (texto.trim()) {

            setTexto('');
            if (idDono != idInteressado) {

                if (criarChat) {
                    createChat(idDono, idInteressado, idAnimal, texto);
                } else {
                    enviarMensagem(idDono, idInteressado, idAnimal, texto);
                }
                
                atualizarMensagens();

            } else {
                alert("Você não pode enviar mensagens para si mesmo");
            }

        }
    };

    const atualizarMensagens = async () => {
        console.log('Atualizando mensagens');

        try {
            const idChat = 'chat-' + idDono + '-' + idInteressado + '-' + idAnimal;
            const msgsRef = ref(realtime, `chats/${idChat}/messages`);
            const messagesQuery = queryReal(msgsRef, orderByChild('dataMsg'), limitToLast(1));

            const msgs = [];
            onValue(messagesQuery, (snapshot) => {

                snapshot.forEach((childSnapshot) => {

                    const ultimaMensagem = childSnapshot.val();
                    msgs.push({ key: childSnapshot.key, ...ultimaMensagem });
                });
            });

            inserirNovasMensagens(msgs);

        } catch (error) {
            console.error("Erro ao atualizar mensagens: " + error);
        }

    };

    const inserirNovasMensagens = (novasMensagens: Message[]) => {

        setMensagens((mensagensAnteriores) => {
            
            const mensagemMap = new Map(mensagensAnteriores.map((msg) => [msg.key, msg]));

            novasMensagens.forEach((msg) => {
                mensagemMap.set(msg.key, msg);
            });

            return Array.from(mensagemMap.values());
        });
    };

    const buscarMensagens = async () => {
        console.log('Buscando mensagens');

        try {

            const idChat = 'chat-' + idDono + '-' + idInteressado + '-' + idAnimal;
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

            // const msgs = [];
            // onValue(messagesQuery, (snapshot) => {

            //     snapshot.forEach((childSnapshot) => {

            //         const ultimaMensagem = childSnapshot.val();
            //         msgs.push({ key: childSnapshot.key, ...ultimaMensagem });
            //     });
            // });

            if (msgs.length < 1) {
                setCriarChat(true);
                console.log('Chat deve ser criado.');
            } else {
                setCriarChat(false);
                inserirNovasMensagens(msgs);
                console.log('Chat ja existe');
            }

            setEsperando(false);

        } catch (error) {
            console.error("Erro ao buscar mensagens: " + error);
        }

    
    }

    const createChat = async (idDono: string, idInteressado: string, idAnimal: string, msg: string) => {

        const data = Date.now();

        try {
            const idChat = 'chat-' + idDono + '-' + idInteressado + '-' + idAnimal;
            const userChatRef1 = ref(realtime, `userChats/${idDono}/${idChat}`);
            const userChatRef2 = ref(realtime, `userChats/${idInteressado}/${idChat}`);

            set(ref(realtime, 'chats/' + idChat + '/messages/' + Math.floor(Date.now() * Math.random()).toString(36)), {
                conteudo: msg,
                dataMsg: data,
                sender: idInteressado,
            });
            await set(userChatRef1, true);
            await set(userChatRef2, true);


            console.log('Criou o chat');
            setCriarChat(false);

        } catch (error) {
            console.log('erro ao criar chat');
        }
    };

    const enviarMensagem = (idDono: string, idInteressado: string, idAnimal: string, msg: string) => {

        const data = Date.now();

        try {

            const idChat = 'chat-' + idDono + '-' + idInteressado + '-' + idAnimal;

            set(ref(realtime, 'chats/' + idChat + '/messages/' + Math.floor(Date.now() * Math.random()).toString(36)), {
                conteudo: msg,
                dataMsg: data,
                sender: idInteressado,
            });

            console.log('enviou');

        } catch (error) {
            console.log('erro ao enviar');
        }

    };

    if (!esperando) {
        return (
            <View style={styles.container}>
                <FlatList
                    data={mensagens}
                    keyExtractor={item => item.dataMsg}
                    renderItem={({ item }) => (
                        <View style={styles.message}>
                            <Text>{item.conteudo}</Text>
                        </View>
                    )}
                    style={styles.messageList}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={texto}
                        onChangeText={setTexto}
                        placeholder="Type a message"
                    />
                    <Button title="Send" onPress={acoesChat} />
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messageList: {
        flex: 1,
        padding: 10,
    },
    message: {
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 5,
        marginVertical: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginRight: 10,
    },
});

export default ChatScreen;
