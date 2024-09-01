import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
import { useAutenticacaoUser } from '../../assets/contexts/AutenticacaoUserContext';

import ChatScreen from '../../screens/ChatScreen';
import Config from '../../screens/Config';
import AvisoNotification from '../../screens/AvisoNotification';
import { useNomeRotaAtiva } from '../../hooks/useNomeRotaAtiva';
import { useEffect } from 'react';
import { salvarRotaAtiva } from '../../utils/Utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Interessados from '../../screens/Interessados';

const Stack = createNativeStackNavigator<StackRoutesParametros>();
    
export default function StackRoutes() {

    const { user, statusExpoToken } = useAutenticacaoUser();

    // const estadoNavegacao = useNavigationState(state => state);

    // const rotaAtiva = (estadoNavegacao: NavigationState): string => {
    //     if (!estadoNavegacao || !estadoNavegacao.routes) {
    //         return 'Desconhecido';
    //     }
    //     const rota = estadoNavegacao.routes[estadoNavegacao.index];
    //     if (rota.state) {
    //         return rotaAtiva(rota.state as NavigationState);
    //     }
    //     return rota.name;
    // };
    const nomeRotaAtiva = useNomeRotaAtiva();

    useEffect(() => {
        console.log('StackRoutes - Rota Ativa:', nomeRotaAtiva);
        
        async function save() {
            const nomeRotaArmazenada = await AsyncStorage.getItem('@rotaAtiva');
            const [preFixoRotaAtiva, _] = nomeRotaArmazenada.split(':');
            //console.log('Pre-fixo ROTA:', preFixoRotaAtiva);
            if (nomeRotaAtiva != preFixoRotaAtiva) {
                await salvarRotaAtiva(nomeRotaAtiva);
            }

        };
        save();
        
    }, [nomeRotaAtiva]);
    

    

    //console.log('--------------------> ', statusExpoToken);
    const telaInicial = statusExpoToken.permissaoNotifcations !== 'granted' ?  "AvisoNotification" : "DrawerRoutes";

    return (
        <Stack.Navigator initialRouteName={telaInicial} screenOptions={{ headerShown: false }}>

            <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} />

            <Stack.Screen name="Inicial" component={Inicial} initialParams={{userEstado: 23}} options={{title:'Inicial', animationTypeForReplace: user === null  ? 'pop' : 'push',}}/>

            <Stack.Screen name="AvisoCadastro" component={AvisoCadastro} initialParams={{topbar: true}}/>

            <Stack.Screen name="Login" component={Login} />

            <Stack.Screen name="CadastroPessoal" component={CadastroPessoal} />

            <Stack.Screen name="CadastroAnimal" component={CadastroAnimal} />

            <Stack.Screen name="PreencherCadastroAnimal" component={PreencherCadastroAnimal} />

            <Stack.Screen name="DetalhesAnimal" component={DetalhesAnimal}  />

            <Stack.Screen name="DetalhesAnimalAdocao" component={DetalhesAnimalAdocao}  />

            <Stack.Screen name="ChatScreen" component={ChatScreen} />

            <Stack.Screen name="Config" component={Config} />

            <Stack.Screen name="AvisoNotification" component={AvisoNotification} initialParams={{topbar: true}} />

            <Stack.Screen name="Interessados" component={Interessados}  />

        </Stack.Navigator>
    );
}