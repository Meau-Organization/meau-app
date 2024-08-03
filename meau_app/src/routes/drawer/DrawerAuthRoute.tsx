import { createDrawerNavigator } from '@react-navigation/drawer';

import { Ionicons , AntDesign} from '@expo/vector-icons';

import { View, StatusBar } from 'react-native';

import Inicial from '../../screens/Inicial';

import { NavigationState, useNavigationState } from '@react-navigation/native';
import MeusPets from '../../screens/MeusPets';
import MeuPerfil from '../../screens/MeuPerfil';
import Adotar from '../../screens/Adotar';
//import Chat from '../../screens/Chat';

const DrawerAuth = createDrawerNavigator();

interface coresPaginas {
    [key:string]: string;
    }

interface titulosPaginas {
    [key:string]: string;
}

export default function DrawerRouteAuth() {

    const estadoNav = useNavigationState(estado => estado);
    const rotaAtiva = (estadoNav: NavigationState): string => {

        const rota = estadoNav.routes[estadoNav.index];

        if (rota.state) {
            return rotaAtiva(rota.state as NavigationState);
        }
        return rota.name;
    };


    const nomeRotaAtiva = rotaAtiva(estadoNav);
    console.log(nomeRotaAtiva);

    const coresHeader: coresPaginas = {
        Login: '#88c9bf',
        CadastroPessoal: '#88c9bf',
        AvisoCadastro: '#88c9bf',
        Chat : '#787945',
    };

    const coresIconeHeader: coresPaginas = {
        Login: '#88c9bf',
        CadastroPessoal: '#434343',
        AvisoCadastro: '#434343',
        Chat : '#7374',
    };

    const titulos_paginas: titulosPaginas = {
        Login: 'Login',
        CadastroPessoal: 'Cadastro Pessoal',
        AvisoCadastro: 'Aviso de Cadastro',
        Chat : 'Chat',
    };

    return(
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="#88c9bf" barStyle="light-content" />
        
            <DrawerAuth.Navigator
                screenOptions={{
                    title: titulos_paginas[nomeRotaAtiva] === undefined ? '' : titulos_paginas[nomeRotaAtiva],
                    headerTintColor: coresIconeHeader[nomeRotaAtiva] === undefined ? '#88c9bf' : coresIconeHeader[nomeRotaAtiva],
                    headerStyle: {
                        backgroundColor: coresHeader[nomeRotaAtiva] === undefined ? '#fafafa' : coresHeader[nomeRotaAtiva],
                    },
                    headerShadowVisible: false,
                }}>


                <DrawerAuth.Screen
                    name = "Home"
                    component={Inicial}
                    options={{
                        drawerLabel: 'Inicio',
                        drawerIcon: ({color, size}) => <Ionicons name="menu" size={24} color={'#88c9bf'}/>
                    }}
                />
                
                <DrawerAuth.Screen
                    name = "Adotar"
                    component={Adotar}
                    options={{
                        drawerLabel: 'Adotar',
                        drawerIcon: ({color, size}) => <AntDesign name="pluscircle" size={24} />
                    }}
                />

            </DrawerAuth.Navigator>
        </View>
    )
}