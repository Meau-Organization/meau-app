import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import Login from '../../screens/Login';
import Inicial from '../../screens/Inicial';
import AvisoCadastro from '../../screens/AvisoCadastro';
import CadastroPessoal from '../../screens/forms/users/CadastroPessoal';
import CadastroAnimal from '../../screens/CadastroAnimal';
import PreencherCadastroAnimal from '../../screens/forms/pets/PreencherCadastroAnimal';

import { StackRoutesParametros } from '../../utils/StackRoutesParametros';
import Loading from '../../screens/Loading';
import TesteLogado from '../../screens/TesteLogado';
import ProtectTelas from '../../components/ProtectTelas';
import DrawerRoutes from '../drawer/DrawerRoutes';

const Stack = createNativeStackNavigator<StackRoutesParametros>();
    
export default function StackRoutes() {


    const telaInicial = "DrawerRoutes";

    return (
        <Stack.Navigator initialRouteName={telaInicial} screenOptions={{ headerShown: false }}>

            <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} />

            <Stack.Screen name="Inicial" component={Inicial} initialParams={{userEstado: 23}}/>

            <Stack.Screen name="AvisoCadastro" component={AvisoCadastro} />

            <Stack.Screen name="Login" component={Login} />

            <Stack.Screen name="CadastroPessoal" component={CadastroPessoal} />

            <Stack.Screen name="CadastroAnimal" component={CadastroAnimal} />

            <Stack.Screen name="PreencherCadastroAnimal" component={PreencherCadastroAnimal} />
            
            {/* <Stack.Screen name="ProtectTelas">
                {(navigation) =>
                        <ProtectTelas {...navigation}>
                            <PreencherCadastroAnimal {...navigation} />
                        </ProtectTelas>}
            </Stack.Screen> */}

            <Stack.Screen name="Loading" component={Loading} />

            <Stack.Screen name="TesteLogado" component={TesteLogado} />

        </Stack.Navigator>
    );
}