import { TopBar } from "../components/TopBar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { ScrollView } from "react-native-gesture-handler";
import { getAuth, db, doc, getDoc, collection, set, ref, realtime, get, child, query, orderByKey, startAt, endAt, queryReal } from "../configs/firebaseConfig";
import { useCallback, useEffect, useState } from "react";
import { useAutenticacaoUser } from "../../assets/contexts/AutenticacaoUserContext";



export default function Conversas() {
    const { user } = useAutenticacaoUser();

    const fetchChatsForUser = async () => {

        console.log('fetch');

        const userId = user.uid;
        const db = realtime;
        const userChatsRef = ref(db, `userChats/${user.uid}`);

        try {
            const snapshot = await get(userChatsRef);

            if (!snapshot.exists()) {
                console.log("No chats available for this user");
                return;
            }

            const userChats = snapshot.val();
            const chatPromises = Object.keys(userChats).map(chatId => {
                const chatRef = ref(db, `chats/${chatId}`);
                return get(chatRef).then(chatSnapshot => chatSnapshot.val());
            });

            const chats = await Promise.all(chatPromises);
            console.log(chats);

        } catch (error) {
            console.error(error);
        }
    };

    fetchChatsForUser();

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'BoxLogin'>>();


    return (
        <ScrollView style={{ backgroundColor: '#fafafa' }}>
        </ScrollView>
    );


}
