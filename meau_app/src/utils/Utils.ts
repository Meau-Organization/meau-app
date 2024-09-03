
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { addDoc, collection, db, doc, getDoc, getDocs, limitToLast, orderBy, query, setDoc, updateDoc, where } from '../configs/firebaseConfig.js'
import { Platform } from 'react-native';
import { NavigationState } from '@react-navigation/native';

export type Trigger = {
    channelId: string;
    remoteMessage: string;
    type: string;
}

export interface StatusToken {
    statusExpoTokenLocal: boolean;
    statusExpoTokenRemoto: boolean;
    statusInstalation: boolean;
    permissaoNotifcations: string;
}

export type NotificationAppEncerrado = {
    tela: any;
    idChat: string;
    nomeTopBar: string;
    idAnimal: string;
    nomeAnimal: string;
};

export async function buscarCampoEspecifico(colecao: string, id_documento: string, campo: string) {
    const docRef = doc(db, colecao, id_documento);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const campoEspecifico = await docSnap.get(campo);
        //console.log("Valor do campo:", campoEspecifico);
        return campoEspecifico;
    } else {
        console.log("Campo não encontrado");
        return null;
    }
}

export async function buscarUltimaMensagem(idChat: string, userId: string) {
    const msgsRef = collection(db, 'Chats', idChat, 'messages');

    const messagesQuery = query(msgsRef, orderBy('dataMsg'), limitToLast(1));

    const MessagesQueryNaoLidas = query(msgsRef, where('lido', '==', false));

    const SnapshotNaoLidas = await getDocs(MessagesQueryNaoLidas);

    const msgsNaoLidas = SnapshotNaoLidas.docs.filter(doc => doc.data().sender !== userId);

    //console.log('--------------------------------> buscarUltimaMensagem', msgsNaoLidas)

    const snapshot = await getDocs(messagesQuery);
    if (!snapshot.empty) {
        return { ultimaMensagem: { key: snapshot.docs[0].id, ...snapshot.docs[0].data() }, contador: msgsNaoLidas.length };

    } else {
        console.log('Erro ao buscar ultima mensagem');
        return null;
    }

}

export async function comprimirImagem(imagem: any, fator: number) {

    const uri = await Base64ToUri(imagem.base64);

    let imagemComprimida: any;

    try {
        const comprimida = await manipulateAsync(
            uri,
            [],
            { base64: true, compress: fator, format: SaveFormat.JPEG },
        );

        imagemComprimida = {
            "base64": comprimida.base64,
            "height": comprimida.height,
            "mimeType": comprimida.uri.split('.').pop() || 'unknown',
            "uri": comprimida.uri,
            "width": comprimida.width
        }
        console.log(`Imagem Compress ${fator} : String base64 tamanho: `,
            ((imagemComprimida.base64.length / 1024) / 1024).toFixed(4) + " MB");

    } catch (error) {
        console.log('Erro ao comprimir..');
        return null;

    } finally {
        await FileSystem.deleteAsync(uri);
        return imagemComprimida;
    }

}

async function Base64ToUri(base64: string): Promise<string> {
    const filename = `${FileSystem.cacheDirectory}temp.jpg`;

    await FileSystem.writeAsStringAsync(filename, base64, { encoding: FileSystem.EncodingType.Base64 });
    return filename;
}


export async function getOrCreateInstallationId() {
    let installationId = await AsyncStorage.getItem('installationId');
    if (!installationId) {
        installationId = Math.floor(Date.now() * Math.random()).toString(36);
        await AsyncStorage.setItem('installationId', installationId);
    }
    console.log("ID Instalação do App:", installationId);
    return installationId;
}

export async function notificacaoSilenciosa(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        contentAvailable: true,
        data: {
            message: 'Verificando Expo Tokens inválidos',
        },
    };

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        const data = await response.json();
        console.log('resposta', data);
        return data.data.status;
    } catch (error) {
        return null;
    }
}

export async function removerTokensInativos(userId: string) {
    try {
        const userDocRef = doc(db, 'Users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            let expoTokens = userDoc.data().expoTokens;


            const promises = expoTokens.map(async (expoTk) => {
                const status = await notificacaoSilenciosa(expoTk.expoPushToken)

                if (status) {
                    console.log('RETORNO', status);

                    if (status == 'error') {
                        expoTk.ativo = false;
                    }

                } else {
                    console.log('Erro ao enviar notificação silenciosa');
                }

            });

            await Promise.all(promises);

            console.log('Antes', expoTokens);
            const expoTokensUpdate = expoTokens.filter((item: any) => item.ativo !== false);


            console.log(expoTokensUpdate);
            await updateDoc(userDocRef, { expoTokens: expoTokensUpdate });

        }
    } catch (error) {
        console.error('Erro', error);
    }
}

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
            permissaoNotifcations: existingStatus
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
                console.log('>>',expoTokensDoc.data().expoPushToken);
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
        data: dados,
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

export async function registrarDispositivo(
    user: any,
    dadosUser: any,
    statusExpoToken: StatusToken,
    setStatusExpoToken: React.Dispatch<React.SetStateAction<StatusToken>>) {
    
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
                                setStatusExpoToken(status_expo_token);
                            });
                        }
                    });
                }
            })
            .catch((error: any) => {
                console.error("Erro:" + error);
            });
}


export async function limparNotifications(canal: string, chaveForeground: string, chaveBackground: string, tudoPorCanal: boolean) {
    console.log('limparNotifications')

    const presentedNotifications = await Notifications.getPresentedNotificationsAsync();

    presentedNotifications.map( async (notifi) => {
        console.log("===========> presentedNotifications", '====', notifi.request.content.body, 'id:',
            notifi.request.identifier, 'chaveForeground', chaveForeground, 'chaveBackground', chaveBackground, tudoPorCanal);
    });

    if (tudoPorCanal) {
        presentedNotifications.map( async (notifi) => {
            const trigger = notifi.request.trigger as Trigger;
            if (trigger) {
                const canalAtual = (notifi.request.trigger as Trigger).channelId;
                //console.log("=======================================================> presentedNotifications", canalAtual);
                if (canalAtual == canal) {
                    await Notifications.dismissNotificationAsync(notifi.request.identifier);
                }
            }
        });

    }
    else if (canal == 'mensagens') {
        
        presentedNotifications.map( async (notifi) => {
            
            
            if (notifi.request.trigger) {
                console.log('LIDAR NORMALMENTE');
                if (notifi.request.content.data.idChat == chaveForeground) {
                    await Notifications.dismissNotificationAsync(notifi.request.identifier);
                }

            } else {
                console.log('NOTIFICAÇÃO BICHADA');
                const titulo = notifi.request.content.title;
                if (titulo) {
                    if (titulo == chaveBackground) {
                        await Notifications.dismissNotificationAsync(notifi.request.identifier);
                    }
                }
                
            }
        });
    }
    else if (canal == 'interessados') {
        presentedNotifications.map( async (notifi) => {

            if (notifi.request.trigger) {
                console.log('LIDAR NORMALMENTE');
                if (notifi.request.content.data.idAnimal == chaveForeground) {
                    await Notifications.dismissNotificationAsync(notifi.request.identifier);
                }

            } else {
                console.log('NOTIFICAÇÃO BICHADA');
                const corpo = notifi.request.content.body;
                if (corpo) {
                    if (corpo == chaveBackground) {
                        await Notifications.dismissNotificationAsync(notifi.request.identifier);
                    }
                }
                
            }
            
        });

    } else {
        console.log('Canal não tratado:', canal);
    }
    
}


export async function buscarDadosAnimalBasico(idAnimal: string) {

    try {
        const animalsRef = doc(db, 'Animals', idAnimal);
        const animalDoc = await getDoc(animalsRef);

        if (animalDoc.exists()) {
            return animalDoc.data();
        } else {
            console.log('Dados do animal não encontrados');
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar dados do animal: ', error);
    }

    return null;
}

export async function buscarDadosUsuarioExterno(userId: string) {

    try {
        const userRef = doc(db, 'Users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            console.log(userDoc.data().nome)
            return userDoc.data();
        } else {
            console.log('Dados do user externo não encontrados');
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar dados do user externo: ', error);
    }

    return null;
}

export async function salvarRotaAtiva(nomeRotaAtiva : string) {
    try {
        await AsyncStorage.setItem('@rotaAtiva', nomeRotaAtiva);
        //console.log('Salvou rota....................', nomeRotaAtiva);
    } catch (error) {
        console.error('Erro ao salvar o nome da rota:', error);
    }
};


export async function processarNotificationsAppEncerrado(setNotificationAppEncerrado: React.Dispatch<React.SetStateAction<NotificationAppEncerrado>>) {
        

    const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();

    console.log('processarNotificationsAppEncerrado', lastNotificationResponse);

    if (lastNotificationResponse) {
        if (lastNotificationResponse.notification.request.identifier) {
            console.log('HANDLENOTIFICATION APP FECHADO', lastNotificationResponse.notification);
            
            const dados = lastNotificationResponse.notification.request.content.data;
            const canalOrigem = (lastNotificationResponse.notification.request.trigger as Trigger).channelId;

            console.log("canalOrigem: ", canalOrigem);

            let tela : string;
            let idChat : string;
            let contato : string;
            let idAnimal : string;
            let nomeAnimal : string;

            if (canalOrigem == 'mensagens') {
                tela = 'ChatScreen';
                idChat = dados.idChat;
                contato = lastNotificationResponse.notification.request.content.title;

                console.log("contato: ", contato);
                console.log("Data Mensagem: ", idChat);

            }
            else if (canalOrigem == 'interessados') {
                tela = 'Interessados'
                nomeAnimal = dados.nomeAnimal;
                idAnimal = dados.idAnimal;

                console.log("nomeAnimal: ", nomeAnimal);
                console.log("idAnimal: ", idAnimal);
                
            } else {
                console.log("canalOrigem: ", canalOrigem);
            }

            setNotificationAppEncerrado({
                tela: tela,
                idChat: idChat,
                nomeTopBar: contato,
                idAnimal: idAnimal,
                nomeAnimal: nomeAnimal
            });

            await Notifications.dismissAllNotificationsAsync();
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


export async function returnArrayTokens(userId : string) {

    const tokensDocRef = collection(db, "Users", userId, 'ExpoTokens');

    const q = query(tokensDocRef);

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




