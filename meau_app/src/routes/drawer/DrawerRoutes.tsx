import { createDrawerNavigator } from '@react-navigation/drawer'

import { Ionicons , AntDesign} from '@expo/vector-icons';

import { View, StatusBar } from 'react-native';

import Inicial from '../../screens/Inicial';

import { NavigationState, useNavigationState } from '@react-navigation/native';
import MeusPets from '../../screens/MeusPets';
import MeuPerfil from '../../screens/MeuPerfil';
import Adotar from '../../screens/Adotar';
import { useAutenticacaoUser } from '../../../assets/contexts/AutenticacaoUserContext';
import Conversas from '../../screens/Conversas';

const Drawer = createDrawerNavigator();

interface coresPaginas {
    [key: string]: string;
}

interface titulosPaginas {
    [key: string]: string;
}


export default function DrawerRoutes() {

    const { user } = useAutenticacaoUser();

    const estadoNavegacao = useNavigationState(estado => estado);
  
    const rotaAtiva = (estadoNavegacao : NavigationState): string => {
        
        const rota = estadoNavegacao.routes[estadoNavegacao.index];

        if (rota.state) {
            return rotaAtiva(rota.state as NavigationState);
        }
        return rota.name;
    };

    const nomeRotaAtiva = rotaAtiva(estadoNavegacao);
    console.log(nomeRotaAtiva);

    
    const coresHeader: coresPaginas = {
        Home: '#fafafa',
        MeusPets: '#88c9bf',
        MeuPerfil: '#cfe9e5',
        Adotar: '#ffd358',
        Conversas: '#589b9b',
    };
    const coresIconeHeader: coresPaginas = {
        Home: '#88c9bf',
        MeusPets: '#434343',
        MeuPerfil: '#434343',
        Adotar: '#434343',
        Conversas: '#434343',
    };
    const titulos_paginas: titulosPaginas = {
        Home: '',
        MeusPets: 'Meus Pets',
        MeuPerfil: 'Meu Perfil',
        Adotar: 'Adotar',
        Conversas: 'Chats'
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
                
                {user ? (
                    <>
                        <Drawer.Screen
                            name = "Home"
                            component={Inicial}
                            options={{
                                drawerLabel: 'Inicio',
                                drawerIcon: ({color, size}) => <Ionicons name="menu" size={24} color={'#88c9bf'}/>
                            }}
                        />
        
                        <Drawer.Screen
                            name = "MeuPerfil"
                            component={MeuPerfil}
                            options={{
                                drawerLabel: 'Meu Perfil',
                                drawerIcon: ({color, size}) => <AntDesign name="pluscircle" size={24} />
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
        
                        <Drawer.Screen
                            name = "Adotar"
                            component={Adotar}
                            options={{
                                drawerLabel: 'Adotar',
                                drawerIcon: ({color, size}) => <AntDesign name="pluscircle" size={24} />
                            }}

                        />

                        <Drawer.Screen
                            name = "Conversas"
                            component={Conversas}
                            options={{
                                drawerLabel: 'Conversas',
                                drawerIcon: ({color, size}) => <AntDesign name="pluscircle" size={24} />
                            }}
                            
                        />
                    </>

                ):(// Navegação para usuários não autenticados
                <>
                    <Drawer.Screen
                        name = "Home"
                        component={Inicial}
                        options={{
                            drawerLabel: 'Inicio',
                            drawerIcon: ({color, size}) => <Ionicons name="menu" size={24} color={'#88c9bf'}/>
                        }}
                    />
                    
                    <Drawer.Screen
                        name = "Adotar"
                        component={Adotar}
                        options={{
                            drawerLabel: 'Adotar',
                            drawerIcon: ({color, size}) => <AntDesign name="pluscircle" size={24} />
                        }}
                    />
                </>) }


            </Drawer.Navigator>
        </View>
    )

}