import { useNavigation, useRoute } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { useLayoutEffect, useState } from "react";
import { auth } from "../configs/firebaseConfig";
import { TouchableOpacity } from "react-native-gesture-handler";

import { GiftedChat } from "react-native-gifted-chat";
import { AntDesign } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";

import { GestureHandlerRootView } from 'react-native-gesture-handler';



export default function ChatScreen() {
    const [messages, setMessages] = useState([]);
    const route = useRoute();
    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'ChatScreen'>>();

    const { chatId, otherUserId, nomeOtherUserId, animalId, chatData } = route.params;

    const onSighOut = () => {
        signOut(auth).catch(error => console.error(error));
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                style={{marginRight: 10}}
                onPress={onSighOut}>
                    <AntDesign name="logout" size={24} color="#434343" style={{marginRight: 10}} />
                </TouchableOpacity>
            )
        });
    },[navigation]);

    useLayoutEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user) {
                setMessages([
                    {
                        _id: user.uid,
                        text: 'Bem-vindo ao Chat! ${nomeOtherUserId}',
                        createdAt: new Date(),
                        user: {
                            _id: user.uid,
                            name: user.email,
                            avatar: 'https://placeimg.com/140/140/any',
                        },
                    },
                ])
            }
        })

        return () => unsubscribe();
    })

    return (
        <GiftedChat
            messages={messages}
            onSend={msgs => setMessages(GiftedChat.append(messages, msgs))}
            user={{
                _id: auth.currentUser?.uid,
                name: auth.currentUser?.email
            }}
        />
    );


}