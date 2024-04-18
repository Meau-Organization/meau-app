
import React, { useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { StackRoutesParametros } from '../utils/StackRoutesParametros';

import { auth, onAuthStateChanged } from '../configs/firebaseConfig';


type ProtectTelasProps = {
    navigation: NativeStackNavigationProp<StackRoutesParametros, 'ProtectTelas'>;
    children: React.ReactNode;
};

export default function ProtectTelas({ children, navigation } : ProtectTelasProps) {

    const [logado, setLogado] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLogado(true);
                //console.log("Logado");
            } else {
                navigation.pop();
                navigation.navigate("AvisoCadastro");
            }
        });

    }, []);

    if (logado) {
        return <>{children}</>;
    } else {
        return null;
    }

};