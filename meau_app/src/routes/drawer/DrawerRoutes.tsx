import Adotar from '../../screens/Adotar';
import Config from '../../screens/Config';
import Inicial from '../../screens/Inicial';
import MeusPets from '../../screens/MeusPets';
import Conversas from '../../screens/Conversas';
import MeuPerfil from '../../screens/MeuPerfil';
import { NavigationState, useNavigationState } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer'
import Favoritos from '../../screens/Favoritos';
import { DrawerRoutesParametros } from '../../utils/UtilsType';
import CustomDrawerContent from '../../components/CustomDrawerContent';

const Drawer = createDrawerNavigator<DrawerRoutesParametros>();

interface estilosHeaderMap {
    [key: string]: string;
}

export default function DrawerRoutes() {

    const estadoNavegacao = useNavigationState(estado => estado);

    const rotaAtiva = (estadoNavegacao: NavigationState): string => {

        const rota = estadoNavegacao.routes[estadoNavegacao.index];

        if (rota.state) {
            return rotaAtiva(rota.state as NavigationState);
        }
        return rota.name;
    };

    const nomeRotaAtiva = rotaAtiva(estadoNavegacao);
    //console.log(nomeRotaAtiva);

    const coresHeader: estilosHeaderMap = {
        DrawerRoutes: '#fafafa',
        Inicial: '#fafafa',
        MeusPets: '#88c9bf',
        MeuPerfil: '#cfe9e5',
        Adotar: '#ffd358',
        Conversas: '#88c9bf', //#589b9b
        Config: '#e6e7e8',
        Favoritos: '#88c9bf'
    };
    const coresIconeHeader: estilosHeaderMap = {
        DrawerRoutes: '#88c9bf',
        Inicial: '#88c9bf',
        MeusPets: '#434343',
        MeuPerfil: '#434343',
        Adotar: '#434343',
        Conversas: '#434343',
        Config: '#434343',
        Favoritos: '#434343'
    };
    const titulos_paginas: estilosHeaderMap = {
        Inicial: '',
        MeusPets: 'Meus Pets',
        MeuPerfil: 'Meu Perfil',
        Adotar: 'Adotar',
        Conversas: 'Chat',
        Config: 'Privacidade',
        Favoritos: 'Favoritos'
    };

    return (
        <Drawer.Navigator
            initialRouteName='Inicial'
            screenOptions={({ route }) => ({
                title: titulos_paginas[nomeRotaAtiva] === undefined ? '' : titulos_paginas[nomeRotaAtiva],
                headerTintColor: coresIconeHeader[nomeRotaAtiva] === undefined ? '#88c9bf' : coresIconeHeader[nomeRotaAtiva],
                headerStyle: {
                    backgroundColor: coresHeader[nomeRotaAtiva] === undefined ? '#fafefe' : coresHeader[nomeRotaAtiva],
                },
                headerShadowVisible: false,
            })}
            drawerContent={(props) => <CustomDrawerContent {...props} />}>
            {/* As Screens são registradas aqui, mas o conteúdo é gerenciado pelo CustomDrawerContent */}
            <Drawer.Screen name="Inicial" component={Inicial} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="MeuPerfil" component={MeuPerfil} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="MeusPets" component={MeusPets} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="Adotar" component={Adotar} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="Favoritos" component={Favoritos} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="Conversas" component={Conversas} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="Config" component={Config} options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer.Navigator>
    )

}