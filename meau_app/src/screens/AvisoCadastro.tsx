import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Constants from 'expo-constants';
import { TopBar } from "../components/TopBar";

import {fonteCarregada} from "../utils/FontsLoad";

import BotaoUsual from "../components/BotaoUsual";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


import { StackRoutesParametros } from "../utils/StackRoutesParametros";

type AvisoCadastroProps = {
    navigation: NativeStackNavigationProp<StackRoutesParametros, 'AvisoCadastro'>;
};

export default function AvisoCadastro( { navigation } : AvisoCadastroProps) {

    return(
        <View style={styles.container}>

            <TopBar
                nome = 'Cadastro'
                icone = 'voltar'
                irParaPagina={() => navigation.navigate("Inicial")}
            />

            {fonteCarregada ? (
                <Text style={ [styles.welcomeText, {fontFamily: 'Courgette-Regular'}]}>
                    Ops!
                </Text>
            ) : (
                <Text style={ [styles.welcomeText]}>
                    Ops!
                </Text>
            )}

            <View style={styles.middleView}>
                <Text style={styles.middleText}>
                    Você não pode realizar esta ação sem {'\n'}
                    possuir um cadastro.
                </Text>
            </View>
                
            <TouchableOpacity onPress={() => navigation.navigate("CadastroPessoal")}  activeOpacity={0.5}>
                <BotaoUsual texto='FAZER CADASTRO' marginTop={52}/>
            </TouchableOpacity>

            <View style={[styles.middleView, {marginTop: 44}]}>
                <Text style={styles.middleText}>
                    Já possui cadastro?
                </Text>
            </View>
            
            <TouchableOpacity onPress={() => navigation.navigate("Login")}  activeOpacity={0.5}>
                <BotaoUsual texto='FAZER LOGIN' marginTop={16}/>
            </TouchableOpacity>

        </View>
    );



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'center',
    },
    welcomeText: {
        marginTop: 52,
        fontSize: 53,
        textAlign: 'center',
        color: '#88c9bf'
    },
    middleView : {
        paddingHorizontal: 48,
        marginTop: 52,
    },
    middleText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
    },
});