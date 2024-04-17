import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../../screens/Login';
import Inicial from '../../screens/Inicial';
import AvisoCadastro from '../../screens/AvisoCadastro';
import CadastroPessoal from '../../screens/CadastroPessoal';
import CadastroAnimal from '../../screens/CadastroAnimal';
import PreencherCadastroAnimal from '../../screens/PreencherCadastroAnimal';

import { StackRoutesParametros } from '../../utils/StackRoutesParametros';
import Loading from '../../screens/Loading';
import TesteLogado from '../../screens/TesteLogado';

const Stack = createNativeStackNavigator<StackRoutesParametros>();

    
export default function StackRoutes() {


    const telaInicial = "Inicial";

    return (
        <Stack.Navigator initialRouteName={telaInicial} screenOptions={{ headerShown: false }}>

            <Stack.Screen name="Inicial" component={Inicial} initialParams={{userEstado: 23}}/>

            <Stack.Screen name="AvisoCadastro" component={AvisoCadastro} />

            <Stack.Screen name="Login" component={Login} />

            <Stack.Screen name="CadastroPessoal" component={CadastroPessoal} />

            <Stack.Screen name="CadastroAnimal" component={CadastroAnimal} />

            <Stack.Screen name="PreencherCadastroAnimal" component={PreencherCadastroAnimal} />

            <Stack.Screen name="Loading" component={Loading} />

            <Stack.Screen name="TesteLogado" component={TesteLogado} />

        </Stack.Navigator>
    );
}