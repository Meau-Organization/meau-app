import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

import { useAutenticacaoUser } from '../assets/contexts/AutenticacaoUserContext';
import { registerForPushNotificationsAsync, removerToken, salvarTokenArmazenamento, salvarTokenNoFirestore } from '../utils/UtilsNotification';
import BotaoMarcavelQuadrado from '../components/BotaoMarcavelQuadrado';
import BotaoUsual from '../components/BotaoUsual';
import ModalSucesso from '../components/ModalSucesso';
import { useFocusEffect } from '@react-navigation/native';
import ModalLoanding from '../components/ModalLoanding';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Config() {

    const { user, dadosUser, statusExpoToken, setStatusExpoToken } = useAutenticacaoUser();
    
    const [modal, setModal] = useState(false);
    const [esperando, setEsperando] = useState(false);
    const [reRenderizar, setReRenderizar] = useState('');
    const [textoModal, setTextoModal] = useState('');
    const [notificationChatInteressados, setNotificationChatInteressados] = useState<string[]>([]);

    //console.log(statusExpoToken);
    //console.log('notificationChatInteressados', notificationChatInteressados, notificationChatInteressados.length)

    useFocusEffect(
        useCallback(() => {

            setEsperando(false);
            setReRenderizar(Math.floor(Date.now() * Math.random()).toString(36));

            if (statusExpoToken.statusExpoTokenLocal && statusExpoToken.statusExpoTokenRemoto && statusExpoToken.statusInstalation) {
                setNotificationChatInteressados(['Ativar notificações de chat e interessados']);
            } else {
                setNotificationChatInteressados([]);
            }
        }, [])
    );

    async function desativarNotificationChatInteressados() {
        let sucesso : boolean = false;

        await removerToken(user.uid).then( async(resposta) => {
            if (resposta) {
                let status_expo_token = statusExpoToken;
                status_expo_token.statusExpoTokenRemoto = false;
                status_expo_token.statusInstalation = false;
                setStatusExpoToken(status_expo_token);

                await AsyncStorage.setItem('@userNegou', 'yes');
                sucesso = true;
            }
        });

        return sucesso;
    }


    async function ativarNotificationChatInteressados() {
        let sucesso : boolean = false;

        await registerForPushNotificationsAsync()
            .then(async (token) => {
                if (token) {
                    console.log("token :" + token);

                    let status_expo_token = statusExpoToken;

                    await salvarTokenArmazenamento(token).then(async (status) => {
                        status_expo_token.statusExpoTokenLocal = status;

                        if (user) {
                            await salvarTokenNoFirestore(token, user.uid, dadosUser, statusExpoToken).then((status) => {
                                status_expo_token.statusExpoTokenRemoto = status;
                                status_expo_token.statusInstalation = status;
                                setStatusExpoToken(status_expo_token);
                                sucesso = true;
                            });
                        }
                    });
                }
            })
            .catch((error: any) => {
                console.error("Erro:" + error);
            });
        
        return sucesso;
    }

    async function salvarAlteracoes() {
        setEsperando(true);
        
        if (notificationChatInteressados.length > 0 && (!statusExpoToken.statusExpoTokenRemoto || !statusExpoToken.statusInstalation)) {
            await ativarNotificationChatInteressados();
            setTextoModal('Alterações salvas!');
        }
        else if (notificationChatInteressados.length <= 0 && (statusExpoToken.statusExpoTokenRemoto && statusExpoToken.statusInstalation)) {
            await desativarNotificationChatInteressados();
            setTextoModal('Alterações salvas!');
        } else {
            setTextoModal('Alterações já foram salvas!');
            //console.log('Operações já foram salvas');
        }

        setEsperando(false);

        setModal(true);

    }

    return (
        <>
            <View style={styles.container} key={reRenderizar}>

                <Text style={{ fontSize: 16, marginTop: 20, color: '#434343', marginBottom: 16, marginLeft: 24 }}>NOTIFICAÇÕES</Text>

                <BotaoMarcavelQuadrado
                    vetor_opcoes={['Ativar notificações de chat e interessados']}
                    setEstadoDoPai={setNotificationChatInteressados}
                    width={262}
                    marginLeft={24}
                    marginBottom={24}
                    estadoInicial={statusExpoToken.statusExpoTokenLocal && statusExpoToken.statusExpoTokenRemoto && statusExpoToken.statusInstalation}
                />


                <View style={styles.middleView}>
                    <Text style={styles.middleText}>
                        Com as notificações de chat e interessados ativadas, você
                        sempre receberá um aviso em seu celular quando
                        alguém entrar em contato ou curtir um pet através do aplicativo.

                    </Text>
                </View>


                <TouchableOpacity activeOpacity={0.5} style={{ alignSelf: 'center' }}>

                </TouchableOpacity>

            </View>

            <View style={{
                backgroundColor: '#fafafa',
                width: '100%',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => salvarAlteracoes()}>
                    <BotaoUsual texto='SALVAR ALTERAÇÕES' cor='#bdbdbd' largura={232} altura={40} marginBottom={24} />
                </TouchableOpacity>

            </View>

            <Modal visible={modal} animationType='fade' transparent={true}>
                <ModalSucesso setModal={setModal} texto={textoModal}/>
            </Modal>

            <Modal visible={esperando} animationType='fade' transparent={true}>
                <ModalLoanding spinner={esperando} cor={'#cfe9e5'} />
            </Modal>

        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        backgroundColor: '#fafafa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    label: {
        fontSize: 18,
        marginRight: 10,
    },
    middleView: {
        width: '85%',
        marginTop: 40,
        marginLeft: 24,
    },
    middleText: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#757575',
        textAlign: 'left',
    },
});