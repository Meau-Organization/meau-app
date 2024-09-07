import { useState } from 'react';
import Adotar from '../../screens/Adotar';
import Config from '../../screens/Config';
import Inicial from '../../screens/Inicial';
import { Ionicons} from '@expo/vector-icons';
import MeusPets from '../../screens/MeusPets';
import Conversas from '../../screens/Conversas';
import MeuPerfil from '../../screens/MeuPerfil';
import Collapsible from 'react-native-collapsible';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, ImageBackground} from 'react-native';
import { NavigationState, useNavigationState } from '@react-navigation/native';
import { useAutenticacaoUser } from '../../assets/contexts/AutenticacaoUserContext';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'

const Drawer = createDrawerNavigator();

interface estilosHeaderMap {
    [key: string]: string;
}

function CustomDrawerContent(props) {
    const { user, dadosUser } = useAutenticacaoUser();
    const [ isAtalhosOpen,setAtalhosOpen ] = useState(false);
    const [isInfoOpen, setInfoOpen ] = useState(false);
    const [isConfOpen, setConfOpen] = useState(false);

    const toggleConf = () => setConfOpen(!isConfOpen);
    const toggleAtalhos= () => setAtalhosOpen(!isAtalhosOpen);
    const toggleInfo= () => setInfoOpen(!isInfoOpen);

    const handleLogout = () => {
        // Função para lidar com o logout
        console.log("Usuário deslogado");
        // Navegue para a tela de login ou altere o estado de autenticação como necessário
    };

    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.userSection}>
                {/* User section */}
                {dadosUser ? (
                    <ImageBackground
                        source={require('../../assets/images/cj.jpeg')}
                        imageStyle={{ borderRadius: 100}}
                        resizeMode="contain"
                        style={styles.mini_foto}
                    ></ImageBackground>

                ) : (
                    <ImageBackground
                        source={require('../../assets/images/cj.jpeg')}
                        imageStyle={{ borderRadius: 100}}
                        resizeMode="contain"
                        style={styles.mini_foto}
                    ></ImageBackground>
                )}
                <Text style={styles.userName}>{user ? dadosUser.nome : 'Convidado'}</Text>
                
                <Ionicons name="caret-down-outline" size={24} color="#757575" style={styles.expandIcon} onPress={null}/>
                
            </View>
            <DrawerItemList {...props} />
            {user ? (
                <>
                    <DrawerItem 
                    style={styles.drawerItem}
                    label="Atalhos" 
                    onPress={toggleAtalhos} 
                    icon={({ color, size }) => <Ionicons name="paw" size={24} color={color} />} />
                    <Collapsible collapsed={!isAtalhosOpen}>
                        <DrawerItem label="Cadastrar um pet" onPress={() => {}} />
                        <DrawerItem label="Adotar um Pet" onPress={() => props.navigation.navigate('Adotar')} />
                        <DrawerItem label="Ajudar um pet" onPress={() => {}} />
                        <DrawerItem label="Apadrinhar um pet" onPress={() => {}} />
                    </Collapsible>

                    <DrawerItem 
                    style={styles.drawerInfo}
                    label="Informações" 
                    onPress={toggleInfo} 
                    icon={({ color, size }) => <Ionicons name="information-circle" size={24} color={color} />} />
                    <Collapsible collapsed={!isInfoOpen}>
                        <DrawerItem label="Dicas" onPress={() => {}} />
                        <DrawerItem label="Eventos" onPress={() => {}} />
                        <DrawerItem label="Ajudar um pet" onPress={() => {}} />
                        <DrawerItem label="Apadrinhar um pet" onPress={() => {}} />
                    </Collapsible>
                    {/* Submenu para atalhos, informações, etc. */}
                    <DrawerItem 
                    style={styles.drawerConf}
                    label="Configurações" 
                    onPress={toggleConf} 
                    icon={({ color, size }) => <Ionicons name="cog" size={24} color={color} />} />
                    <Collapsible collapsed={!isConfOpen}>
                        <DrawerItem label="Privacidade" onPress={() => props.navigation.navigate('Config')} />
                    </Collapsible>
                    
                </>
            ) : (
                <>
                    <DrawerItem label="Home" onPress={() => props.navigation.navigate('Home')} />
                    <DrawerItem label="Adotar" onPress={() => props.navigation.navigate('Adotar')} />
                </>
            )}
            <View style={styles.footerContainer}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
        
    );
}

export default function DrawerRoutes() {

    const { user, dadosUser } = useAutenticacaoUser();

    const estadoNavegacao = useNavigationState(estado => estado);
  
    const rotaAtiva = (estadoNavegacao : NavigationState): string => {
        
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
        Config: '#ffd358',
    };
    const coresIconeHeader: estilosHeaderMap = {
        DrawerRoutes: '#88c9bf',
        Inicial: '#88c9bf',
        MeusPets: '#434343',
        MeuPerfil: '#434343',
        Adotar: '#434343',
        Conversas: '#434343',
        Config: '#434343',
    };
    const titulos_paginas: estilosHeaderMap = {
        Inicial: '',
        MeusPets: 'Meus Pets',
        MeuPerfil: 'Meu Perfil',
        Adotar: 'Adotar',
        Conversas: 'Chat',
        Config: 'Config',
    };

    return( 
        <Drawer.Navigator 
            initialRouteName='Inicial'
            screenOptions={({route}) => ({
                // **Condicional para determinar se o TopBar deve ser usado ou o cabeçalho padrão** Na vdd, isso apenas muda as cores da barra do drawer dinamicamente.
                // Os nomes nos map(coresHeader, coresIconeHeader, titulos_paginas) devem ser identicos aos nomes originais das telas para a comparação dar certo,
                // e a cor correta ser atribuida.
                title: titulos_paginas[nomeRotaAtiva] === undefined ? '' : titulos_paginas[nomeRotaAtiva],
                headerTintColor: coresIconeHeader[nomeRotaAtiva] === undefined ? '#88c9bf' : coresIconeHeader[nomeRotaAtiva],
                headerStyle: {
                    backgroundColor: coresHeader[nomeRotaAtiva] === undefined ? '#fafefe' : coresHeader[nomeRotaAtiva],
                },
                headerShadowVisible: false,
            })}
            drawerContent={(props) => <CustomDrawerContent {...props} />}>
            {/* As Screens são registradas aqui, mas o conteúdo é gerenciado pelo CustomDrawerContent */}
            <Drawer.Screen name="Inicial" component={Inicial} options={{ drawerItemStyle: { display: 'none'}}} />
            <Drawer.Screen name="MeuPerfil" component={MeuPerfil} options={{ drawerLabel: 'Meu Perfil'}} />
            <Drawer.Screen name="MeusPets" component={MeusPets} options={{ drawerLabel: 'Meus Pets', drawerItemStyle: { borderTopWidth: 1, borderTopColor: '#ccc',width: '100%'}}} />
            <Drawer.Screen name="Adotar" component={Adotar} options={{ drawerLabel: 'Adotar', drawerItemStyle: { borderTopWidth: 1, borderTopColor: '#ccc',width: '100%'}}} />
            <Drawer.Screen name="Conversas" component={Conversas} options={{ drawerLabel: 'Chat', drawerItemStyle: { borderTopWidth: 1, borderTopColor: '#ccc',width: '100%'}}} />
            <Drawer.Screen name="Config" component={Config} options={{ drawerItemStyle: { display: 'none'}}} />
        </Drawer.Navigator>
    )

}

const styles = StyleSheet.create({
    userSection: {
        flex: 1,
        height: 172,
        width: "100%",
        padding: 16,
        backgroundColor: '#88c9bf'
    },
    userImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        top: 15
    },
    userName: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#434343',
        position: 'absolute',
        bottom: 15,
        left: 16
    },
    expandIcon: {
        position: 'absolute',
        right: 16,
        bottom: 12
    },
    drawerItem: {
        backgroundColor: '#fee29b', // Cor de fundo para o DrawerItem
        borderTopWidth: 1,
        borderTopColor: '#ccc', // Cor da linha de separação
        width: '100%'

    },
    drawerInfo: {
        backgroundColor: '#cfe9e5', // Cor de fundo para o DrawerItem
        borderTopWidth: 1,
        borderTopColor: '#ccc', // Cor da linha de separação
        width: '100%'
    },
    drawerConf: {
        backgroundColor: '#e6e7e8', // Cor de fundo para o DrawerItem
        borderTopWidth: 1,
        borderTopColor: '#ccc', // Cor da linha de separação
        width: '100%'
    },
    logoutButton: {
        height: 50,
        backgroundColor: '#88c9bf', // Cor de fundo para o botão de sair
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: 15,
        marginBottom: 15
    },
    logoutText: {
        color: '#434343', // Cor do texto
        fontSize: 16, // Tamanho do texto
        fontWeight: 'bold' // Peso da fonte
    },
    mini_foto: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'black',
        top:15 
    },
    footerContainer: {
        marginTop: 'auto', // Isso empurra o botão para o rodapé do drawer
        width: '100%', // Garante que o botão ocupe a largura total
        justifyContent: 'flex-end',
        height: 230 // Altura fixa do botão
    }
});