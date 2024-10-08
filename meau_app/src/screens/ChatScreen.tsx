import { View, Modal } from 'react-native';
import { TopBar } from "../components/TopBar";
import { useState, useCallback } from "react";
import { comprimirImagem } from "../utils/UtilsImage";
import { salvarRotaAtiva } from "../utils/UtilsGeral";
import ModalLoanding from "../components/ModalLoanding";
import { NativeStackNavigationProps } from "../utils/UtilsType";
import { useNomeRotaAtiva } from "../hooks/useNomeRotaAtiva";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";
import { buscarDadosAnimalBasico, buscarDadosUsuarioExterno } from "../utils/UtilsDB";
import { renderBalaoMsg, renderDay, renderMsg, renderSend } from "../utils/UtilsGiftedChat";
import { limparNotifications, sendNotifications } from "../utils/UtilsNotification";
import { collection, db, doc, setDoc, onSnapshot, query, orderBy, updateDoc, getDoc, where, DocumentData, CollectionReference } from "../configs/FirebaseConfig";
import useLoading from '../hooks/useLoading';

interface ChatScreenProps {
    route: {
        params: {
            idChat: string;
            nomeTopBar: string;
        };
    };
}

export default function ChatScreen({ route }: ChatScreenProps) {

    const navigationStack = useNavigation<NativeStackNavigationProps>();

    const Loanding = useLoading();

    const { user, dadosUser } = useAutenticacaoUser();

    const { idChat, nomeTopBar } = route.params;
    const [_, idDono, idInteressado, idAnimal] = idChat ? idChat.split('-') : '';

    const [mensagens, setMensagens] = useState<IMessage[]>([]);
    const [criarChat, setCriarChat] = useState<boolean>();

    const [expoTokensArray, setExpoTokensArray] = useState<Array<string>>(null);

    const [dadosAnimalState, setDadosAnimalState] = useState(null);
    const [dadosDonoState, setDadosDonoState] = useState(null);
    const [dadosInteressadoState, setDadosInteressadoState] = useState(null);
    const [dadosChatState, setDadosChatState] = useState(null);

    const nomeRotaAtiva = useNomeRotaAtiva();

    const listeners = [];

    //console.log(idChat);
    //console.log('Chat deve ser criado:', criarChat);



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    useFocusEffect(
        useCallback(() => {

            if (user.uid == idDono || user.uid == idInteressado) {

                Loanding.setCarregando();

                limparNotifications('mensagens', idChat, '');

                buscarExpoTokens();

                let unsubscribe;

                async function atualizarChat() {

                    //await processarRota(nomeRotaAtiva);

                    const rotaComposta = nomeRotaAtiva + ':' + idChat;
                    await salvarRotaAtiva(rotaComposta);
                    console.log('rotaComposta:', rotaComposta)

                    const dadosChat = await buscarDadosChat();
                    if (dadosChat) {                                                                    // Se o chat já existe, utilize os dados do CHAT
                        unsubscribe = buscarMensagens(dadosChat.nomeDono, dadosChat.nomeInteressado);

                    } else {                                                                            // Se não, busque os dados dos usuarios para criar o CHAT
                        const dadosGeraisImediatos = await buscarDadosGerais();
                        unsubscribe = buscarMensagens(dadosGeraisImediatos.dadosDono.nome,
                            dadosGeraisImediatos.dadosInteressado.nome);
                    }
                }
                atualizarChat();

                return () => {
                    Loanding.setParado();
                    listeners.forEach(unsubscribe => unsubscribe());
                    console.log('.......................... Desmontou listeners ChatSreen', listeners.length);
                };
                
            } else {
                navigationStack.navigate("DrawerRoutes");
            }

        }, [idChat])
    );

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function acoesChat(novasMensagens: IMessage[]) {
        console.log('acoes chat')

        novasMensagens.forEach(async (novaMensagem) => {

            const texto = novaMensagem.text;
            console.log(texto);

            if (idDono != idInteressado) {

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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const createChat = async (msg: string) => {
        console.log('createChat');
        const data = Date.now();

        try {

            const idMensagem = Math.floor(Date.now() * Math.random()).toString(36);
            const chatMsgRef = doc(db, 'Chats', idChat, 'messages', idMensagem);

            const formatoIMessage = {
                _id: idMensagem,
                text: msg,
                createdAt: data,
                user: {
                    _id: user.uid,
                    name: user.uid === idDono ?
                        dadosDonoState.nome
                        :
                        dadosInteressadoState.nome
                },
                lido: false,

            } as IMessage;
            setMensagens((prevMensagens) => [formatoIMessage, ...prevMensagens]);

            await setDoc(chatMsgRef, {
                conteudo: msg,
                dataMsg: data,
                sender: user.uid,
                lido: false,
            });

            const chatRef = doc(db, 'Chats', idChat);
            await setDoc(chatRef, {
                nomeAnimal: dadosAnimalState.nomeAnimal,
                nomeDono: dadosDonoState.nome,
                iconeDonoAnimal: dadosDonoState.imagemPrincipalBase64 ? await comprimirImagem(dadosDonoState.imagemPrincipalBase64, 0.01) : null,
                nomeInteressado: dadosInteressadoState.nome,
                iconeInteressado: dadosInteressadoState.imagemPrincipalBase64 ? await comprimirImagem(dadosInteressadoState.imagemPrincipalBase64, 0.01) : null,
            });

            const subDonoAnimalRef = doc(db, 'Users', idDono, 'UserChats', idChat);
            const subInteressadoRef = doc(db, 'Users', idInteressado, 'UserChats', idChat);

            await setDoc(subDonoAnimalRef, { idChat: idChat, data: data });
            await setDoc(subInteressadoRef, { idChat: idChat, data: data });

            notificar(msg, dadosAnimalState.nomeAnimal);

            setCriarChat(false);
            console.log('Criou o chat');

            await buscarDadosChat();

        } catch (error) {
            console.log('erro ao criar chat: ' + error);
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const enviarMensagem = async (msg: string) => {
        console.log('enviarMensagem');

        const data = Date.now();
        console.log('dadosChatState', dadosChatState.nomeDono);
        try {
            const idMensagem = Math.floor(Date.now() * Math.random()).toString(36);
            const chatRef = doc(db, 'Chats', idChat, 'messages', idMensagem);

            const formatoIMessage = {
                _id: idMensagem,
                text: msg,
                createdAt: data,
                user: {
                    _id: user.uid,
                    name: user.uid === idDono ?
                        dadosChatState.nomeDono
                        :
                        dadosChatState.nomeInteressado
                },
                lido: false,

            } as IMessage;
            setMensagens((prevMensagens) => [formatoIMessage, ...prevMensagens]);

            const subDonoAnimalRef = doc(db, 'Users', idDono, 'UserChats', idChat);
            const subInteressadoRef = doc(db, 'Users', idInteressado, 'UserChats', idChat);

            await updateDoc(subDonoAnimalRef, {
                data: data
            });
            await updateDoc(subInteressadoRef, {
                data: data
            });

            await setDoc(chatRef, {
                conteudo: msg,
                dataMsg: data,
                sender: user.uid,
                lido: false,
            });

            notificar(msg, dadosChatState.nomeAnimal);


            console.log('enviou');
        } catch (error) {
            console.log('erro ao enviar msg: ' + error);
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function buscarMensagens(nomeDono: string, nomeInteressado: string): (() => void) | null {
        console.log('Buscando mensagens');

        try {

            const msgsRef = collection(db, 'Chats', idChat, 'messages');
            const messagesQuery = query(msgsRef, orderBy('dataMsg'));

            const unsubscribe = onSnapshot(messagesQuery, (docs) => {
                const novasMensagens: IMessage[] = [];

                docs.docs.map(async (docElemento) => {

                    if (user.uid != docElemento.data().sender && !docElemento.data().lido) {
                        //console.log('LIDO-id: ', user.uid, ' sd: ', docElemento.data().sender)
                        await updateDoc(doc(db, 'Chats', idChat, 'messages', docElemento.id), {
                            lido: true,
                        });
                    }

                    const formatoIMessage = {
                        _id: docElemento.id,
                        text: docElemento.data().conteudo,
                        createdAt: new Date(parseInt(docElemento.data().dataMsg)),
                        user: {
                            _id: docElemento.data().sender,
                            name: docElemento.data().sender === idDono ?
                                nomeDono
                                :
                                nomeInteressado
                        },
                        lido: docElemento.data().lido,

                    } as IMessage;

                    novasMensagens.push(formatoIMessage);
                });

                setMensagens(novasMensagens.reverse());

                Loanding.setPronto();

            });

            //return unsubscribe;
            listeners.push(unsubscribe);

        } catch (error) {
            console.error("Erro ao buscar mensagens: " + error);
            Loanding.setPronto();

            return null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function buscarDadosChat() {

        const chatRef = doc(db, 'Chats', idChat);
        const chatDoc = await getDoc(chatRef);

        if (chatDoc.exists()) {
            setCriarChat(false);
            setDadosChatState(chatDoc.data());
            return chatDoc.data();
        } else {
            console.log('Chat não existe');
            setCriarChat(true);
            return null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function buscarDadosGerais() {

        const dadosAnimal = await buscarDadosAnimalBasico(idAnimal);
        setDadosAnimalState(dadosAnimal);


        let dadosDono: any;
        try {
            dadosDono = await new Promise(async (resolve) => {
                if (user.uid == idDono) {
                    resolve(dadosUser);
                } else {
                    const dados = await buscarDadosUsuarioExterno(idDono);
                    resolve(dados);
                }
            });
        } catch (error) {
            console.error("Erro ao obter os dados do dono:", error);
        }
        setDadosDonoState(dadosDono);

        let dadosInteressado: any;
        try {
            dadosInteressado = await new Promise(async (resolve) => {
                if (user.uid === idInteressado) {
                    resolve(dadosUser);
                } else {
                    const dados = await buscarDadosUsuarioExterno(idInteressado);
                    resolve(dados);
                }
            });
        } catch (error) {
            console.error("Erro ao obter os dados do interessado:", error);
        }
        setDadosInteressadoState(dadosInteressado);

        Loanding.setPronto();

        return {
            dadosDono: dadosDono,
            dadosInteressado: dadosInteressado
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function buscarExpoTokens() {

        let tokensDocRef : CollectionReference<DocumentData, DocumentData>;
        if (user.uid == idDono) {
            tokensDocRef = collection(db, "Users", idInteressado, 'ExpoTokens');
        } else {
            tokensDocRef = collection(db, "Users", idDono, 'ExpoTokens');
        }

        const q = query(tokensDocRef, where('ativo', '==', true));

        const unsubscribe = onSnapshot(q, (docs) => {
            console.log('Buscando TOKENS..................');
            let expoTokensArray = [];
            docs.forEach((doc) => {
                expoTokensArray.push(doc.data().expoPushToken);
            });
            
            if (expoTokensArray.length > 0) {
                setExpoTokensArray(expoTokensArray);
            } else {
                console.log('Usuario sem tokens registrados');
                setExpoTokensArray(null);
            }
        });

        listeners.push(unsubscribe);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function notificar(msg: string, nomeAnimal: string) {
        const title = dadosUser.nome + '▪️' + 'Sobre o ' + nomeAnimal;
        const body = msg;
        console.log('------------------------------------------ expoTokensArray', expoTokensArray)
        if (expoTokensArray) {
            await sendNotifications(expoTokensArray, title, body, 'mensagens', { idChat: idChat });
        } else {
            console.log('Usuario não permitiu notificações...');
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (user.uid == idDono || user.uid == idInteressado) {

        return (
            <>
                <TopBar
                    nome={nomeTopBar}
                    icone='voltar'
                    irParaPagina={() => navigationStack.getState().index > 0 ? navigationStack.goBack() : navigationStack.navigate('DrawerRoutes')}
                    cor='#88c9bf'
                />
                {Loanding.Pronto ?
                    <View style={{ flex: 1, backgroundColor: '#fafafa' }}>

                        <GiftedChat
                            messages={mensagens}
                            onSend={acoesChat}
                            renderMessage={renderMsg}
                            user={{
                                _id: user.uid,
                                name: dadosUser.nome
                            }}
                            timeFormat="HH:mm"
                            placeholder="Digite sua mensagem aqui..."
                            renderSend={renderSend}
                            renderBubble={renderBalaoMsg(user.uid)}
                            renderDay={renderDay}
                            alwaysShowSend={true}
                            renderAvatar={null}
                        />
                    </View>
                    :
                    <Modal visible={Loanding.Carregando} animationType='fade' transparent={true}>
                        <ModalLoanding spinner={Loanding.Carregando} cor={'#cfe9e5'} />
                    </Modal>
                }
            </>
        );

    }

}