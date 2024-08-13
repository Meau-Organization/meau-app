
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { FlatList, RefreshControl, ScrollView } from "react-native-gesture-handler";
import { getAuth, db, doc, getDoc, collection, set, ref, realtime, get, child, query, orderByKey, startAt, endAt, queryReal, limitToLast } from "../configs/firebaseConfig";
import { useCallback, useEffect, useState } from "react";
import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import ChatComponent from "../components/chatComponent";


import BotaoUsual from "../components/BotaoUsual";
import ModalLoanding from "../components/ModalLoanding";
import { TopBar } from "../components/TopBar";

// Definir a interface para os dados dos chats
interface ChatData {
    chatId: string;
    otherUserId: string;
    animalId: string;
    lastMessage: {
        conteudo: string;
    };
    chatData: any;  // Ajuste conforme o tipo de dados que você está usando
    nomeOtherUser: string;
    route: {
        params: {
            topbar: boolean;
        };
    };
}

export default function Conversas({ route }: ChatData ) {
    
    const { user } = useAutenticacaoUser();

    const { topbar } = route.params
    
    const [processedChatsFinal, setProcessedChatsFinal] = useState<ChatData[] | null>(null);

    const [esperando, setEsperando] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (!refreshing){
                setEsperando(true);
            }

            fetchChatsForUser();

            return () => {
                //console.log('Tela perdeu foco');
            };

        }, [])
    );
    

    const fetchChatsForUser = async () => {

        const userChatsRef = ref(realtime, `userChats/${user.uid}`); // Referência ao nó de chats do usuário

        try {
            const snapshot = await get(userChatsRef);  // Obtendo dados dos chats

            if (!snapshot.exists()) {
                console.log("No chats available for this user");
                setEsperando(false); //Carregamento acabou
                return;
            }

            const userChats = snapshot.val(); // Dados dos chats do usuário
            //console.log(userChats);

            const chatPromises = Object.keys(userChats).map(async chatId => {
                const chatRef = ref(realtime, `chats/${chatId}`);// Referência para cada chat
                const chatSnapshot = await get(chatRef);// Obtendo dados de cada chat
                const chatData = chatSnapshot.val();

                // Query para obter a última mensagem enviada
                const messagesRef = ref(realtime, `chats/${chatId}/messages`);
                const lastMessageQuery = queryReal(messagesRef, orderByKey(), limitToLast(1));
                const lastMessageSnapshot = await get(lastMessageQuery);
                const lastMessage = lastMessageSnapshot.exists() ? Object.values(lastMessageSnapshot.val())[0] : null;

                return { chatId, chatData, lastMessage };  // Retornando dados do chat com a última mensagem
            });

            const chats = await Promise.all(chatPromises); // Esperando todas as promises de chats

            // Processando os chats para extrair o ID do outro usuário, o ID do animal, e a última mensagem
            const processedChats = chats.map(({ chatId, chatData, lastMessage }) => {
                const [_, userId1, userId2, animalId] = chatId.split('-');
                const otherUserId = userId1 === user.uid ? userId2 : userId1; // Determinando o ID do outro usuário
                //console.log("otherUserId: " + otherUserId);
                return {
                    chatId,
                    otherUserId,
                    animalId,
                    lastMessage: lastMessage as {conteudo:string, createdAt: string },
                    chatData,
                };
            });

            const processedChatsR = await Promise.all(processedChats); // Aguardando o processamento final

            const processedChatsComNomes = processedChatsR.map(async (chat, index: number) => {
                
                const dadosOtherUserId = await getDoc(doc(db, "Users", chat.otherUserId)); // Buscando dados do dono no Firestore

                console.log("dadosOtherUserId.data().nome: " + dadosOtherUserId.data().nome);

                console.log("Ultima mensagem : " + processedChatsR[index].lastMessage.conteudo)

                return {
                    chatId: processedChatsR[index].chatId,
                    otherUserId: processedChatsR[index].otherUserId,
                    animalId: processedChatsR[index].animalId,
                    lastMessage: processedChatsR[index].lastMessage,
                    chatData: processedChatsR[index].chatData,
                    nomeOtherUser: dadosOtherUserId.data().nome,
                };
            });

            const processedChatsFinal = await Promise.all(processedChatsComNomes); // Esperando os nomes serem adicionados aos dados dos chats

            console.log(processedChatsFinal[0].lastMessage); 
            setProcessedChatsFinal(processedChatsFinal);  // Atualizando o estado com os chats finais

            setEsperando(false); //Carregamento acabou
            
            //buscarDadosUsuario(chats[0].lastMessage.otherUserId)
            

        } catch (error) {
            console.error(error);
        }
    };

    const onRefresh = async () => {
        console.log("refrescando");
        setRefreshing(true); // Inicia Animação do Refresh
         // Recarregar os dados
         await fetchChatsForUser();
         setRefreshing(false);
    }


    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'BoxLogin'>>();

    console.log("esperando: " + esperando);
    if (!esperando) {
        return (
            <>
            {topbar ? (
                    <TopBar
                        nome='Cadastro'
                        icone='voltar'
                        irParaPagina={() => navigation.goBack()}
                        cor='#88c9bf'
                    />
                ) : (
                    <></>
                )}
                <FlatList
                    data={processedChatsFinal}
                    keyExtractor={ item => item.chatId}
                    renderItem={({ item }) => (
                        <View style={{flexDirection: 'row', width: '98.5%'}}>
                            <ChatComponent
                                titulo={item.nomeOtherUser}
                                msgPreview={item.lastMessage.conteudo}
                                chatId={item.chatId}
                                otherUserId={item.otherUserId}
                                nomeOtherUser={item.nomeOtherUser}
                                animalId={item.animalId}
                                chatData={item.chatData}
                                onPress={() => navigation.navigate('ChatScreen', {
                                    chatId: item.chatId,
                                    nomeOtherUser: item.nomeOtherUser,
                                    animalId: item.animalId,
                                })}
                                />
                        </View>
                    )}
                    contentContainerStyle={{ backgroundColor: '#fafafa', alignSelf: 'center'}}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma conversa disponível</Text>}
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                />          
            </>
        );
    } else {
        
        return (
            <Modal visible={esperando} animationType='fade' transparent={true}>
                <ModalLoanding spinner={esperando} cor={'#cfe9e5'}/>
            </Modal>
        );
    }


}
