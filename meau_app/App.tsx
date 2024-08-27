import 'react-native-gesture-handler';
import Routes from './src/routes/Routes';
import { AutenticacaoUserProvider } from './src/assets/contexts/AutenticacaoUserContext';
import * as Notifications from 'expo-notifications';


// interface Notification {
//     date: number;
//     request: {
//         content: {
//             autoDismiss: boolean;
//             badge: number;
//             body: string;
//             data: Object;
//             sound: string;
//             sticky: boolean;
//             subtitle: string;
//             title: string
//         },
//         identifier: string;
//         trigger: {
//             channelId: string;
//             remoteMessage: Object;
//             type: string;
//         }
//     }
// };

// Notifications.setNotificationHandler({
//     handleNotification: async (notification) => {
//         // Manually display the notification for Android - till foreground issue is resolved

//         const isManualAndroidNotification = Platform.OS === 'android' && !notification.request.trigger;
//         if (Platform.OS === 'android' && notification.request.trigger) {

//             const canal = notification.request.trigger['remoteMessage'].data.channelId;
//             const content = notification.request.content;
//             console.log(notification.request)
//             await Notifications.scheduleNotificationAsync({
//                 content: {
//                     title: content.data.notificationData.message || '',
//                     body: content.data.notificationData.extraInfo || '',
//                     sound: true,
//                     priority: Notifications.AndroidNotificationPriority.MAX,
//                     launchImageName: './assets/icon_notificacoes.png'
//                 },
//                 trigger: null
//             });
//         }

//         return {
//             shouldShowAlert: Platform.OS === 'ios' || isManualAndroidNotification,
//             shouldPlaySound: Platform.OS === 'ios' || isManualAndroidNotification,
//             shouldSetBadge: false,
//         };
//     },
// });

// interface Data {
//     notification: {
//         originalPriority: number,
//         sentTime: number;
//         notification: object;
//         data: {
//             message: string;
//             title: string;
//             body: string,
//             scopeKey: string;
//             experienceId: string;
//             projectId: string;
//         },
//         to: string;
//         ttl: number
//         collapseKey: string;
//         messageType: string;
//         priority: number,
//         from: string;
//         messageId: string;
//     }
// }

//import './seedFirestore.js' // DESCOMENTAR APENAS PARA SEED


// import * as TaskManager from 'expo-task-manager';
// import * as Notifications from 'expo-notifications';
// import { Platform } from 'react-native';
// import { useEffect, useRef } from 'react';
// import { getOrCreateInstallationId } from './src/utils/Utils';

// const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

// TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
//     console.log('Received a notification in the background!', data);
//     const dados = data as Data;

//     const notificationData = JSON.parse(dados.notification.data.body);

//     console.log('----------------------------------> DADOS: ', notificationData);




//     async function dismissNotification(notificationIdentifier) {
//         try {
//             await Notifications.dismissNotificationAsync(notificationIdentifier);
//             console.log(`Notificação com o identificador ${notificationIdentifier} foi dispensada.`);
//         } catch (error) {
//             console.error("Erro ao dispensar a notificação:", error);
//         }
//     }

//     // // Exemplo de uso
//     // const notificationId = "notification-12345"; // Identificador da notificação
//     // dismissNotification(notificationId);


//     // // Cria e dispara uma notificação local
//     // await Notifications.scheduleNotificationAsync({
//     //     content: {
//     //         title: notificationData.notificationData.message,
//     //         body: notificationData.notificationData.extraInfo,
//     //         sound: true,
//     //     },
//     //     trigger: null, // Define o trigger como null para disparar imediatamente
//     // });
// });

// Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);


// Notifications.setNotificationHandler({
//     handleNotification: async (notification) => {
//         // Manually display the notification for Android - till foreground issue is resolved

//         const isManualAndroidNotification = Platform.OS === 'android' && !notification.request.trigger;
//         if (Platform.OS === 'android' && notification.request.trigger) {
//             const appNotification = notification.request.trigger['remoteMessage'].notification;
            
//             console.log('-------------------->', notification.request.trigger.channelId);
//             if (appNotification) {
//                 await Notifications.scheduleNotificationAsync({
//                     content: {
//                         title: appNotification?.title || '',
//                         body: appNotification?.body || '',
//                         sound: true,
//                     },
//                     trigger: null,
//                 });
//             }
//         }

//         return {
//             shouldShowAlert: Platform.OS === 'ios' || isManualAndroidNotification,
//             shouldPlaySound: Platform.OS === 'ios' || isManualAndroidNotification,
//             shouldSetBadge: false,
//         };
//     },
// });


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: Notifications.AndroidNotificationPriority.MAX
    }),
});



export default function App() {


    


    return (
        <AutenticacaoUserProvider>
            <Routes />
        </AutenticacaoUserProvider>
    );
}