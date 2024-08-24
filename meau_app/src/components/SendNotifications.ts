
import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SendNotificationsProps {
    token: string;
    title: string;
    body: string;
}


export default async function SendNotifications(token: string | string[], title: string, body: string, canal: string, grupo?: string, dados?: object) {
    console.log("SendNotifications component montado");

    //console.log("Enviando notificação para token:", token);                               // Verifique se esta linha está sendo executada

    // const message = {
    //     to: token,                                                                          // The recipient's push token
    //     data: dados,
    //     title: title,
    //     body: body,
    //     priority: 'normal',
    //     channelId: 'mensagens',
    //     groupId: 'Mensagens-android',
    //     categoryId: 'Mensagens-android',
    //     sound: undefined

    // }
    const message = {
        "to": token,
        "content_available": true,
        "priority": "high",
        "data": {
            "notificationData": {
                "message": "Nova mensagem de background!",
                "extraInfo": "Testando nofitificação em segundo plano"
            }
        }
      }
      

    console.log('Corpo', message);


    try {
        //console.log("Enviando notificação para token:", token);                           // Verifique se esta linha está sendo executada

        // Realiza uma requisição HTTP (GET)
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
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