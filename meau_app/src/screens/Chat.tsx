import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { useLayoutEffect, useState } from "react";
import { auth } from "../configs/firebaseConfig";
import { TouchableOpacity } from "react-native-gesture-handler";

import { GiftedChat } from "react-native-gifted-chat";
import { AntDesign } from '@expo/vector-icons';


export default function Chat() {
    const [msg, setMsg] = useState([]);
    const nav = useNavigation();

    const onSighOut = () => {
        signOut(auth).catch(error => console.error(error));
    };

    useLayoutEffect(() => {
        nav.setOptions({
            headerRight: () => (
                <TouchableOpacity
                style={{marginRight: 10}}
                onPress={onSighOut}>
                    <AntDesign name="logout" size={24} color="#434343" style={{marginRight: 10}} />
                </TouchableOpacity>
            )
        });
    },[nav]);

    useLayoutEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user) {
                setMsg([
                    {
                        _id: user.uid,
                        text: 'Bem-vindo ao Chat!',
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



}