import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Constants from 'expo-constants';
import { TopBar } from "../components/TopBar";

import { fonteCarregada } from "../utils/FontsLoad";

import BotaoUsual from "../components/BotaoUsual";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { useNavigation } from "@react-navigation/native";
import { registerForPushNotificationsAsync, salvarTokenArmazenamento, salvarTokenNoFirestore } from "../utils/Utils";
import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";
import ModalAviso from "../components/ModalAviso";
import { useState } from "react";
import ModalLoanding from "../components/ModalLoanding";

const notification = require('../assets/images/notification.png');

interface AvisoNotificationProps {
    route: {
        params: {
            topbar: boolean;
        };
    };
}


export default function AvisoNotification({ route }: AvisoNotificationProps) {


    const { topbar } = route.params;

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'AvisoNotification'>>();

    const { user, dadosUser, statusExpoToken, setStatusExpoToken } = useAutenticacaoUser();

    const [modal, setModal] = useState(false);
    const [esperando, setEsperando] = useState(false);

    async function permitir() {
        setEsperando(true);

        await registerForPushNotificationsAsync()
            .then( async (token) => {
                if (token) {
                    console.log("token :" + token);

                    let status_expo_token = statusExpoToken;

                    await salvarTokenArmazenamento(token).then( async (status) => {
                        status_expo_token.statusExpoTokenLocal = status;

                        if (user) {
                            await salvarTokenNoFirestore(token, user.uid, dadosUser).then((status) => {
                                status_expo_token.statusExpoTokenRemoto = status;
                                setStatusExpoToken(status_expo_token);
                                setEsperando(false);
                                navigation.replace('DrawerRoutes');
                            });
                            setEsperando(false);
                        }
                    });
                    setEsperando(false);
                }
            })
            .catch((error: any) => {
                console.error("Erro:" + error);
            });
        
        setEsperando(false);
    }

    console.log('--------------------> ', statusExpoToken);

    return (
        <>
            {topbar ? (
                <TopBar
                    nome='Notificações'
                    icone='notifi'
                    irParaPagina={() => navigation.goBack()}
                    cor='#88c9bf'
                    touch={false}
                />
            ) : (
                <>
                </>
            )}

            <View style={styles.container}>

                {fonteCarregada ? (
                    <>
                        <Text style={[styles.welcomeText, { fontFamily: 'Courgette-Regular' }]}>
                            Olá!
                        </Text>
                        <Text style={[styles.welcomeText, { fontFamily: 'Courgette-Regular', marginTop: 0, fontSize: 20 }]}>
                            Vamos manter você sempre informado!
                        </Text>
                    </>
                ) : (
                    <>
                        <Text style={[styles.welcomeText]}>
                            Olá!
                        </Text>
                        <Text style={[styles.welcomeText, { marginTop: 0, fontSize: 20 }]}>
                            Vamos manter você sempre informado!
                        </Text>
                    </>
                )}

                <View >
                    <Image source={notification} style={styles.image} />
                </View>

                <View style={styles.middleView}>
                    <Text style={styles.middleText}>
                        Para garantir que você não perca nenhuma atualização importante,
                        precisamos enviar notificações. Com as notificações ativadas,
                        você receberá alertas sobre novas mensagens, atualizações no
                        processo e informações relevantes, seja você adotante ou doador.

                    </Text>
                </View>

                <View style={[styles.middleView, { marginTop: 80, backgroundColor: '#d4d4d4', borderRadius: 10, width: '91%' }]}>
                    <Text style={[styles.middleText, { fontSize: 12, color: '#434343' }]}>
                        Caso queira ativar as notificações posteriormente, basta ir em Configurações {'>>'} Privacidade

                    </Text>
                </View>
                {/*                     
                <TouchableOpacity onPress={() => navigation.navigate("CadastroPessoal")}  activeOpacity={0.5}>
                    <BotaoUsual texto='FAZER CADASTRO' marginTop={52}/>
                </TouchableOpacity> */}



                <View style={styles.buttonsContainer}>
                    <TouchableOpacity activeOpacity={0.5} onPress={permitir} >
                        <BotaoUsual texto='PERMITIR' cor='#88c9bf' marginRight={16} largura={148} altura={40} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => setModal(true)} >
                        <BotaoUsual texto='NEGAR' cor='#d4d4d4' largura={148} altura={40} />
                    </TouchableOpacity>

                </View>

                <Modal visible={modal} animationType='fade' transparent={true}>
                    <ModalAviso cor={'#cfe9e5'} setModal={setModal} />
                </Modal>

                <Modal visible={esperando} animationType='fade' transparent={true}>
                    <ModalLoanding spinner={esperando} cor={'#cfe9e5'} />
                </Modal>



            </View>
        </>
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
        marginTop: 15,
        fontSize: 25,
        textAlign: 'center',
        color: '#757575'
    },
    middleView: {
        paddingHorizontal: 48,
        marginTop: 40,
    },
    middleText: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    image: {
        marginTop: 25,
        width: 140,
        height: 140,
        // borderRadius: 18,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 80,

    },
});