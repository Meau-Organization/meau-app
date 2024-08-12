
import { useEffect } from 'react';

import 'react-native-gesture-handler';

//import './seedFirestore.js' // DESCOMENTAR APENAS PARA SEED

import * as SplashScreen from 'expo-splash-screen';

import Routes from './src/routes/Routes';
import { AutenticacaoUserProvider } from './src/assets/contexts/AutenticacaoUserContext';
import { auth, getAuth, onAuthStateChanged} from './src/configs/firebaseConfig';


SplashScreen.preventAutoHideAsync()
    .then((result) => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
    .catch(console.warn);



export default function App() {

    useEffect(()=> {
        SplashScreen.hideAsync();
    }, []);

    return (
        <AutenticacaoUserProvider>
            <Routes/>
        </AutenticacaoUserProvider>
    );
}
