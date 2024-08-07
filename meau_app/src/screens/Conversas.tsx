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
    

    const fetchChatsForUser = async () => {

        const userChatsRef = ref(realtime, `userChats/${user.uid}`);

        try {
            const snapshot = await get(userChatsRef);

            if (!snapshot.exists()) {
                console.log("No chats available for this user");
                return;
            }

            const userChats = snapshot.val();
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
                console.log("otherUserId: " + otherUserId);
                return {
                    chatId,
                    otherUserId,
                    animalId,
                    lastMessage,
                    chatData,
                };
            });

            console.log(processedChats);
            if (processedChats) {
                setChatsA(processedChats);
                console.log(chatsA)
            }
            
            //buscarDadosUsuario(chats[0].lastMessage.otherUserId)
            

        } catch (error) {
            console.error(error);
        }
    };


    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'BoxLogin'>>();


    return (
        <ScrollView style={{ backgroundColor: '#fafafa' }}>

            <TouchableOpacity onPress={fetchChatsForUser} ><Text>a</Text></TouchableOpacity>

            {/* {chatsA.map((chat, index: number) => (

                        

                <View key={chat.chatId} style={{ flexDirection: 'row', width: '95.5%' }}>
                    <ChatComponent
                        titulo={chat.animalId}
                    />

                </View>
            ))} */}

            {/* <ChatComponent></ChatComponent>
            <ChatComponent></ChatComponent>
            <ChatComponent></ChatComponent>
            <ChatComponent></ChatComponent>
            <ChatComponent></ChatComponent> */}



        </ScrollView>
    );


}
