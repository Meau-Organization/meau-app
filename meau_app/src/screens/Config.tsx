import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Switch } from 'react-native-gesture-handler';


import * as Notifications from 'expo-notifications';


import { useAutenticacaoUser } from '../assets/contexts/AutenticacaoUserContext';


import { getOrCreateInstallationId, getTokenArmazenado, registerForPushNotificationsAsync, salvarTokenArmazenamento, salvarTokenNoFirestore } from '../utils/Utils';



export default function Config() {

    

    const { user, dadosUser, statusExpoToken } = useAutenticacaoUser();

    console.log('--------------------> ', statusExpoToken);

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notificacoesAtivadas, setNotificacoesAtivadas] =
        useState(
            statusExpoToken.statusExpoTokenLocal &&
            statusExpoToken.statusExpoTokenRemoto &&
            statusExpoToken.statusInstalation &&
            statusExpoToken.permissaoNotifcations == 'granted'
        );


   
    // Em testes
    const toggleSwitch = () => {
        const novoEstado = !notificacoesAtivadas;
        setNotificacoesAtivadas(novoEstado);

        if (novoEstado) {
            console.log('Notificações desativadas, ATIVANDO...');
            registerForPushNotificationsAsync()
                .then(token => {
                    if (token) {
                        console.log("token :" + token);
                        setExpoPushToken(token);

                        salvarTokenArmazenamento(token);

                        if (user) {
                            salvarTokenNoFirestore(token, user.uid, dadosUser, statusExpoToken);
                        }
                    }
                })
                .catch((error: any) => {
                    console.error("Erro:" + error);
                    setExpoPushToken(`${error}`)
                });
        } else {
            console.log('Notificações ativadas, DESATIVANDO...');
            setNotificacoesAtivadas(false);
        }
    };


    /// FUNÇÕES DEGUB
    getTokenArmazenado();

    function limpar() {
        Notifications.getNotificationChannelsAsync().then(value => {
            value.map(async (item, i) => {
                //console.log("CANAL", i, item.id);
                await Notifications.deleteNotificationChannelAsync(item.id);
            });

            if (value.length == 0) {
                console.log('VAZIO');
            } else {
                console.log('LIMPO');
            }
        });
    }
    function mostrar() {
        Notifications.getNotificationChannelsAsync().then(value => {
            value.map(async (item, i) => {
                console.log("CANAL", i, item);
                Alert.alert("CANAL", i.toString() + " " + JSON.stringify(item));
            })
            if (value.length == 0) {
                console.log('VAZIO');
            }
        });
    }
    async function criar() {
        await Notifications.setNotificationChannelGroupAsync('chat_mensagens_group', {
            name: 'Mensagens de Chat',
        });
        await Notifications.setNotificationChannelGroupAsync('interessados_group', {
            name: 'Grupo de Interessados',
        });

        await Notifications.setNotificationChannelAsync('interessados', {
            name: 'Interessados',
            description: 'Canal para os interessados em adotar',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            groupId: 'interessados_group',
            enableLights: true,
            enableVibrate: true,
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            showBadge: true,
            sound: "default",
        });

        await Notifications.setNotificationChannelAsync('mensagens', {
            name: "Mensagens",
            description: 'Canal de mensagens',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            groupId: 'chat_mensagens_group',
            enableLights: true,
            enableVibrate: true,
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            showBadge: true,
            sound: "default",
        });
    }
    async function notifica() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Notificação local',
                body: 'Teste de notifcação local',
                data: {},
            },

            trigger: {
                seconds: 1,
                channelId: 'mensagens',
            }
        });
    }

    async function limparNotifications(canal: string, idChat?: string) {

        const presentedNotifications = await Notifications.getPresentedNotificationsAsync();

        if (canal == 'mensagens') {
            presentedNotifications.map( async (notifi) => {
                console.log("presentedNotifications", notifi.request.content.data);
                if (notifi.request.content.data.idChat == idChat) {
                    await Notifications.dismissNotificationAsync(notifi.request.identifier);
                }
            });
        }
        else if (canal == 'interessados') {

        } else {
            console.log('Canal não tratado:', canal);
        }
        
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configurações</Text>

            {/* Notificações Switch */}
            <View style={styles.switchContainer}>
                <Text style={styles.label}>Notificações:</Text>
                <Switch
                    onValueChange={toggleSwitch}
                    value={notificacoesAtivadas}
                    thumbColor={notificacoesAtivadas ? "#4CAF50" : "#f4f3f4"}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                />
            </View>

            <TouchableOpacity onPress={limpar} ><Text>Limpar canais</Text></TouchableOpacity>
            <TouchableOpacity onPress={mostrar} ><Text>Mostrar canais</Text></TouchableOpacity>
            <TouchableOpacity onPress={criar} ><Text>Criar canais</Text></TouchableOpacity>
            <TouchableOpacity onPress={notifica} ><Text>Notifica local</Text></TouchableOpacity>
            <TouchableOpacity onPress={e => limparNotifications('mensagens', 'chat-phOmMymk5dMI30bcqOTiWair5k32-vU8i0ZvI2rXgz6I8F1K1Q8o6dI12-zfA1j6RCGg5caf7yRtn6')} ><Text>Notificações da barra</Text></TouchableOpacity>
            {/* Botão de Enviar Notificação */}
            {/* <SendNotifications token ={expoPushToken} /> */}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
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
    }
});