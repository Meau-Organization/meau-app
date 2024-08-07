import { useState } from 'react';
import { StyleSheet, Text, View, Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback, Image, Alert, Modal } from 'react-native';

import { FontAwesome6 } from '@expo/vector-icons';
import BotaoUsual from './BotaoUsual';

import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, User } from '../configs/firebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackRoutesParametros } from '../utils/StackRoutesParametros';
import { useNavigation } from '@react-navigation/native';
import ModalLoanding from './ModalLoanding';
import { useAutenticacaoUser } from '../assets/contexts/AutenticacaoUserContext';


export function BoxLogin() {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'BoxLogin'>>();

    const { setUser } = useAutenticacaoUser();

    const [esperando, setEsperando] = useState(false);
    const [modal, setModal] = useState(false);

    const [userTexto, setUserTexto] = useState('');
    const [senhaTexto, setSenhaTexto] = useState('');


    const [focoUser, setFocoUser] = useState(false);
    const [focoSenha, setFocoSenha] = useState(false);

    const [mostrarIconeCheckUser, setMostrarIconeCheckUser] = useState(false);
    const [mostrarIconeCheckSenha, setMostrarIconeCheckSenha] = useState(false);

    const onChangeText1 = (novoTexto : string) => {
        setUserTexto(novoTexto);
        setMostrarIconeCheckUser(novoTexto.trim() !== '');
    };

    const onChangeText2 = (novoTexto : string) => {
        setSenhaTexto(novoTexto);
        setMostrarIconeCheckSenha(novoTexto.trim() !== '');
    };

    const mostrarIconeCheckUserFunc = (iconeState : Boolean) => {
        if (iconeState) {
            return <FontAwesome6 name="check" size={24} color="#589b9b" />
        } else {
            return null;
        }
    };


    const login = async (user: string, senha: string) => {
        setEsperando(true);
        await signInWithEmailAndPassword(getAuth(), user, senha)
        .then((userCredential) => {
            
            setEsperando(false);
            const user = userCredential.user;
            setUser(user);
            console.log('Entrou:', user.email);
            navigation.navigate("DrawerRoutes");//redefinindo a navegação e direcionando para tela inicial do usuario Autenticado
        })
        .catch((error) => {
            
            setEsperando(false);
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Deu ruim:', errorMessage);
            Alert.alert('Erro','Falha ao fazer login. Verifique sua internet ou suas credenciais e tente novamente.');
        });
    };

    const acoesOnPress = (user: string, senha: string) => {
        Keyboard.dismiss();
        setModal(true);
        login(user, senha);
    }

    return (
        <View style={styles.container}>
            <View style={ [styles.inputContainer, { borderColor: focoUser ? '#88c9bf' : '#e6e7e8' }] }>
                <TextInput
                    style = {{width: 288}}
                    value = {userTexto}
                    onChangeText = {onChangeText1}
                    placeholder = "Nome de usuário"
                    placeholderTextColor = "#bdbdbd"
                    onFocus = {() => setFocoUser(true)}
                    onBlur = {() => setFocoUser(false)}  
                />
                {mostrarIconeCheckUserFunc(mostrarIconeCheckUser)}
            </View>

            <View style={ [styles.inputContainer, { borderColor: focoSenha ? '#88c9bf' : '#e6e7e8', marginTop: 12 }]}>
                <TextInput
                    style = {{width: 288}}
                    value = {senhaTexto}
                    onChangeText = {onChangeText2}
                    placeholder = "Senha"
                    secureTextEntry = {true}
                    placeholderTextColor = "#bdbdbd"
                    onFocus = {() => setFocoSenha(true)}
                    onBlur = {() => setFocoSenha(false)} 
                />
                {mostrarIconeCheckUserFunc(mostrarIconeCheckSenha)}
                
            </View>

            <TouchableOpacity onPress={(e) => acoesOnPress(userTexto, senhaTexto)}  activeOpacity={0.5}>
                <BotaoUsual texto='ENTRAR' cor='#88c9bf' marginTop={52}/>
            </TouchableOpacity>

            <Modal visible={esperando && modal} animationType='fade' transparent={true}>
                <ModalLoanding spinner={esperando} />
            </Modal>
            
        </View>
    )

}


const styles = StyleSheet.create({

    container: {
        marginTop: 64,
        alignItems: 'center',
        // borderWidth: 1,
    },

    inputContainer: {
        width: 312,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e7e8',
        

        flexDirection: 'row',
        alignItems: 'center',
    },

});