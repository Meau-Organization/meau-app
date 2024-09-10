import { useRef, useState } from "react";
import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProps, NativeStackNavigationProps } from "../utils/UtilsType";
import { desativarToken } from "../utils/UtilsNotification";
import { logout } from "../utils/UtilsGeral";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";

const userPadrao = require('../assets/images/user.jpg');

export default function CustomDrawerContent(props : DrawerContentComponentProps) {

    const { user, dadosUser, setUser } = useAutenticacaoUser();
    const [isPerfilOpen, setPerfilOpen] = useState(false);
    const [isAtalhosOpen, setAtalhosOpen] = useState(false);
    const [isInfoOpen, setInfoOpen] = useState(false);
    const [isConfOpen, setConfOpen] = useState(false);
    const scrollViewRef = useRef(null);

    const togglePerfil = () => setPerfilOpen(!isPerfilOpen);

    const toggleConf = () => {
        rolarParaOFim();
        setConfOpen(!isConfOpen);
    }

    const navigationDrawer = useNavigation<DrawerNavigationProps>();
    const navigationStack = useNavigation<NativeStackNavigationProps>();

    const toggleAtalhos = () => setAtalhosOpen(!isAtalhosOpen);
    const toggleInfo = () => setInfoOpen(!isInfoOpen);

    async function handleLogout() {                 // Função para lidar com o logout
        await desativarToken(user.uid);
        logout(user.uid, setUser);
    };

    const rolarParaOFim = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#88c9bf', flex: 1 }}>
            <StatusBar style="dark" backgroundColor='#fafafa' />

            <DrawerContentScrollView {...props} ref={scrollViewRef} style={{ backgroundColor: '#f7f7f7' }}>

                <View style={styles.userSection}>
                    {dadosUser ? (
                        <>
                            <ImageBackground
                                source={{ uri: `data:${dadosUser.imagemPrincipalBase64.mimeType};base64,${dadosUser.imagemPrincipalBase64.base64}` }}
                                imageStyle={{ borderRadius: 100 }}
                                resizeMode="cover"
                                style={styles.mini_foto}
                            ></ImageBackground>
                            <DrawerItem
                                style={{ marginTop: 62, width: '100%', marginLeft: 0 }}
                                label={user ? dadosUser.nome : 'Convidado'}
                                labelStyle={[styles.userName, { marginLeft: -24 }]}
                                onPress={user ? togglePerfil : null}
                                icon={() => user ? <Ionicons name="caret-down-outline" size={18} color="#757575" style={[styles.expandIcon, { right: 24 }]} /> : <></>}
                            />
                        </>

                    ) : (
                        <>
                            <ImageBackground
                                source={userPadrao}
                                imageStyle={{ borderRadius: 100 }}
                                resizeMode="cover"
                                style={styles.mini_foto}
                            ></ImageBackground>
                            <View style={{ marginTop: 75, width: '100%', marginLeft: -8 }}>
                                <Text style={[styles.userName, { marginLeft: 24 }]}>Convidado</Text>
                            </View>
                        </>
                    )}
                </View>
                <Collapsible collapsed={!isPerfilOpen}>
                    <DrawerItem label="Meu Perfil" labelStyle={{ marginLeft: 16 }} onPress={() => props.navigation.navigate('MeuPerfil')} />
                    <DrawerItem label="Meus Pets" labelStyle={{ marginLeft: 16 }} onPress={() => props.navigation.navigate('MeusPets')} />
                    <DrawerItem label="Favoritos" labelStyle={{ marginLeft: 16 }} onPress={() => props.navigation.navigate('Favoritos')} />
                    <DrawerItem label="Chat" labelStyle={{ marginLeft: 16 }} onPress={() => props.navigation.navigate('Conversas')} />
                </Collapsible>

                <DrawerItemList {...props} />
                {user ? (
                    <>
                        {/* <View style={{width: 48, height: 10, backgroundColor: 'red'}}></View> */}

                        <DrawerItem
                            style={styles.drawerItem}
                            label="Atalhos"
                            onPress={toggleAtalhos}
                            icon={(
                                { color, size }) =>
                                <>
                                    <Ionicons name="paw" size={24} color={color} style={{ marginLeft: 8 }} />
                                    <Ionicons name="caret-down-outline" size={18} color="#757575" style={[styles.expandIcon, { right: 24 }]} />
                                </>
                            }
                        />
                        <Collapsible collapsed={!isAtalhosOpen}>
                            <DrawerItem
                                label="Cadastrar um pet"
                                labelStyle={{ marginLeft: 16 }}
                                onPress={() => {
                                    props.navigation.closeDrawer();
                                    props.navigation.navigate('PreencherCadastroAnimal');
                                }}
                            />
                            <DrawerItem label="Adotar um Pet" labelStyle={{ marginLeft: 16 }} onPress={() => props.navigation.navigate('Adotar')} />
                        </Collapsible>

                        <DrawerItem
                            style={styles.drawerInfo}
                            label="Informações"
                            onPress={toggleInfo}

                            icon={(
                                { color, size }) =>
                                <>
                                    <Ionicons name="information-circle" size={24} color={color} style={{ marginLeft: 8 }} />
                                    <Ionicons name="caret-down-outline" size={18} color="#757575" style={[styles.expandIcon, { right: 24 }]} />
                                </>
                            }
                        />


                        <Collapsible collapsed={!isInfoOpen}>
                            <DrawerItem label="Dicas" labelStyle={{ marginLeft: 16 }} onPress={() => { }} />
                            <DrawerItem label="Eventos" labelStyle={{ marginLeft: 16 }} onPress={() => { }} />
                            <DrawerItem label="Ajudar um pet" labelStyle={{ marginLeft: 16 }} onPress={() => { }} />
                            <DrawerItem label="Apadrinhar um pet" labelStyle={{ marginLeft: 16 }} onPress={() => { }} />
                        </Collapsible>
                        {/* Submenu para atalhos, informações, etc. */}
                        <DrawerItem
                            style={styles.drawerConf}
                            label="Configurações"
                            onPress={toggleConf}
                            icon={(
                                { color, size }) =>
                                <>
                                    <Ionicons name="cog" size={24} color={color} style={{ marginLeft: 8 }} />
                                    <Ionicons name="caret-down-outline" size={18} color="#757575" style={[styles.expandIcon, { right: 24 }]} />
                                </>
                            }
                        />
                        <Collapsible collapsed={!isConfOpen}>
                            <DrawerItem label="Privacidade" labelStyle={{ marginLeft: 16 }} onPress={() => props.navigation.navigate('Config')} />
                        </Collapsible>

                    </>
                ) : (
                    <>
                        <DrawerItem label="Início" onPress={() => props.navigation.navigate('Inicial')} />
                        <DrawerItem label="Adotar" onPress={() => props.navigation.navigate('Adotar')} />
                    </>
                )}

            </DrawerContentScrollView>

            <View style={[styles.footerContainer, {height: !user ? 48 : 96}]}>

                {user ?
                    <>
                        <TouchableOpacity onPress={() => navigationDrawer.navigate('Inicial')} style={styles.logoutButton}>
                            <AntDesign name="home" size={16} color='#434343' style={{ marginRight: 8 }} />
                            <Text style={styles.logoutText}>Início</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                            <AntDesign name="logout" size={16} color='#434343' style={{ marginRight: 8 }} />
                            <Text style={styles.logoutText}>Sair</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <TouchableOpacity onPress={() => navigationStack.navigate('Login')} style={styles.logoutButton}>
                        <AntDesign name="login" size={16} color='#434343' style={{ marginRight: 8 }} />
                        <Text style={styles.logoutText}>Entrar</Text>
                    </TouchableOpacity>
                }

            </View>

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    userSection: {
        flex: 1,
        height: 172,
        width: "100%",
        backgroundColor: '#88c9bf',
        elevation: 5,
        marginTop: -55
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
    },
    expandIcon: {
        position: 'absolute',
        right: 16,
        bottom: 12
    },
    drawerItem: {
        backgroundColor: '#fee29b',         // Cor de fundo para o DrawerItem
        borderTopWidth: 1,
        borderTopColor: '#ccc',             // Cor da linha de separação
        width: '100%',
        marginLeft: 0,
        marginTop: 4,
        borderRadius: 0
    },
    drawerInfo: {
        backgroundColor: '#cfe9e5',         // Cor de fundo para o DrawerItem
        borderTopWidth: 1,
        borderTopColor: '#ccc',             // Cor da linha de separação
        width: '100%',
        marginLeft: 0,
        marginTop: -4,
        borderRadius: 0,
    },
    drawerConf: {
        backgroundColor: '#e6e7e8',         // Cor de fundo para o DrawerItem
        borderTopWidth: 1,
        borderTopColor: '#ccc',             // Cor da linha de separação
        width: '100%',
        marginLeft: 0,
        marginTop: -4,
        borderRadius: 0,
    },
    logoutButton: {
        height: 48,
        flexDirection: 'row',
        backgroundColor: '#88c9bf',         // Cor de fundo para o botão de sair
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
        width: '100%'
    },
    logoutText: {
        color: '#434343',                   // Cor do texto
        fontSize: 16,                       // Tamanho do texto
        fontWeight: 'bold'                  // Peso da fonte
    },
    mini_foto: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'black',
        top: 40,
        left: 16,
    },
    footerContainer: {
        width: '100%',                      // Garante que o botão ocupe a largura total
        backgroundColor: '#b1f4e9',
    }
});
