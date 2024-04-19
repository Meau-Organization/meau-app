
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert } from "react-native";
import { TopBar } from "../components/TopBar";

import { auth, signOut} from '../configs/firebaseConfig';

import Constants from 'expo-constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { StackRoutesParametros } from '../utils/StackRoutesParametros';

type TesteLogadoProps = {
    navigation: NativeStackNavigationProp<StackRoutesParametros, 'Inicial'>;
};

export default function TesteLogado({navigation} : TesteLogadoProps ) {

    const logout = () =>  {

        signOut(auth)
            .then(() => {
                console.log('Usuario Saiu');
            })
            .catch((error) => {
                Alert.alert('Erro', 'Erro ao tentar fazer fazer o logout');
                console.error('Erro ao tentar fazer fazer o logout:', error);
            });
    };

    const acoes = () => {
        logout();
        navigation.navigate("Login");
        Keyboard.dismiss();
    };

   

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View style={styles.container}>

            <View style={styles.middleView}>
                <Text style={styles.middleText}>Logado com sucesso! {'\n'}</Text>
            </View>

                <TouchableOpacity style={styles.botao_facebook} onPress={acoes}>

                    <Text style={styles.botao_texto}>Logout</Text>
                </TouchableOpacity>

            </View>
        </TouchableWithoutFeedback>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'center',
    },
    middleView : {
        marginTop: 100,
        paddingHorizontal: 48,
        marginBottom: 48,
    },
    middleText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
    },

    botao_facebook: {
        flexDirection: 'row',
        marginTop: 72,
        width: 232,
        height: 40,
        backgroundColor: '#88c9bf',
        justifyContent: 'center',
        alignItems: 'center',
        
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 0.8,
        elevation: 10,
        shadowOffset: { width: 0, height: 2}

    },

    botao_google: {
        flexDirection: 'row',
        marginTop: 8,
        width: 232,
        height: 40,
        backgroundColor: '#f15f5c',
        justifyContent: 'center',
        alignItems: 'center',
        
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 0.8,
        elevation: 10,
        shadowOffset: { width: 0, height: 2}

    },

    botao_texto: {
        marginLeft: 10,
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#f7f7f7',
    },
});