
import Login from "../../screens/Login";
import DrawerRoutes from '../drawer/DrawerRoutes';
import AvisoCadastro from "../../screens/AvisoCadastro";
import { StackRoutesParametros } from "../../utils/UtilsType";
import DetalhesAnimalAdocao from "../../screens/DetalhesAnimalAdocao";
import CadastroPessoal from "../../screens/forms/users/CadastroPessoal";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigationState , NavigationState} from '@react-navigation/native';

const Stack = createNativeStackNavigator<StackRoutesParametros>();

export default function AuthStack() {

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
    console.log('AuthStack - Rota Ativa:', nomeRotaAtiva);

    const telaInicial = "DrawerRoutes";

    return (
        <Stack.Navigator initialRouteName={telaInicial} screenOptions={{ headerShown: false }}>
            
            <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} />

            <Stack.Screen name="Login" component={Login}  />

            <Stack.Screen name="CadastroPessoal" component={CadastroPessoal} />

            <Stack.Screen name="AvisoCadastro" component={AvisoCadastro} />

            <Stack.Screen name="DetalhesAnimalAdocao" component={DetalhesAnimalAdocao} />

        </Stack.Navigator>

    )
}