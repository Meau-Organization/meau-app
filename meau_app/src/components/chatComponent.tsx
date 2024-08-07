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
}

export default function ChatComponent({ titulo }: chatProps) {



    return (

        <View style={styles.card}>


            <View style={styles.foto}>

            </View>

            <View style={{marginLeft: 10, width: '78%'}}>
                <Text>JOAO DAS NEVES</Text>
                <Text style={{fontSize: 10, marginTop: 4, maxWidth: '60%'}}>OPA, BÃO asdasdas as adasd asdasd adasd asda dsd ad as dada d......</Text>

                <Text style={{alignSelf: 'flex-end'}} > <Text>12:51</Text> </Text>
            </View>

            
            

        </View>

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
});