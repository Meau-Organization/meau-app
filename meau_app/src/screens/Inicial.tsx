
import * as Font from 'expo-font';
import Constants from 'expo-constants';
import BotaoUsual from '../components/BotaoUsual';
import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { auth, onAuthStateChanged, signOut } from '../configs/FirebaseConfig';
import { useAutenticacaoUser } from '../assets/contexts/AutenticacaoUserContext';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { InteressadoData, MeauData, MensagemData, StackRoutesParametros } from '../utils/UtilsType';
import { desativarToken, extrairAtributoNotificationJson, limparNotifications, registrarDispositivo } from '../utils/UtilsNotification';

const PlaceLogoImage = require('../assets/images/Meau_marca_2.png');

export default function Inicial() {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'Inicial'>>();

    const notificationResponseRef = useRef<any>();
    const [fonteCarregada, setFonteCarregada] = useState(false);
    const { user, setUser, dadosUser, statusExpoToken, setStatusExpoToken } = useAutenticacaoUser(); // Utiliza o contexto para obter o estado e a função de atualização do usuário


    useEffect(() => {

        if (user) {
            if (!statusExpoToken.statusExpoTokenLocal || !statusExpoToken.statusExpoTokenRemoto) {
                registrarDispositivo(user, dadosUser, statusExpoToken, setStatusExpoToken);
            } else {
                console.log('Token remoto OK');
            }
        }

        async function carregarFontes() {
            await Font.loadAsync({
                'Courgette-Regular': require('../assets/fonts/Courgette-Regular.ttf'),
            });
            setFonteCarregada(true);
        }

        carregarFontes();
        console.log('Rodou fonts inicial');

        //console.log("rotas na pilha " + navigation.getState().routeNames);

        notificationResponseRef.current = Notifications.addNotificationResponseReceivedListener( async (notification) => {

            const meauData : MeauData = await extrairAtributoNotificationJson("meau_data", notification);

            if (meauData) {

                const canalOrigem = meauData.channelId;

                //console.log('ADDNOTIFICATIONRESPONSERECEIVEDLISTENER1 --------------', notification.notification);
                //console.log('ADDNOTIFICATIONRESPONSERECEIVEDLISTENER2 --------------', canalOrigem);

                if (canalOrigem == 'mensagens') {
                    const idChat = (meauData.data as MensagemData).idChat;
                    const titulo = meauData.title;
                    console.log("contato: ", titulo);
                    console.log("Data Mensagem: ", idChat);

                    const partes = titulo.split('▪️');
                    const primeiroNome = partes[0];
                    const segundoNome = partes[1].split(' ').pop();

                    limparNotifications(canalOrigem, idChat, titulo);

                    if (user) {
                        const [_, idDono, idInteressado, __] = idChat.split('-');
                        
                        if (user.uid == idDono || user.uid == idInteressado) {
                            navigation.navigate('ChatScreen', {
                                idChat: idChat,
                                nomeTopBar: primeiroNome + ' | ' + segundoNome,
                            });
                        }

                    } else {
                        navigation.navigate('Login');
                    }

                }
                else if (canalOrigem == 'interessados') {
                    const corpo = meauData.body;
                    const nomeAnimal = (meauData.data as InteressadoData).nomeAnimal;
                    const idDono = (meauData.data as InteressadoData).idDono;
                    const idInteressado = (meauData.data as InteressadoData).idIteressado;
                    const idAnimal = (meauData.data as InteressadoData).idAnimal;
                    console.log("corpo: ", corpo);
                    console.log("nomeAnimal: ", nomeAnimal);
                    console.log("idAnimal: ", idAnimal);

                    limparNotifications(canalOrigem, idAnimal, corpo);

                    if (user) {
                        if (user.uid == idDono || user.uid == idInteressado) {
                            navigation.navigate('Interessados', {
                                id_dono: idDono,
                                id_interessado: idInteressado,
                                animal_id: idAnimal,
                                nome_animal: nomeAnimal
                            });
                        }

                    } else {
                        navigation.navigate('Login');
                    }

                } else {
                    console.log("canalOrigem: ", canalOrigem);
                }
            
            }

        });

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

    const acoesLogout = () => {
        logout();
        /*navigation.reset({ // Codigo para limpar a navegação após o logout.
            index : 0,
            routes : [{name:'DrawerRoutes'}], // Tela inicial de AuthStack
        }) */
    };

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

            {fonteCarregada ? (
                <Text style={[styles.welcomeText, { fontFamily: 'Courgette-Regular' }]}>
                    Olá!
                </Text>
            ) : (
                <Text style={[styles.welcomeText]}>
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

                <TouchableOpacity onPress={() => navigation.navigate("Adotar")} activeOpacity={0.5}>
                    <BotaoUsual texto='ADOTAR' corTexto='#434343' marginBottom={12} raio={5} />
                </TouchableOpacity>

                {/* <TouchableOpacity activeOpacity={0.5}>
                    <BotaoUsual texto='AJUDAR' corTexto='#434343' marginBottom={12} raio={5}/>
                </TouchableOpacity> */}

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
                <TouchableOpacity onPress={acoesLogout}>
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
        marginTop: 32, // 44 :: total -> 44 - 12(marginBottom YellowB)
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
        // borderRadius: 18,
    },
});