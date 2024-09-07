import { useEffect } from 'react';
import Login from '../../screens/Login';
import Config from '../../screens/Config';
import Inicial from '../../screens/Inicial';
import DrawerRoutes from '../drawer/DrawerRoutes';
import ChatScreen from '../../screens/ChatScreen';
import Interessados from '../../screens/Interessados';
import AvisoCadastro from '../../screens/AvisoCadastro';
import { processarRota, salvarRotaAtiva } from '../../utils/UtilsGeral';
import DetalhesAnimal from '../../screens/DetalhesAnimal';
import { InteressadoData, MeauData, MensagemData, StackRoutesParametros } from '../../utils/UtilsType';
import AvisoNotification from '../../screens/AvisoNotification';
import { useNomeRotaAtiva } from '../../hooks/useNomeRotaAtiva';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DetalhesAnimalAdocao from '../../screens/DetalhesAnimalAdocao';
import CadastroPessoal from '../../screens/forms/users/CadastroPessoal';
import SucessoCadastroAnimal from '../../screens/SucessoCadastroAnimal';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAutenticacaoUser } from '../../assets/contexts/AutenticacaoUserContext';
import PreencherCadastroAnimal from '../../screens/forms/pets/PreencherCadastroAnimal';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { extrairAtributoNotificationJson, limparNotifications, listenerNotificationClick, listenerNotificationGlobal, registrarDispositivoAutomaticamente } from '../../utils/UtilsNotification';

const Stack = createNativeStackNavigator<StackRoutesParametros>();

export default function StackRoutes() {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros>>();

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

        listenerNotificationClick(user, navigation);

    }, []);

    //console.log('--------------------> ', statusExpoToken, notificationAppEncerrado);

    return (
        <Stack.Navigator initialRouteName={telaInicial} screenOptions={{ headerShown: false }}>

            <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} />

            <Stack.Screen name="Inicial" component={Inicial} initialParams={{ userEstado: 23 }} options={{ title: 'Inicial', animationTypeForReplace: user === null ? 'pop' : 'push', }} />

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

            <Stack.Screen name="Config" component={Config}/>

            <Stack.Screen name="AvisoNotification" component={AvisoNotification} initialParams={{ topbar: true }} />

            <Stack.Screen name="Interessados"
                component={Interessados}
                initialParams={{
                    id_dono: notificationAppEncerrado ? notificationAppEncerrado.idDono : '',
                    id_interessado: notificationAppEncerrado ? notificationAppEncerrado.idInteressado : '',
                    animal_id: notificationAppEncerrado ? notificationAppEncerrado.idAnimal : '',
                    nome_animal: notificationAppEncerrado ? notificationAppEncerrado.nomeAnimal : '',
                }}
            />

        </Stack.Navigator>
    );

}