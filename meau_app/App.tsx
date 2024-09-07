import 'react-native-gesture-handler';
import Routes from './src/routes/Routes';
import * as Notifications from 'expo-notifications';
import { MeauData, MensagemData } from './src/utils/UtilsType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { extrairAtributoNotificationJson } from './src/utils/UtilsNotification';
import { AutenticacaoUserProvider } from './src/assets/contexts/AutenticacaoUserContext';

export default function App() {

    return (
        <AutenticacaoUserProvider>
            <Routes />
        </AutenticacaoUserProvider>
    );
}