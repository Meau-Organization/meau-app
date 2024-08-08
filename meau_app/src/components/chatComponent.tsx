import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Constants from 'expo-constants';
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Screen } from "react-native-screens";
import { useAutenticacaoUser } from "../../assets/contexts/AutenticacaoUserContext";


import SelectDropdown from 'react-native-select-dropdown'


const PlaceLogoImage = require('../assets/images/Meau_marca_2.png');

interface chatProps {
    titulo?: string;
    msgPreview?: string;
    chatId: string;
    otherUserId: string;
    nomeOtherUserId: string;
    animalId: string;
    chatData: any;  // Ajuste conforme o tipo de dados que você está usando
    onPress: () => void;  // Passar a função de navegação como prop
}

export default function ChatComponent({ titulo, msgPreview, onPress }: chatProps) {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros>>();

    return (
   
            <TouchableOpacity onPress={onPress} style={{
                        flexDirection: 'row',
                        padding: 23,
                        borderBottomWidth: 1,
                        borderBottomColor: '#ccc',
                        alignItems: 'center',
                        width: '100%'                    
                    }}>
                        
                <View style={styles.placeholderAvatar}>
                    <MaterialCommunityIcons name="account-circle" size={18} color="#757575" />
                    <View style={styles.innerCircle} />
                </View>

            <View style={{flex:1}}>
                <View style={styles.nameTimeContainer}>
                    <Text style={styles.userName}>{titulo}</Text>
                    <Text style={styles.time}>16:20</Text>
                </View>
                <Text style={styles.lastMessage}>{msgPreview}</Text>
            </View>
            </TouchableOpacity>    

    )
}



const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        width: '100%',
        height: 80,
        //backgroundColor: 'red',
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        alignItems: 'center',
        borderRadius: 5,
    },
    foto: {
        width: 60,
        height: 60,
        backgroundColor: 'blue',
        borderRadius: 100,
        marginLeft: 10
    },
    placeholderAvatar: {
        width: 48,
        height: 48,
        borderRadius: 20,
        backgroundColor: '#00FF00', // Bola verde
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    innerCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    time: {
        fontSize: 14,
        color: '#888',
    },
    lastMessage: {
        fontSize: 14,
        color: '#757575',
        
    },
    nameTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#589b9b',
    },
});