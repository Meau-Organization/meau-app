

import Constants from 'expo-constants';
import BotaoUsual from '../components/BotaoUsual';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { auth, onAuthStateChanged, signOut } from '../configs/FirebaseConfig';
import { useAutenticacaoUser } from '../assets/contexts/AutenticacaoUserContext';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { StackRoutesParametros } from '../utils/UtilsType';
import { desativarToken } from '../utils/UtilsNotification';

const PlaceLogoImage = require('../assets/images/Meau_marca_2.png');

export default function Inicial() {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'Inicial'>>();

    const { user, setUser } = useAutenticacaoUser(); // Utiliza o contexto para obter o estado e a função de atualização do usuário


    useEffect(() => {
        console.log('Rodou fonts inicial');

        //console.log("rotas na pilha " + navigation.getState().routeNames);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user); // Atualiza o estado global com o usuário autenticado
            } else {
                setUser(null);  // Atualiza o estado para null se não houver usuário
                console.log("Usuario off ");
            }
        });
        

        return () => unsubscribe();

    }, [setUser]);

    async function logout() {

        await desativarToken(user.uid);

        signOut(auth)
            .then(() => {
                setUser(null); //Define o estaudo global como null após logout
                console.log('Usuario Saiu');
            })
            .catch((error) => {
                Alert.alert('Erro', 'Erro ao tentar fazer fazer o logout');
                console.error('Erro ao tentar fazer fazer o logout:', error);
            });
    };

    return (

        <View style={styles.container}>

                <Text style={[styles.welcomeText, { fontFamily: 'Courgette-Regular' }]}>
                    Olá!
                </Text>

            <View style={styles.middleView}>
                <Text style={styles.middleText}>Bem vindo ao Meau! {'\n'}
                    Aqui você pode adotar, doar e ajudar
                    cães e gatos com facilidade.  {'\n'}
                    Qual o seu interesse?</Text>
            </View>

            <View style={styles.menuCenter}>

                <TouchableOpacity onPress={() => navigation.navigate("Adotar")} activeOpacity={0.5}>
                    <BotaoUsual texto='ADOTAR' corTexto='#434343' marginBottom={12} raio={5} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() =>
                    user ?
                        navigation.navigate("PreencherCadastroAnimal")
                        :
                        navigation.navigate("AvisoCadastro", { topbar: true })
                }
                    activeOpacity={0.5}>

                    <BotaoUsual texto='CADASTRAR ANIMAL' corTexto='#434343' marginBottom={12} raio={5} />
                </TouchableOpacity>

            </View>

            {!user ?
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <View style={styles.login} >
                        <Text style={styles.loginText}>login</Text>
                    </View>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={logout}>
                    <View style={[styles.login, { width: 50 }]} >
                        <Text style={styles.loginText}>logout</Text>
                    </View>
                </TouchableOpacity>
            }

            <View style={styles.imageContainer}>
                <Image source={PlaceLogoImage} style={styles.image} />
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
        marginLeft: 12,
        marginTop: 12,
        width: '100%',
    },
    welcomeText: {
        marginTop: 20,
        marginBottom: 52,
        fontSize: 72,
        textAlign: 'center',
        color: '#ffd358'
    },
    middleView: {
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
    login: {
        marginTop: 32,
        marginBottom: 68,
        width: 37,
        height: 25,
        justifyContent: 'center'
    },
    loginText: {
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
    },
});