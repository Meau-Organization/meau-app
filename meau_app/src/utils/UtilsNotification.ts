
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getOrCreateInstallationId } from './UtilsGeral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, db, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from '../configs/FirebaseConfig.js'
import { InteressadoData, MeauData, MensagemData, NotificationAppEncerrado, StackRoutesParametros, StatusToken } from './UtilsType';
import { documentExiste } from './UtilsDB';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export async function salvarTokenArmazenamento(token: string) {
    try {
        await AsyncStorage.setItem('expoPushToken', token);
        console.log("Token salvo com sucesso!");
        return true;
    } catch (error) {
        console.error("Erro ao salvar o token:", error);
    }
    return false;
}

export async function getTokenArmazenado() {
    try {
        const token = await AsyncStorage.getItem('expoPushToken');
        if (token !== null) {
            console.log("Token recuperado:", token);
            return token;
        }
    } catch (error) {
        console.error("Erro ao recuperar o token:", error);
    }
    return null;
}

export async function validarExpoToken(userId: string, installationId: string) {

    let statusInstalation: boolean = false;
    let statusExpoTokenLocal: boolean = false;
    let statusExpoTokenRemoto: boolean = false;
    let userNegou: boolean = false;

    const resposta = await AsyncStorage.getItem('@userNegou');
    if (resposta == 'yes') {
        userNegou = true;
    }


    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    const expoTokenRef = doc(db, 'Users', userId, 'ExpoTokens', installationId);
    const expoTokenDoc = await getDoc(expoTokenRef);

    if (expoTokenDoc.exists()) {
        statusInstalation = true;

        let tokenRemoto = expoTokenDoc.data();
        const tokenLocal = await getTokenArmazenado();
        if (tokenLocal) {
            statusExpoTokenLocal = true;

            if (tokenRemoto.expoPushToken == tokenLocal) {
                statusExpoTokenRemoto = true;
                if (!tokenRemoto.ativo) {
                    await updateDoc(expoTokenRef, { ativo: true });
                }

            } else {
                console.log('-----------------------------------------------> nao e igual')
            }
        }
    }

    if (!statusExpoTokenRemoto) {
        const tokenLocal = await getTokenArmazenado();
        if (tokenLocal) {
            //console.log('tokenLocal 2', tokenLocal);
            statusExpoTokenLocal = true;
        }
    }

    //console.log('statusExpoTokenLocal', statusExpoTokenLocal);
    //console.log('statusExpoTokenRemoto', statusExpoTokenRemoto);

    return {
        status_expo_token: {
            statusExpoTokenLocal: statusExpoTokenLocal,
            statusExpoTokenRemoto: statusExpoTokenRemoto,
            statusInstalation: statusInstalation,
            permissaoNotifcations: existingStatus,
            userNegou: userNegou,
        }
    };

}

export async function registerForPushNotificationsAsync() {

    let token: any;

    if (Platform.OS === 'android') {

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

export async function salvarTokenNoFirestore(token: string, userId: string, dadosUser: any, statusExpoToken: StatusToken) {
    console.log('salvarTokenNoFirestore');
    try {
        const idInstalacao = await getOrCreateInstallationId();

        const expoTokensRef = doc(db, 'Users', userId, 'ExpoTokens', idInstalacao);
        const expoTokensDoc = await getDoc(expoTokensRef);

        if (expoTokensDoc.exists()) {
            console.log(expoTokensDoc.data());
            if (!statusExpoToken.statusExpoTokenRemoto) {
                console.log('>>', expoTokensDoc.data().expoPushToken);
                await updateDoc(expoTokensRef, {
                    expoPushToken: token
                });
            }

        } else {
            console.log('tk não existe, criando...');
            await setDoc(expoTokensRef, { idInstalacao: idInstalacao, expoPushToken: token, ativo: true });
        }

        console.log("Token armazenado no Firestore com sucesso.");
        return true;
    } catch (error) {
        console.error("Erro ao armazenar o token no Firestore:", error);
    }
    return false;
}

export async function sendNotifications(token: string | string[], title: string, body: string, canal: string, dados?: object) {
    console.log("SendNotifications");

    const message = {
        to: token,
        title: title,
        body: body,
        priority: "high",
        channelId: canal,
        data: {
            meau_data: {
                to: token,
                title: title,
                body: body,
                channelId: canal,
                data: dados,
            }
        },
    }
    console.log('Corpo', message);


    try {
        //console.log("Enviando notificação para token:", token);                           // Verifique se esta linha está sendo executada

        // Realiza uma requisição HTTP (GET)
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },                                                                              // If you want to send a notification to multiple devices,
            body: JSON.stringify(message),                                                  //  replace 'E  xponentPushToken[your_expo_push_token]' with an array of token strings.
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Resposta do servidor: ", data);
    }
    catch (error) {
        /**Some of these failures are temporary. 
         * For example, if the Expo push notification service is down an HTTP 429 error (Too Many Requests), or an HTTP 5xx error (Server Errors)
         * if your push notification payload is malformed, you may get an HTTP 400 response explaining the issue with the payload. 
         * You will also get an error if there are no push credentials for your project or if you send push notifications for different projects in the same request. */
        console.error("Erro ao enviar notificação: " + error);
    }
}

export async function registrarDispositivoAutomaticamente(
    user: any,
    dadosUser: any,
    nomeRotaAtiva: string,
    statusExpoToken: StatusToken,
    setStatusExpoToken: React.Dispatch<React.SetStateAction<StatusToken>>) {

    if (user && nomeRotaAtiva !== 'AvisoNotification' && !statusExpoToken.userNegou) {

        if (!statusExpoToken.statusExpoTokenLocal || !statusExpoToken.statusExpoTokenRemoto) {

            registerForPushNotificationsAsync()
                .then(async (token) => {
                    if (token) {
                        console.log("token :" + token);

                        let status_expo_token = statusExpoToken;

                        await salvarTokenArmazenamento(token).then(async (status) => {
                            status_expo_token.statusExpoTokenLocal = status;

                            if (user) {
                                await salvarTokenNoFirestore(token, user.uid, dadosUser, statusExpoToken).then((status) => {
                                    status_expo_token.statusExpoTokenRemoto = status;
                                    setStatusExpoToken(status_expo_token);
                                });
                            }
                        });
                    }
                })
                .catch((error: any) => {
                    console.error("Erro:" + error);
                });

        } else {
            console.log('Token remoto OK');
        }
    }
}

export async function limparNotifications(canal: string, chaveForeground: string, chaveBackground: string) {
    console.log('limparNotifications')

    const presentedNotifications = await Notifications.getPresentedNotificationsAsync();

    const presentedNotificationsData: { meauData: MeauData, identifier: string }[] = [];

    const promise = presentedNotifications.map(async (notification) => {

        let meauData: MeauData = await extrairAtributoNotificationJson("meau_data", notification);
        if (meauData) {
            presentedNotificationsData.push({ meauData: meauData, identifier: notification.request.identifier });
        } else {
            meauData = {
                to: [''],
                title: notification.request.content.title,
                body: notification.request.content.body,
                channelId: '',
                data: null,
            }
            if (meauData.title != null && meauData.body != null) {
                presentedNotificationsData.push({ meauData: meauData, identifier: notification.request.identifier });
            }
        }
        console.log("===========> presentedNotifications", '====', meauData);
    });
    await Promise.all(promise);

    if (canal == 'mensagens') {

        presentedNotificationsData.map(async (notifi) => {


            if (notifi.meauData.data) {
                console.log('LIDAR NORMALMENTE');
                if ((notifi.meauData.data as MensagemData).idChat == chaveForeground) {
                    await Notifications.dismissNotificationAsync(notifi.identifier);
                }

            } else {
                console.log('NOTIFICAÇÃO SEM DADOS');
                const titulo = notifi.meauData.title;
                if (titulo) {
                    if (titulo == chaveBackground) {
                        await Notifications.dismissNotificationAsync(notifi.identifier);
                    }
                }

            }
        });
    }
    else if (canal == 'interessados') {
        presentedNotificationsData.map(async (notifi) => {

            if (notifi.meauData.data) {
                console.log('LIDAR NORMALMENTE');
                if ((notifi.meauData.data as InteressadoData).idAnimal == chaveForeground) {
                    await Notifications.dismissNotificationAsync(notifi.identifier);
                }

            } else {
                console.log('NOTIFICAÇÃO SEM DADOS');
                const corpo = notifi.meauData.body;
                if (corpo) {
                    if (corpo == chaveBackground) {
                        await Notifications.dismissNotificationAsync(notifi.identifier);
                    }
                }

            }

        });

    } else {
        console.log('Canal não tratado:', canal);
    }

}

export async function processarNotificationsAppEncerrado(setNotificationAppEncerrado: React.Dispatch<React.SetStateAction<NotificationAppEncerrado>>) {

    const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();

    //console.log('processarNotificationsAppEncerrado', lastNotificationResponse);

    if (lastNotificationResponse) {
        if (lastNotificationResponse.notification.request.identifier) {

            const notificationProcessadaId = await AsyncStorage.getItem('@lastNotificationProcessada');

            console.log('HANDLENOTIFICATION APP FECHADO', lastNotificationResponse.notification, notificationProcessadaId);

            if (notificationProcessadaId !== lastNotificationResponse.notification.request.identifier) {

                await AsyncStorage.setItem('@lastNotificationProcessada', lastNotificationResponse.notification.request.identifier);

                const meauData: MeauData = await extrairAtributoNotificationJson("meau_data", lastNotificationResponse.notification);

                if (meauData) {

                    const dados = meauData.data;
                    const canalOrigem = meauData.channelId;

                    console.log("canalOrigem: ", canalOrigem);

                    let tela: string;
                    let idChat: string;
                    let contato: string;
                    let idDono: string;
                    let idInteressado: string;
                    let idAnimal: string;
                    let nomeAnimal: string;

                    if (canalOrigem == 'mensagens') {
                        tela = 'ChatScreen';
                        idChat = (dados as MensagemData).idChat;

                        const partes = meauData.title.split('▪️');
                        const primeiroNome = partes[0];
                        const segundoNome = partes[1].split(' ').pop();

                        contato = primeiroNome + ' | ' + segundoNome;

                        console.log("contato: ", contato);
                        console.log("Data Mensagem: ", idChat);

                    }
                    else if (canalOrigem == 'interessados') {
                        tela = 'Interessados'
                        nomeAnimal = (dados as InteressadoData).nomeAnimal;
                        idDono = (dados as InteressadoData).idDono;
                        idInteressado = (dados as InteressadoData).idIteressado;
                        idAnimal = (dados as InteressadoData).idAnimal;

                        console.log("nomeAnimal: ", nomeAnimal);
                        console.log("idDono: ", idDono);
                        console.log("idInteressado: ", idInteressado);
                        console.log("idAnimal: ", idAnimal);

                    } else {
                        console.log("canalOrigem: ", canalOrigem);
                    }

                    setNotificationAppEncerrado({
                        tela: tela,
                        idChat: idChat,
                        nomeTopBar: contato,
                        idDono: idDono,
                        idInteressado: idInteressado,
                        idAnimal: idAnimal,
                        nomeAnimal: nomeAnimal
                    });

                    await Notifications.dismissAllNotificationsAsync();

                } else {
                    console.log('FLUXO NORMAL: NOTIFICAÇÃO SEM DADOS');
                }

            } else {
                setNotificationAppEncerrado({
                    tela: undefined,
                    idChat: undefined,
                    nomeTopBar: undefined,
                    idDono: undefined,
                    idInteressado: undefined,
                    idAnimal: undefined,
                    nomeAnimal: undefined
                });

                console.log('FLUXO NORMAL: NOTIFICAÇÃO JÁ PROCESSADA ANTERIORMENTE');
            }

        }
    } else {
        console.log('FLUXO NORMAL: SEM NOTIFICAÇÃO');

        // setNotificationAppEncerrado({
        //     canalOrigem: 'ChatScreen',
        //     idChat: 'chat-phOmMymk5dMI30bcqOTiWair5k32-vU8i0ZvI2rXgz6I8F1K1Q8o6dI12-zfA1j6RCGg5caf7yRtn6',
        //     nomeTopBar: 'TESTE',
        //     idAnimal: 'idAnimal',
        //     nomeAnimal: 'nomeAnimal'
        // });
    }
}

export async function returnArrayTokens(userId: string) {

    const tokensDocRef = collection(db, "Users", userId, 'ExpoTokens');

    const q = query(tokensDocRef, where('ativo', '==', true));

    const snapshotTokens = await getDocs(q);

    let expoTokensArray = []
    snapshotTokens.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data().expoPushToken);
        expoTokensArray.push(doc.data().expoPushToken);
    });

    if (expoTokensArray.length <= 0) {
        console.log('Usuario sem tokens registrados');
    }
    //console.log(expoTokensArray)

    return expoTokensArray;
}

export async function desativarToken(userId: string) {

    const installationId = await getOrCreateInstallationId();

    const tokenDocRef = doc(db, "Users", userId, 'ExpoTokens', installationId);

    documentExiste(tokenDocRef).then(async (resposta) => {
        if (resposta) {
            await updateDoc(tokenDocRef, {
                ativo: false
            });
        }
    });

}

export async function removerToken(userId: string): Promise<boolean> {
    let resposta : boolean = false;

    const installationId = await getOrCreateInstallationId();

    const tokenDocRef = doc(db, "Users", userId, 'ExpoTokens', installationId);

    if (await documentExiste(tokenDocRef)) {
        await deleteDoc(tokenDocRef);
        resposta = true;
    }

    return resposta;
}

export async function extrairAtributoNotificationJson(atributo: string, dadosJson: any): Promise<MeauData | null> {

    const dadosJsonString = JSON.stringify(dadosJson);
    //console.log('dadosJsonString ---------------------', dadosJsonString);
    const dadosJsonStringEscapda = dadosJsonString.replace(/\\/g, '');
    //console.log('dadosJsonStringEscapda ---------------------', dadosJsonStringEscapda);

    const regex = new RegExp(`"${atributo}"\\s*:\\s*({(?:[^{}]|(?<rec>{(?:[^{}]|\\k<rec>)*}))*})`);

    const resultado = dadosJsonStringEscapda.match(regex);


    if (resultado) {
        const dadosAtributo = JSON.parse(resultado[1]) as MeauData;
        //console.log("Dados do atributo:", resultado[1]);
        return dadosAtributo;
    } else {
        console.log("Atributo não encontrado.");
        return null;
    }

}

export async function listenerNotificationGlobal() {

    Notifications.setNotificationHandler({

        handleNotification: async (notification) => {

            let mostrarNotification: boolean = true;
            let mostrarNotificationChat: boolean = true;

            console.log('HANDLENOTIFICATION ---------------------', notification);

            const meauData: MeauData = await extrairAtributoNotificationJson("meau_data", notification);

            if (meauData) {

                if (meauData.channelId == 'mensagens') {
                    const data: MensagemData = meauData.data as MensagemData;
                    console.log('idChat Notificação:', data.idChat);
                    const nomeRotaAtiva = await AsyncStorage.getItem('@rotaAtiva');
                    if (nomeRotaAtiva) {
                        console.log('nomeRotaAtiva:', nomeRotaAtiva);
                        const [preFixoRotaAtiva, posFixoRotaAtiva] = nomeRotaAtiva.split(':');
                        console.log('Pos-fixo ROTA:', posFixoRotaAtiva);
                        if (posFixoRotaAtiva) {
                            if (posFixoRotaAtiva == data.idChat) {
                                mostrarNotificationChat = false;
                                console.log('Notificação bloqueada Chat!!');
                            }
                        } else {
                            if (preFixoRotaAtiva) {
                                if (preFixoRotaAtiva == 'Conversas') {
                                    mostrarNotification = false;
                                    console.log('Popup bloqueado Conversas!!');
                                }
                            }
                        }
                    }
                }
            }

            if (!mostrarNotificationChat) {
                mostrarNotification = false;
            }

            console.log('shouldShowAlert', (true && mostrarNotificationChat));
            console.log('shouldPlaySound', (mostrarNotification));
            console.log('shouldSetBadge', (mostrarNotification));


            return {
                shouldShowAlert: true && mostrarNotificationChat,
                shouldPlaySound: mostrarNotification,
                shouldSetBadge: mostrarNotification,
            }
        }
    });
}

export async function listenerNotificationClick(user: any, navigation: NativeStackNavigationProp<StackRoutesParametros>) {

    Notifications.addNotificationResponseReceivedListener(async (notification) => {

        const meauData: MeauData = await extrairAtributoNotificationJson("meau_data", notification);

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

}