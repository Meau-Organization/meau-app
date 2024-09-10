import 'react-native-gesture-handler';
import Routes from './src/routes/Routes';
import { AutenticacaoUserProvider } from './src/assets/contexts/AutenticacaoUserContext';

export default function App() {

    return (
        <AutenticacaoUserProvider>
            <Routes />
        </AutenticacaoUserProvider>
    );
}