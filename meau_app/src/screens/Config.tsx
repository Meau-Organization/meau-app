import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { Switch } from 'react-native-gesture-handler';


import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

import { useAutenticacaoUser } from '../assets/contexts/AutenticacaoUserContext';
import { setDoc, db, doc } from '../configs/firebaseConfig';


export default function Config() {

    const { user } = useAutenticacaoUser();

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(false);

    const toggleSwitch = () => {
        const novoEstado = !notificacoesAtivadas;
        setNotificacoesAtivadas(novoEstado);

        if (novoEstado) {
            console.log("Sending notifications");
            registerForPushNotificationsAsync()
                .then(token => {
                    if (token) {
                        console.log("token :" + token);
                        setExpoPushToken(token);

                        if (user) {
                            salvarTokenNoFirestore(token, user.uid);
                        }
                    }
                })
                .catch((error: any) => {
                    console.error("Erro ao enviar notificação:" + error);
                    setExpoPushToken(`${error}`)
                });
        }
    };

    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
            await Notifications.setNotificationChannelAsync('mensagens',
                { bypassDnd: true,
                description: 'Canal de mensagens',
                enableLights: true,
                enableVibrate: true,
                groupId: 'Mensagens-android',
                importance: Notifications.AndroidImportance.MAX,
                lightColor: '#FF231F7C',
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                name: "Mensagens",
                showBadge: true,
                sound: "default",
                vibrationPattern: null },
            );


            
        }

        //if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            
            try {
                const projectId =
                    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
                if (!projectId) {
                    throw new Error('Project ID not found');
                }
                token = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                console.log(token);
            } catch (e) {
                token = `${e}`;
            }
        //} else {
          //  alert('Must use physical device for Push Notifications');
        //}

        return token;
    }

    

    async function salvarTokenNoFirestore(token: string, userId: string) {
        try {
            // Atualiza o documento do usuário existente com o token de notificação
            const docRef = await setDoc(doc(db, "Users", userId), {
                expoPushToken: token,
            }, { merge: true }); // Usando merge: true para não sobrescrever outros campos existentes
            console.log("Token armazenado no Firestore com sucesso.");
        } catch (error) {
            console.error("Erro ao armazenar o token no Firestore:", error);
        }
    }

    

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
        // const result = await Notifications.setNotificationChannelAsync('Mensagens',
        //     { bypassDnd: true,
        //     description: 'Canal de mensagens',
        //     enableLights: true,
        //     enableVibrate: true,
        //     groupId: 'Mensagens-android',
        //     importance: Notifications.AndroidImportance.HIGH,
        //     lightColor: '#FF231F7C',
        //     lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        //     name: "Mensagens",
        //     showBadge: true,
        //     sound: "default",
        //     vibrationPattern: null },
        // );
        // console.log("CRIOU", result);
        


        // await Notifications.scheduleNotificationAsync({
        //     content: {
        //         title: "Welcome to Linque 📕",
        //         body: "Enjoy your experience with us! 🚀🚀🚀",
        //         data: { data: "goes here" },
        //         sound: 'default',
        //     },
        //     trigger: null,
        // });
            
    }

    async function notifica() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Notificação local',
                body: 'Teste de notifcação local',
                data: {},
            },
            
            trigger: {
                seconds: 5,
                channelId: 'mensagens',
            }
        });
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
            <TouchableOpacity onPress={notifica} ><Text>Notifica</Text></TouchableOpacity>
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