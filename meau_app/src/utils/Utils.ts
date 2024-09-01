
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { addDoc, collection, db, doc, getDoc, getDocs, limitToLast, orderBy, query, setDoc, updateDoc, where } from '../configs/firebaseConfig.js'
import { Platform } from 'react-native';
import { NavigationState } from '@react-navigation/native';

type Trigger = {
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

    const expoTokenRef = doc(db, 'Users', userId, 'ExpoTokens', userId);
    const expoTokenDoc = await getDoc(expoTokenRef);

    if (expoTokenDoc.exists()) {

        let expoTokens = expoTokenDoc.data().expoTokens;

        if (expoTokens && Object.keys(expoTokens).length > 0) {

            const promises = expoTokens.map(async (item, index) => {
                if (item.idInstalacao == installationId) {
                    const expoTokenRemoto = item;
                    statusInstalation = true;

                    const tokenLocal = await getTokenArmazenado();
                    if (tokenLocal) {

                        statusExpoTokenLocal = true;
                        if (expoTokenRemoto.expoPushToken == tokenLocal) {
                            statusExpoTokenRemoto = true;
                        } else {
                            console.log('-----------------------------------------------> nao e igual')
                            expoTokens[index].ativo = false;
                        }
                    }
                }
            });
            await Promise.all(promises);

            if (JSON.stringify(expoTokenDoc.data().expoTokens) !== JSON.stringify(expoTokens)) {
                await updateDoc(expoTokenRef, { expoTokens: expoTokens });
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
    try {
        const idInstalacao = await getOrCreateInstallationId();

        const subExpoTokensRef = collection(doc(db, 'Users', userId), 'ExpoTokens');

        let expoTokensUpdate = [];
        if (dadosUser.expoTokens && Object.keys(dadosUser.expoTokens).length > 0) {
            expoTokensUpdate = dadosUser.expoTokens.filter((item: any) => item.ativo !== false);
        }



        if (statusExpoToken.statusInstalation) {
            if (!statusExpoToken.statusExpoTokenRemoto) {
                const indexToken = expoTokensUpdate.findIndex(item => item.idInstalacao === idInstalacao);
                if (indexToken > -1) {
                    expoTokensUpdate[indexToken].expoPushToken = token;
                } else {
                    expoTokensUpdate.push({ idInstalacao: idInstalacao, expoPushToken: token, ativo: true });        
                }
                await setDoc(doc(subExpoTokensRef, userId), { expoTokens: expoTokensUpdate });
            }

        } else {
            expoTokensUpdate.push({ idInstalacao: idInstalacao, expoPushToken: token, ativo: true });
            await setDoc(doc(subExpoTokensRef, userId), { expoTokens: expoTokensUpdate });
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


export async function limparNotifications(canal: string, chave: string, tudoPorCanal: boolean) {
    console.log('limparNotifications')

    const presentedNotifications = await Notifications.getPresentedNotificationsAsync();

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
            
            if (notifi.request.content.data.idChat == chave) {
                await Notifications.dismissNotificationAsync(notifi.request.identifier);
            }
        });
    }
    else if (canal == 'interessados') {
        presentedNotifications.map( async (notifi) => {
            
            if (notifi.request.content.data.idAnimal == chave) {
                await Notifications.dismissNotificationAsync(notifi.request.identifier);
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