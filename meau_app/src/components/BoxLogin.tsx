import { useState } from 'react';
import BotaoUsual from './BotaoUsual';
import ModalLoanding from './ModalLoanding';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProps } from '../utils/UtilsType';
import { getAuth, signInWithEmailAndPassword } from '../configs/FirebaseConfig';
import { useAutenticacaoUser } from '../assets/contexts/AutenticacaoUserContext';
import { StyleSheet, View, Keyboard, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import useLoading from '../hooks/useLoading';

export function BoxLogin() {

    const navigationStack = useNavigation<NativeStackNavigationProps>();

    const Loanding = useLoading();

    const { setUser } = useAutenticacaoUser();

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
        Loanding.setCarregando();

        await signInWithEmailAndPassword(getAuth(), user, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            setUser(user);
            console.log('Entrou:', user.email);

            Loanding.setPronto();
            navigationStack.navigate("DrawerRoutes");//redefinindo a navegação e direcionando para tela inicial do usuario Autenticado
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Deu ruim:', errorMessage, errorCode);
            Alert.alert('Erro','Falha ao fazer login. Verifique sua internet ou suas credenciais e tente novamente.');
            Loanding.setPronto();
        });
    };

    const acoesOnPress = (user: string, senha: string) => {
        Keyboard.dismiss();
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

            <Modal visible={Loanding.Carregando} animationType='fade' transparent={true}>
                <ModalLoanding spinner={Loanding.Carregando} cor={'#cfe9e5'} />
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