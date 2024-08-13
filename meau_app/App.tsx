import 'react-native-gesture-handler';
import Routes from './src/routes/Routes';
import { AutenticacaoUserProvider } from './assets/contexts/AutenticacaoUserContext';

//import './seedFirestore.js' // DESCOMENTAR APENAS PARA SEED

export default function App() {

    return (
        <AutenticacaoUserProvider>
            <Routes/>
        </AutenticacaoUserProvider>
    );
}