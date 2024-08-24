import 'react-native-gesture-handler';
import Routes from './src/routes/Routes';
import { AutenticacaoUserProvider } from './src/assets/contexts/AutenticacaoUserContext';


import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

const BACKGROUND_FETCH_TASK = 'BACKGROUND_FETCH_TASK';

interface data {
    notificationData: {
        message: string;
        extraInfo: string;
    }
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async ({ data, error }) => {
    if (error) {

        console.error('Erro na tarefa de background:', error);
        return BackgroundFetch;
    }

    try {
        console.log('--------------------------> DEFINIU TAREFA');


        const Data = data as data || null;

        if (Data) {

            console.log('Dados recebidos:', Data.notificationData);

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: Data.notificationData.message,
                    body: Data.notificationData.extraInfo || "Você recebeu uma nova notificação silenciosa.",
                    sound: true,
                },
                trigger: null, 
            });

            return BackgroundFetch;
        }

        return BackgroundFetch;
    } catch (err) {
        console.error('Erro ao processar notificação silenciosa:', err);
        return BackgroundFetch;
    }
});

async function registerBackgroundTask() {
    try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 60,
            stopOnTerminate: true,
            startOnBoot: true,
        });
        console.log('--------------------------> Tarefa de background registrada com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar tarefa de background:', error);
    }
}





//import './seedFirestore.js' // DESCOMENTAR APENAS PARA SEED


// import * as TaskManager from 'expo-task-manager';
// import * as Notifications from 'expo-notifications';
// import { Alert } from 'react-native';

// const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

// TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
//   console.log('Received a notification in the background!', data);
//   // Do something with the notification data
// });

// Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);


export default function App() {
    useEffect(() => {
        registerBackgroundTask();
    }, []);

    return (
        <AutenticacaoUserProvider>
            <Routes />
        </AutenticacaoUserProvider>
    );
}