import 'react-native-gesture-handler';
import Routes from './src/routes/Routes';
import { AutenticacaoUserProvider } from './src/assets/contexts/AutenticacaoUserContext';


//import './seedFirestore.js' // DESCOMENTAR APENAS PARA SEED


import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  console.log('Received a notification in the background!', data);
  // Do something with the notification data
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);


export default function App() {

    return (
        <AutenticacaoUserProvider>
            <Routes/>
        </AutenticacaoUserProvider>
    );
}