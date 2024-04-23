
import { View, Text, StyleSheet } from "react-native";
import Constants from 'expo-constants';

import { auth, onAuthStateChanged, User } from '../configs/firebaseConfig';
import { useState } from "react";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackRoutesParametros } from '../utils/StackRoutesParametros';
import StackRoutes from "../routes/stack/StackRoutes";

type LoadingProps = {
    navigation: NativeStackNavigationProp<StackRoutesParametros, 'Loading'>;
};

export default function Loading({ navigation } : LoadingProps) {


    onAuthStateChanged(auth, (user) => {
        let userEstado1 : boolean = !!user;
        if (userEstado1) {
            console.log("Teste de login" + userEstado1);
            
            // navigation.navigate("Inicial", {
            //     userEstado: 43
            // });
            navigation.navigate("DrawerRoutes");
            console.log("Proxima tela........");
        }
        console.log('Teste de login');
    });
    
    

    return (
        <View style={styles.container}>
            <Text>Loandig</Text>
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'center',
        justifyContent: 'center'
    }
});