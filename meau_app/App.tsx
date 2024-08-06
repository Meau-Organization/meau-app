
import { useEffect, useState } from 'react';

import 'react-native-gesture-handler';

//import './seedFirestore.js' // DESCOMENTAR APENAS PARA SEED

import * as SplashScreen from 'expo-splash-screen';

import Routes from './src/routes/Routes';
import { AutenticacaoUserProvider } from './assets/contexts/AutenticacaoUserContext';
import { auth, getAuth, onAuthStateChanged} from './src/configs/firebaseConfig';


SplashScreen.preventAutoHideAsync()
    .then((result) => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
    .catch(console.warn);



export default function App() {
    const [ user, setUser ] = useState<any>(); //any para ajustar conforme o necessario
    
    useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
            console.log("Teste USUARIO 2"+ "estadoUser: " + user);
            if (user) {
                setUser(user); // Atualiza o estado com o usuário autenticado
                console.log("Usuario logado: " + user.email);
            } else {
                setUser(null);  // Atualiza o estado para null se não houver usuário
                console.log("Usuario off ");
            }
            SplashScreen.hideAsync();
        });
        return () => unsubscribe(); // Limpeza do listener ao desmontar o componente
    }, []);
    


    return (
        <AutenticacaoUserProvider value={{ user, setUser }}>
            <Routes/>
        </AutenticacaoUserProvider>
    );
}
