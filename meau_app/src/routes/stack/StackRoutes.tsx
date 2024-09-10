import { useEffect } from 'react';
import Login from '../../screens/Login';
import DrawerRoutes from '../drawer/DrawerRoutes';
import ChatScreen from '../../screens/ChatScreen';
import Interessados from '../../screens/Interessados';
import AvisoCadastro from '../../screens/AvisoCadastro';
import { processarRota } from '../../utils/UtilsGeral';
import DetalhesAnimal from '../../screens/DetalhesAnimal';
import AvisoNotification from '../../screens/AvisoNotification';
import { useNomeRotaAtiva } from '../../hooks/useNomeRotaAtiva';
import DetalhesAnimalAdocao from '../../screens/DetalhesAnimalAdocao';
import CadastroPessoal from '../../screens/forms/users/CadastroPessoal';
import SucessoCadastroAnimal from '../../screens/SucessoCadastroAnimal';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAutenticacaoUser } from '../../assets/contexts/AutenticacaoUserContext';
import PreencherCadastroAnimal from '../../screens/forms/pets/PreencherCadastroAnimal';
import { useNavigation } from '@react-navigation/native';
import { listenerNotificationClick, listenerNotificationGlobal, registrarDispositivoAutomaticamente } from '../../utils/UtilsNotification';
import { NativeStackNavigationProps, StackRoutesParametros } from '../../utils/UtilsType';

const Stack = createNativeStackNavigator<StackRoutesParametros>();

export default function StackRoutes() {

    const navigationStack = useNavigation<NativeStackNavigationProps>();

    const { user, dadosUser, statusExpoToken, setStatusExpoToken, notificationAppEncerrado } = useAutenticacaoUser();
    
    let nomeRotaAtiva = useNomeRotaAtiva();

    const telaInicial =
        statusExpoToken.permissaoNotifcations !== 'granted' && !statusExpoToken.userNegou ? "AvisoNotification" : notificationAppEncerrado ? notificationAppEncerrado.tela : "DrawerRoutes";

    useEffect(() => {
        if (nomeRotaAtiva == 'Desconhecido') {
            nomeRotaAtiva = telaInicial;
        }
        console.log('StackRoutes - Rota Ativa:', nomeRotaAtiva);

        processarRota(nomeRotaAtiva);

    }, [nomeRotaAtiva]);

    useEffect(() => {

        registrarDispositivoAutomaticamente(user, dadosUser, nomeRotaAtiva, statusExpoToken, setStatusExpoToken);

        listenerNotificationGlobal();

        listenerNotificationClick(user, navigationStack);

    }, []);

    //console.log('--------------------> ', statusExpoToken, notificationAppEncerrado);

    return (
        <Stack.Navigator initialRouteName={telaInicial} screenOptions={{ headerShown: false }}>

            <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} />

            {/* <Stack.Screen name="Inicial" component={Inicial} initialParams={{ userEstado: 23 }} options={{ title: 'Inicial', animationTypeForReplace: user === null ? 'pop' : 'push', }} /> */}

            <Stack.Screen name="AvisoCadastro" component={AvisoCadastro} initialParams={{ topbar: true }} />

            <Stack.Screen name="Login" component={Login} />

            <Stack.Screen name="CadastroPessoal" component={CadastroPessoal} />

            <Stack.Screen name="SucessoCadastroAnimal" component={SucessoCadastroAnimal} />

            <Stack.Screen name="PreencherCadastroAnimal" component={PreencherCadastroAnimal} />

            <Stack.Screen name="DetalhesAnimal" component={DetalhesAnimal} />

            <Stack.Screen name="DetalhesAnimalAdocao" component={DetalhesAnimalAdocao} />

            <Stack.Screen name="ChatScreen"
                component={ChatScreen}
                initialParams={{
                    idChat: notificationAppEncerrado ? notificationAppEncerrado.idChat : '',
                    nomeTopBar: notificationAppEncerrado ? notificationAppEncerrado.nomeTopBar : '',
                }}
            />

            <Stack.Screen name="AvisoNotification" component={AvisoNotification} initialParams={{ topbar: true }} />

            <Stack.Screen name="Interessados"
                component={Interessados}
                initialParams={{
                    id_dono: notificationAppEncerrado ? notificationAppEncerrado.idDono : '',
                    //id_interessado: notificationAppEncerrado ? notificationAppEncerrado.idInteressado : '',
                    animal_id: notificationAppEncerrado ? notificationAppEncerrado.idAnimal : '',
                    nome_animal: notificationAppEncerrado ? notificationAppEncerrado.nomeAnimal : '',
                }}
            />

        </Stack.Navigator>
    );

}