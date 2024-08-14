import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from "react-native"

import { Entypo, Ionicons } from '@expo/vector-icons'
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";



interface TopBarProps {
    nome: string,
    icone: string,
    irParaPagina?: () => void,
    cor?: string
}

export function TopBar( {nome, icone, irParaPagina, cor} : TopBarProps) {

    const { width } = useWindowDimensions();

    interface iconesMap {
        [key: string]: React.ReactNode;
    }

    const funcaoVazia = () => {};
    
    if(irParaPagina == undefined) {
        irParaPagina = funcaoVazia;
    }
    
    const iconesMap: iconesMap = {
        menu: <Entypo name="menu" size={24} color="#434343" style={styles.icones}/>,
        voltar: <Ionicons name="arrow-back" size={24} color="#434343" style={styles.icones}/>
    };

    if (!iconesMap.hasOwnProperty(icone)) {
        throw new Error(`O ícone/componente "${icone}" não existe`);
    }
    
    return (

        <SafeAreaView style={{backgroundColor: cor}}>
            <View style = { [styles.barra, {width: width, backgroundColor: cor }] }>

                <TouchableOpacity onPress={irParaPagina}>
                    { iconesMap[icone] }
                </TouchableOpacity>

                <Text style={styles.texto} > {nome} </Text>
            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    barra: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        backgroundColor: '#cfe9e5',
    },
    icones: {
        marginTop: 16,
        marginLeft: 16,
        marginBottom: 16,
    },
    texto: {
        fontFamily: 'Roboto',
        fontSize: 20,
        color: '#434343',
        marginLeft: 30
    }
});