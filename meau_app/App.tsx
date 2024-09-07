import 'react-native-gesture-handler';
import Routes from './src/routes/Routes';
import * as Notifications from 'expo-notifications';
import { MeauData, MensagemData } from './src/utils/UtilsType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { extrairAtributoNotificationJson } from './src/utils/UtilsNotification';
import { AutenticacaoUserProvider } from './src/assets/contexts/AutenticacaoUserContext';

Notifications.setNotificationHandler({

    handleNotification: async (notification) => {

        let mostrarNotification: boolean = true;
        let mostrarNotificationChat: boolean = true;

        console.log('HANDLENOTIFICATION ---------------------', notification);

        const meauData : MeauData = await extrairAtributoNotificationJson("meau_data", notification);

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

export default function App() {

    return (
        <AutenticacaoUserProvider>
            <Routes />
        </AutenticacaoUserProvider>
    );
}