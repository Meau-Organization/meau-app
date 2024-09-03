import 'react-native-gesture-handler';
import Routes from './src/routes/Routes';
import { AutenticacaoUserProvider } from './src/assets/contexts/AutenticacaoUserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Notifications.setNotificationHandler({

//     handleNotification: async (notification) => {

//         let mostrarNotification: boolean = true;
//         let mostrarNotificationChat: boolean = true;

//         //console.log('HANDLENOTIFICATION ---------------------', notification);

//         if (notification.request.content.data.idChat) {
//             //console.log('idChat Notificação:', notification.request.content.data.idChat);
//             const nomeRotaAtiva = await AsyncStorage.getItem('@rotaAtiva');
//             if (nomeRotaAtiva) {
//                 //console.log('nomeRotaAtiva:', nomeRotaAtiva);
//                 const [preFixoRotaAtiva, posFixoRotaAtiva] = nomeRotaAtiva.split(':');
//                 //console.log('Pos-fixo ROTA:', posFixoRotaAtiva);
//                 if (posFixoRotaAtiva) {
//                     if (posFixoRotaAtiva == notification.request.content.data.idChat) {
//                         mostrarNotificationChat = false;
//                         console.log('Notificação bloqueada Chat!!');
//                     }
//                 } else {
//                     if (preFixoRotaAtiva) {
//                         if (preFixoRotaAtiva == 'Conversas') {
//                             mostrarNotification = false;
//                             console.log('Popup bloqueado Conversas!!');
//                         }
//                     }
//                 }
//             }
//         }

//         if (!mostrarNotificationChat) {
//             mostrarNotification = false;
//         }

//         console.log('shouldShowAlert', (true && mostrarNotificationChat));
//         console.log('shouldPlaySound', (mostrarNotification));
//         console.log('shouldSetBadge', (mostrarNotification));

//         return {
//             shouldShowAlert: true && mostrarNotificationChat,
//             shouldPlaySound: mostrarNotification,
//             shouldSetBadge: mostrarNotification,
//             priority: Notifications.AndroidNotificationPriority.MAX
//         };
//     },
// });

// Notifications.setNotificationHandler({

//     handleNotification: async () => {

//         return {
//             shouldShowAlert: true,
//             shouldPlaySound: false,
//             shouldSetBadge: false,
//         }
//     }
// });


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});



export default function App() {

    return (
        <AutenticacaoUserProvider>
            <Routes />
        </AutenticacaoUserProvider>
    );
}