
import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SendNotificationsProps {
    token: string;
    title:string;
    body:string;
}


export async function SendNotifications({ token, title, body }: SendNotificationsProps) {
    console.log("SendNotifications component montado");

    //console.log("Enviando notificação para token:", token); // Verifique se esta linha está sendo executada

    const message = {
        to: token, // The recipient's push token
        title: title,
        body: body,
        sound: 'default',
        /*
        android: {
            sound: true,
            priority: 'high',
            vibrate: true,
        },
        ios: {
            sound: true,
            badge: true,
            priority: 'high',
            contentAvailable: true,
            category: 'NEW_MESSAGE',
        },
        */
        // You can also include custom data in the notification payload.
        
    }

    try{
        //console.log("Enviando notificação para token:", token); // Verifique se esta linha está sendo executada

    // Realiza uma requisição HTTP (GET)
        const response = await fetch("https://exp.host/--/api/v2/push/send",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',                
            },
            body: JSON.stringify(message),
        // If you want to send a notification to multiple devices, replace 'E  xponentPushToken[your_expo_push_token]' with an array of token strings.
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Resposta do servidor: " + data);
    }
    catch(error){
        /**Some of these failures are temporary. 
         * For example, if the Expo push notification service is down an HTTP 429 error (Too Many Requests), or an HTTP 5xx error (Server Errors)
         * if your push notification payload is malformed, you may get an HTTP 400 response explaining the issue with the payload. 
         * You will also get an error if there are no push credentials for your project or if you send push notifications for different projects in the same request. */
        console.error("Erro ao enviar notificação: " + error);
    }
}