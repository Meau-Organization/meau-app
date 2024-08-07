import { TopBar } from "../components/TopBar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { ScrollView } from "react-native-gesture-handler";
import { getAuth, db, doc, getDoc, collection, set, ref, realtime, get, child, query, orderByKey, startAt, endAt, queryReal } from "../configs/firebaseConfig";
import { useCallback, useEffect, useState } from "react";
import { useAutenticacaoUser } from "../../assets/contexts/AutenticacaoUserContext";



export default function Conversas(){
    const { user } = useAutenticacaoUser();  
    const chatsRef = ref(realtime, 'chats');  
    
    const fetchChatsForUser = async (userId) => {
    const dbRef = ref(realtime);
    get(child(dbRef, `chats/chat-${user.uid}`)).then((snapshot) => {
    if (snapshot.exists()) {
        console.log(snapshot.val());
    } else {
        console.log("No data available");
    }
    }).catch((error) => {
    console.error(error);
    });

   
    }
    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'BoxLogin'>>();
    
    fetchChatsForUser(user.uid);
    
    return (
        <ScrollView style={{ backgroundColor: '#fafafa' }}>
        </ScrollView>
    );


}
