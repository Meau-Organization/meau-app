import { TopBar } from "../components/TopBar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { ScrollView } from "react-native-gesture-handler";
import { getAuth, db, doc, getDoc, collection, set, ref, realtime, get, child, query, orderByKey, startAt, endAt, queryReal, limitToLast } from "../configs/firebaseConfig";
import { useCallback, useEffect, useState } from "react";
import { useAutenticacaoUser } from "../../assets/contexts/AutenticacaoUserContext";
import { Text, TouchableOpacity, View } from "react-native";
import ChatComponent from "../components/chatComponent";

import BotaoUsual from "../components/BotaoUsual";

export default function Conversas() {
    
    const { user } = useAutenticacaoUser();

    const [chatsA, setChatsA] = useState(null);
    
    const [processedChatsFinal, setProcessedChatsFinal] = useState(null);

    const [esperando, setEsperando] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setEsperando(true);
            teste();

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
                    lastMessage,
                    chatData,
                };
            });

            const processedChatsR = await Promise.all(processedChats); // Aguardando o processamento final

            //console.log(processedChatsR);
            if (processedChatsR) {
                setChatsA(processedChatsR); // Atualizando o estado com os chats processados
                //console.log(chatsA)
            }

            return processedChatsR;
            
            //buscarDadosUsuario(chats[0].lastMessage.otherUserId)
            

        } catch (error) {
            console.error(error);
        }
    };




    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'BoxLogin'>>();


    const teste = async () => {

        const processedChatsR = await fetchChatsForUser();
        console.log(processedChatsR[0].lastMessage);
    
            const processedChatsComNomes = processedChatsR.map(async (chat, index: number) => {
        
        
                const dadosOtherUserId = await getDoc(doc(db, "Users", chat.otherUserId)); // Buscando dados do dono no Firestore

                const processaDadosUser = await getDoc(doc(db, "Users", user.uid));// Buscando dados do usuário atual no Firestore

                console.log(dadosOtherUserId.data());
        
                console.log("dadosOtherUserId.data().nome: " + dadosOtherUserId.data().nome);
        
                return {
                    chatId: processedChatsR[index].chatId,
                    otherUserId: processedChatsR[index].otherUserId,
                    animalId: processedChatsR[index].animalId,
                    lastMessage: processedChatsR[index].lastMessage,
                    chatData: processedChatsR[index].chatData,
                    nomeOtherUserId: dadosOtherUserId.data().nome,
                };
            });

            const processedChatsFinal = await Promise.all(processedChatsComNomes); // Esperando os nomes serem adicionados aos dados dos chats
        
            console.log(processedChatsFinal[0].lastMessage);
            setProcessedChatsFinal(processedChatsFinal);  // Atualizando o estado com os chats finais

            setEsperando(false); //Carregamento acabou
        
    }

    if (!esperando) {
        return (
            <ScrollView style={{ backgroundColor: '#fafafa', alignSelf :'center' }}>

                {processedChatsFinal.map((chat, index: number) => (
        
                    
                        <View key={chat.chatId} style={{ flexDirection: 'row', width: '98.5%' }}>

                            <ChatComponent
                                titulo={chat.nomeOtherUserId}
                                msgPreview={chat.lastMessage.conteudo}
                            />
                            

                        </View>
                    
                    
                ))}

            <TouchableOpacity style={{
                 // Posiciona o botão 24dp acima da parte inferior da tela
                alignSelf: 'center'
            }} onPress={() => console.log('Botão pressionado')}>
                <BotaoUsual texto='FINALIZAR UM PROCESSO' cor='#88c9bf' marginTop={52}
                />
            </TouchableOpacity>

                {/* <ChatComponent></ChatComponent>
                <ChatComponent></ChatComponent>
                <ChatComponent></ChatComponent>
                <ChatComponent></ChatComponent>
                <ChatComponent></ChatComponent> */}



            </ScrollView>
            
            
        );
    }


}
