
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import MenuButton from '../components/MenuButton';
import YellowB from '../components/YellowB';

import Constants from 'expo-constants';
import * as Font from 'expo-font';

import { useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { StackRoutesParametros } from '../utils/StackRoutesParametros';

const PlaceLogoImage = require('../assets/images/Meau_marca_2.png');

import { auth, onAuthStateChanged } from '../configs/firebaseConfig';
import BotaoUsual from '../components/BotaoUsual';

type InicialProps = {
    navigation: NativeStackNavigationProp<StackRoutesParametros, 'Inicial'>;
};

export default function Inicial({ navigation } : InicialProps) {

    const [fonteCarregada, setFonteCarregada] = useState(false);

    const [userEstado, setUserEstado] = useState(false);

    useEffect(() => {
        async function carregarFontes() {
            await Font.loadAsync({
                'Courgette-Regular': require('../assets/fonts/Courgette-Regular.ttf'),
            });
            setFonteCarregada(true);
        }

        carregarFontes();
        console.log('Rodou fonts inicial');

    }, []);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserEstado(true);
        }
    });


    const handleMenuPress = () => {
        alert('Você pressionou o botão de menu.');
    };

   
    if (fonteCarregada) {
        console.log("Fontes carregadas: " + fonteCarregada);
    } else {
        console.log("Fontes falhou: " + fonteCarregada);
    }

    return (

        <View style={styles.container}>

            <View style={styles.menuIcon}>
                <MenuButton onPress={handleMenuPress} />
            </View>

            {fonteCarregada ? (
                <Text style={ [styles.welcomeText, {fontFamily: 'Courgette-Regular'}]}>
                    Olá!
                </Text>
            ) : (
                <Text style={ [styles.welcomeText]}>
                    Olá!
                </Text>
            )}

            <View style={styles.middleView}>
                <Text style={styles.middleText}>Bem vindo ao Meau! {'\n'}
                Aqui você pode adotar, doar e ajudar
                cães e gatos com facilidade.  {'\n'}
                Qual o seu interesse?</Text>
            </View>

            <View style={styles.menuCenter}>
                
                <TouchableOpacity onPress={() => navigation.navigate("AvisoCadastro")}  activeOpacity={0.5}>
                    <BotaoUsual texto='ADOTAR' corTexto='#434343' marginBottom={12} raio={5}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("AvisoCadastro")}  activeOpacity={0.5}>
                    <BotaoUsual texto='AJUDAR' corTexto='#434343' marginBottom={12} raio={5}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("ProtectTelas")}  activeOpacity={0.5}>
                    <BotaoUsual texto='CADASTRAR ANIMAL' corTexto='#434343' marginBottom={12} raio={5}/>
                </TouchableOpacity>

            </View>

            { !userEstado ?
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <View style={styles.login} >
                        <Text style={styles.loginText}>login</Text>
                    </View>
                </TouchableOpacity>
                :
                <View style={styles.login}></View>
            }

            <View style={styles.imageContainer}>
                <Image source={PlaceLogoImage} style={styles.image}/>
            </View>

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
    menuIcon: {
        marginLeft: 12, // Distância da esquerda
        marginTop: 12, // Distância do topo
        width: '100%',
    },
    welcomeText: {
        marginTop: 20,  // Distancia ate o topo da tela -> 56, 
                            // Total -> 56 - 12(marginTop icone) - 24(tamanho do icone) == 20
        marginBottom: 52,
        //fontFamily: 'Courgette-Regular',
        fontSize: 72,
        textAlign: 'center',
        color: '#ffd358'
    },
    middleView : {
        paddingHorizontal: 48,
        marginBottom: 48,
    },
    middleText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
    },
    menuCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    login : {
        marginTop: 32, // 44 :: total -> 44 - 12(marginBottom YellowB)
        marginBottom : 68,
        width: 37,
        height: 25,
        justifyContent: 'center'
    },
    loginText : {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Roboto',
        color: '#88c9bf',
    },
    imageContainer: {
        marginBottom: 32
    },
    image: {
        width: 122,
        height: 44,
        // borderRadius: 18,
    },
});