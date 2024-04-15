import { useState } from 'react';
import { StyleSheet, Text, View, Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';

import { FontAwesome6 } from '@expo/vector-icons';
import BotaoUsual from './BotaoUsual';

import { getAuth, signInWithEmailAndPassword } from '../configs/firebaseConfig';


export function BoxLogin() {

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


    function login(user: string, senha: string) {
    
        signInWithEmailAndPassword(getAuth(), user, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Entrou:', user.email);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Deu ruim:', errorMessage);
        });
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

            <BotaoUsual texto='ENTRAR' marginTop={52} login={login} user={userTexto} senha={senhaTexto}/>
            
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