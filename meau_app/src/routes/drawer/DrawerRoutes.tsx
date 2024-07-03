import { createDrawerNavigator } from '@react-navigation/drawer'

import { Ionicons , AntDesign} from '@expo/vector-icons';

import { View, StatusBar } from 'react-native';

import Inicial from '../../screens/Inicial';

import { NavigationState, useNavigationState } from '@react-navigation/native';
import MeusPets from '../../screens/MeusPets';

const Drawer = createDrawerNavigator();

interface coresPaginas {
    [key: string]: string;
}

interface titulosPaginas {
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
        MeusPets: '#88c9bf',
    };
    const coresIconeHeader: coresPaginas = {
        Home: '#88c9bf',
        MeusPets: '#434343',
    };
    const titulos_paginas: titulosPaginas = {
        Home: '',
        MeusPets: 'Meus Pets',
    };


    return(
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="#88c9bf" barStyle="light-content" />
        
            <Drawer.Navigator
                screenOptions={{
                    title: titulos_paginas[nomeRotaAtiva] === undefined ? '' : titulos_paginas[nomeRotaAtiva],
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
                    name = "MeusPets"
                    component={MeusPets}
                    options={{
                        drawerLabel: 'Meus Pets',
                        drawerIcon: ({color, size}) => <AntDesign name="pluscircle" size={24} />
                    }}
                    //initialParams={{ recarregar: false, usuario_id: '' }}
                />

            </Drawer.Navigator>
        </View>
    )

}