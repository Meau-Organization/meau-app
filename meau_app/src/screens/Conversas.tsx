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

        const userChatsRef = ref(realtime, `userChats/${user.uid}`);

        try {
            const snapshot = await get(userChatsRef);

            if (!snapshot.exists()) {
                console.log("No chats available for this user");
                return;
            }

            const userChats = snapshot.val();
            //console.log(userChats);

            const chatPromises = Object.keys(userChats).map(async chatId => {
                const chatRef = ref(realtime, `chats/${chatId}`);
                const chatSnapshot = await get(chatRef);
                const chatData = chatSnapshot.val();

                // Query para obter a última mensagem enviada
                const messagesRef = ref(realtime, `chats/${chatId}/messages`);
                const lastMessageQuery = queryReal(messagesRef, orderByKey(), limitToLast(1));
                const lastMessageSnapshot = await get(lastMessageQuery);
                const lastMessage = lastMessageSnapshot.exists() ? Object.values(lastMessageSnapshot.val())[0] : null;

                return { chatId, chatData, lastMessage };
            });

            const chats = await Promise.all(chatPromises);

            // Processando os chats para extrair o ID do outro usuário, o ID do animal, e a última mensagem
            const processedChats = chats.map(({ chatId, chatData, lastMessage }) => {
                const [_, userId1, userId2, animalId] = chatId.split('-');
                const otherUserId = userId1 === user.uid ? userId2 : userId1;
                //console.log("otherUserId: " + otherUserId);
                return {
                    chatId,
                    otherUserId,
                    animalId,
                    lastMessage,
                    chatData,
                };
            });

            const processedChatsR = await Promise.all(processedChats);

            //console.log(processedChatsR);
            if (processedChatsR) {
                setChatsA(processedChatsR);
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
        //console.log(processedChatsR[0].lastMessage);
    
            const processedChatsComNomes = processedChatsR.map(async (chat, index: number) => {
        
        
                const dadosOtherUserId = await getDoc(doc(db, "Users", chat.otherUserId));
                const dadosUser = await getDoc(doc(db, "Users", user.uid));
        
                console.log("dadosOtherUserId.data().nome: " + dadosOtherUserId.data().nome);
        
                return {
                    chatId: processedChatsR[index].chatId,
                    otherUserId: processedChatsR[index].otherUserId,
                    animalId: processedChatsR[index].animalId,
                    lastMessage: processedChatsR[index].lastMessage,
                    chatData: processedChatsR[index].chatData,
                    nomeOtherUserId: dadosOtherUserId.data().nome,
                    nomeUser: dadosUser.data().nome,
                };
            });

            const processedChatsFinal = await Promise.all(processedChatsComNomes);
        
            console.log(processedChatsFinal[0].lastMessage);
            setProcessedChatsFinal(processedChatsFinal);

            setEsperando(false);
        
    }

    if (!esperando) {
        return (
            <ScrollView style={{ backgroundColor: '#fafafa' }}>

                {processedChatsFinal.map((chat, index: number) => (
        

                    <View key={chat.chatId} style={{ flexDirection: 'row', width: '95.5%' }}>
                        <ChatComponent
                            titulo={chat.nomeOtherUserId}
                            msgPreview={chat.lastMessage.conteudo}
                        />

                    </View>
                    
                ))}

                {/* <ChatComponent></ChatComponent>
                <ChatComponent></ChatComponent>
                <ChatComponent></ChatComponent>
                <ChatComponent></ChatComponent>
                <ChatComponent></ChatComponent> */}



            </ScrollView>
        );
    }


}
