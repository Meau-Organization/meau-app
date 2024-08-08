import { useNavigation, useRoute } from "@react-navigation/native";
import React,{ useLayoutEffect, useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View, Text } from 'react-native';
import { TopBar } from "../components/TopBar";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { AntDesign } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";


import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { set, ref, realtime, push, onValue, getDoc, doc, db, chat, get } from "../configs/firebaseConfig";
//getDataBase = ref
interface ChatScreenProps {
    route: {
        params: {
        chatId: string;
        otherUserId: string;
        nomeOtherUserId: string;
        animalId?: string;  
        chatData: any;
        };
    };
}

export default function ChatScreen({ route } : ChatScreenProps) {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'ChatScreen'>>();
    const { chatId, otherUserId, nomeOtherUserId, animalId, chatData } = route.params;
    
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [nomeOtherUser, setNomeOtherUser] = useState<string>("");

    const messagesRef = ref(realtime, `chats/${chatId}/messages`);//chats/$(chatId}/messages

    //const dadosOtherUserId = await getDoc(doc(db, "Users", chat.otherUserId));

    useEffect(() => {
        const fetchNomeOtherUser = async () => {
            try {
                const dadosOtherUserId = await getDoc(doc(db, "Users", otherUserId));
                if (dadosOtherUserId.exists()) {
                    setNomeOtherUser(dadosOtherUserId.data().nome);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error getting document:", error);
            }
        };

        fetchNomeOtherUser();
    }, [otherUserId]);

    console.log(chatId);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: nomeOtherUser
        });
    }, [navigation, nomeOtherUser]);

    useEffect(() => {
        const fetchMessages = async () => {
            const snapshot = await get(messagesRef);
            if (!snapshot.exists()) {
                console.log("No chats available for this user");
                return;
            }

            const data = snapshot.val();
            const messagesList = data ? Object.keys(data).map(key => ({
                _id: key,
                text: data[key].conteudo,
                createdAt: new Date(Number(data[key].createdAt)),
                user: {
                    _id: data[key].sender,
                    name: nomeOtherUserId
                }
            })) : [];
            setMessages(messagesList);
        };

        fetchMessages();


        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const messagesList = data ? Object.keys(data).map(key => ({
                _id: key,
                text: data[key].conteudo,
                createdAt: new Date(),//.toISOString(),
                user: {
                    _id: data[key].sender,
                    name: nomeOtherUserId
                }
            })) : [];
            setMessages(messagesList);
        });

        return () => unsubscribe();
    },[chatId]);

    const onSend = (newMessages: IMessage[]) => {
        const updates = {};
        newMessages.forEach(message => {
            const newMessageRef = push(messagesRef);
            updates[`chats/${chatId}/messages/${newMessageRef.key}`] = {
                conteudo: message.text,
                sender: message.user._id
            };
        });
        //set(ref(realtime, `chats/${chatId}/messages`), updates);
        set(messagesRef, updates);
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    };

    return (
        <View style={{ flex: 1 }}>
            <TopBar
                    nome={nomeOtherUser}
                    icone='voltar'
                    irParaPagina={() => navigation.goBack()}
                    cor='#88c9bf'
                />
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: otherUserId
                }}
            />
        </View>
    );


}