import React from "react";
import { Entypo, Ionicons } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from "react-native"

interface TopBarProps {
    nome: string;
    icone: string;
    irParaPagina?: () => void;
    cor?: string;
    touch?: boolean;
}

export function TopBar( {nome, icone, irParaPagina, cor, touch = true} : TopBarProps) {

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
        voltar: <Ionicons name="arrow-back" size={24} color="#434343" style={styles.icones}/>,
        notifi: <MaterialIcons name="notifications-active" size={24} color="#434343" style={styles.icones}/>
    };

    if (!iconesMap.hasOwnProperty(icone)) {
        throw new Error(`O ícone/componente "${icone}" não existe`);
    }
    
    return (

        <SafeAreaView style={{backgroundColor: cor}}>
            <View style = { [styles.barra, {width: width, backgroundColor: cor }] }>

                { touch ?
                    <TouchableOpacity onPress={irParaPagina}>
                        { iconesMap[icone] }
                    </TouchableOpacity>
                    :
                    <>
                    { iconesMap[icone] }
                    </>
                }
                

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