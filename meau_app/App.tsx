
import { useEffect, useState } from 'react';

import 'react-native-gesture-handler';

import * as SplashScreen from 'expo-splash-screen';

import Routes from './src/routes/Routes';
import { auth, getAuth, onAuthStateChanged} from './src/configs/firebaseConfig';


SplashScreen.preventAutoHideAsync()
    .then((result) => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
    .catch(console.warn);



export default function App() {
    

    useEffect(() => {

        //auth.onAuthStateChanged( (user) => {
        onAuthStateChanged(getAuth(), (user) => {
            console.log("Teste USUARIO 2");
            if (user) {
                console.log("Usuario logado: " + user.email);
            } else {
                console.log("Usuario off ");
            }
           
            SplashScreen.hideAsync();
        });
        
    }, []);
    


    return (
        <Routes/>
    );
}
