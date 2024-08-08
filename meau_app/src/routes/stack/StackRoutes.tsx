import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import Login from '../../screens/Login';
import Inicial from '../../screens/Inicial';
import AvisoCadastro from '../../screens/AvisoCadastro';
import CadastroPessoal from '../../screens/forms/users/CadastroPessoal';
import CadastroAnimal from '../../screens/CadastroAnimal';
import PreencherCadastroAnimal from '../../screens/forms/pets/PreencherCadastroAnimal';

import { StackRoutesParametros } from '../../utils/StackRoutesParametros';
import DrawerRoutes from '../drawer/DrawerRoutes';
import DetalhesAnimal from '../../screens/DetalhesAnimal';
import DetalhesAnimalAdocao from '../../screens/DetalhesAnimalAdocao';
import { useNavigationState , NavigationState} from '@react-navigation/native';
import { useAutenticacaoUser } from '../../../assets/contexts/AutenticacaoUserContext';

import ChatScreen from '../../screens/Chat';

const Stack = createNativeStackNavigator<StackRoutesParametros>();
    
export default function StackRoutes() {

    const { user } = useAutenticacaoUser();

    const estadoNavegacao = useNavigationState(state => state);

    const rotaAtiva = (estadoNavegacao: NavigationState): string => {
        if (!estadoNavegacao || !estadoNavegacao.routes) {
            return 'Desconhecido';
        }
        const rota = estadoNavegacao.routes[estadoNavegacao.index];
        if (rota.state) {
            return rotaAtiva(rota.state as NavigationState);
        }
        return rota.name;
    };

    const nomeRotaAtiva = rotaAtiva(estadoNavegacao);
    console.log('StackRoutes - Rota Ativa:', nomeRotaAtiva);

    const telaInicial = "DrawerRoutes";

    return (
        <Stack.Navigator initialRouteName={telaInicial} screenOptions={{ headerShown: false }}>

            <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} />

            <Stack.Screen name="Inicial" component={Inicial} initialParams={{userEstado: 23}} options={{title:'Inicial', animationTypeForReplace: user === null  ? 'pop' : 'push',}}/>

            <Stack.Screen name="AvisoCadastro" component={AvisoCadastro} />

            <Stack.Screen name="Login" component={Login} />

            <Stack.Screen name="CadastroPessoal" component={CadastroPessoal} />

            <Stack.Screen name="CadastroAnimal" component={CadastroAnimal} />

            <Stack.Screen name="PreencherCadastroAnimal" component={PreencherCadastroAnimal} />

            <Stack.Screen name="DetalhesAnimal" component={DetalhesAnimal}  />

            <Stack.Screen name="DetalhesAnimalAdocao" component={DetalhesAnimalAdocao}  />

            <Stack.Screen name="ChatScreen" component={ChatScreen}  />

        </Stack.Navigator>
    );
}