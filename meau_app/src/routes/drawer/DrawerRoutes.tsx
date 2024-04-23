import { DrawerScreenProps, createDrawerNavigator } from '@react-navigation/drawer'

import { Ionicons , AntDesign} from '@expo/vector-icons';

import StackRoutes from '../stack/StackRoutes'
import { View, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import CadastroAnimal from '../../screens/CadastroAnimal';
import PreencherCadastroAnimal from '../../screens/forms/pets/PreencherCadastroAnimal';
import Inicial from '../../screens/Inicial';

import { StackRoutesParametros } from '../../utils/StackRoutesParametros';
import Loading from '../../screens/Loading';
import { NavigationState, useNavigationState } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

interface coresPaginas {
    [key: string]: string;
}


export default function DrawerRoutes() {

    const estadoNavegacao = useNavigationState(estado => estado);
  
    const rotaAtiva = (estadoNavegacao : NavigationState): string => {
        
        const rota = estadoNavegacao.routes[estadoNavegacao.index];

        if (rota.state) {
            return rotaAtiva(rota.state as NavigationState);
        }
        return rota.name;
    };

    const nomeRotaAtiva = rotaAtiva(estadoNavegacao);
    // console.log(nomeRotaAtiva);

    
    const coresHeader: coresPaginas = {
        Home: '#fafafa',
        PreencherCadastroAnimal: '#ffd358',
    };
    const coresIconeHeader: coresPaginas = {
        Home: '#88c9bf',
        PreencherCadastroAnimal: '#434343',
    };


    return(
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="#88c9bf" barStyle="light-content" />
        
            <Drawer.Navigator
                screenOptions={{
                    title: '',
                    headerTintColor: coresIconeHeader[nomeRotaAtiva] === undefined ? '#88c9bf' : coresIconeHeader[nomeRotaAtiva],
                    headerStyle: {
                        backgroundColor: coresHeader[nomeRotaAtiva] === undefined ? '#fafafa' : coresHeader[nomeRotaAtiva],
                    },
                    headerShadowVisible: false,
                }}>


                <Drawer.Screen
                    name = "Home"
                    component={Inicial}
                    options={{
                        drawerLabel: 'Inicio',
                        drawerIcon: ({color, size}) => <Ionicons name="menu" size={24} color={'#88c9bf'}/>
                    }}
                />

                <Drawer.Screen
                    name = "PreencherCadastroAnimal"
                    component={PreencherCadastroAnimal}
                    options={{
                        drawerLabel: 'Cadastrar Animal',
                        drawerIcon: ({color, size}) => <AntDesign name="pluscircle" size={24} />
                    }}
                />

            </Drawer.Navigator>
        </View>
    )

}