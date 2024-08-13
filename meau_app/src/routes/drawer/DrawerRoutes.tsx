import React, { useState } from 'react';

import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'

import { Ionicons , AntDesign} from '@expo/vector-icons';

import { View, StatusBar, Text, Image, StyleSheet, ImageBackground } from 'react-native';
import Collapsible from 'react-native-collapsible';

import Inicial from '../../screens/Inicial';

import { NavigationState, useNavigationState } from '@react-navigation/native';
import MeusPets from '../../screens/MeusPets';
import MeuPerfil from '../../screens/MeuPerfil';
import Adotar from '../../screens/Adotar';
import { useAutenticacaoUser } from '../../assets/contexts/AutenticacaoUserContext';
import Conversas from '../../screens/Conversas';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();

interface coresPaginas {
    [key: string]: string;
}

interface titulosPaginas {
    [key: string]: string;
}


function CustomDrawerContent(props) {
    const { user, dadosUser } = useAutenticacaoUser();
    const [ isSubMenuOpen, setIsSubMenuOpen ] = useState(false);
    const [ isDicasOpen,setIsDicasOpen ] = useState(false);
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
                        source={{ uri: 'htpps://via.placeholder.com/64' }}
                        imageStyle={{ borderRadius: 100}}
                        resizeMode="contain"
                        style={styles.mini_foto}
                    ></ImageBackground>

                ) : (
                    <ImageBackground
                        source={{uri : 'htpps://via.placeholder.com/64'}}
                        imageStyle={{ borderRadius: 100}}
                        resizeMode="contain"
                        style={styles.mini_foto}
                    ></ImageBackground>
                )}
                <Text style={styles.userName}>{user ? 'dadosUser.nome ': 'Convidado'}</Text>
                
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
                        <DrawerItem label="Adotar um Pet" onPress={() => {}} />
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
                        <DrawerItem label="Privacidade" onPress={() => {}} />
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
    console.log(nomeRotaAtiva);
    
    const coresHeader: coresPaginas = {
        Home: '#fafafa',
        MeusPets: '#88c9bf',
        MeuPerfil: '#cfe9e5',
        Adotar: '#ffd358',
        Conversas: '#88c9bf', //#589b9b
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
        Conversas: 'Chat'
    };

    return( 
        <Drawer.Navigator 
            initialRouteName='Inicial'
            screenOptions={{
                title: titulos_paginas[nomeRotaAtiva] === undefined ? '' : titulos_paginas[nomeRotaAtiva],
                headerTintColor: coresIconeHeader[nomeRotaAtiva] === undefined ? '#88c9bf' : coresIconeHeader[nomeRotaAtiva],
                headerStyle: {
                    backgroundColor: coresHeader[nomeRotaAtiva] === undefined ? '#fafefe' : coresHeader[nomeRotaAtiva],
                },
                headerShadowVisible: false,
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}>
            {/* As Screens são registradas aqui, mas o conteúdo é gerenciado pelo CustomDrawerContent */}
            <Drawer.Screen name="Inicial" component={Inicial} options={{ drawerItemStyle: { display: 'none'}}} />
            <Drawer.Screen name="MeuPerfil" component={MeuPerfil} options={{ drawerLabel: 'Meu Perfil'}} />
            <Drawer.Screen name="MeusPets" component={MeusPets} options={{ drawerLabel: 'Meus Pets', drawerItemStyle: { borderTopWidth: 1, borderTopColor: '#ccc',width: '100%'}}} />
            <Drawer.Screen name="Adotar" component={Adotar} options={{ drawerLabel: 'Adotar',drawerItemStyle: { borderTopWidth: 1, borderTopColor: '#ccc',width: '100%'}}} />
            <Drawer.Screen name="Chat" component={Conversas} options={{ drawerLabel: 'Chat', drawerItemStyle: { borderTopWidth: 1, borderTopColor: '#ccc',width: '100%'}}} />
        </Drawer.Navigator>
    )

}

const styles = StyleSheet.create({
    userSection: {
        flex: 1,
        height: 172,
        width: 286,
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
        fontFamily: 'Roboto-Medium',
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