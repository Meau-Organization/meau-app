
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from "react-native";
import { TopBar } from "../components/TopBar";
import { BoxLogin } from "../components/BoxLogin";

import { AntDesign, Entypo } from '@expo/vector-icons'

import Constants from 'expo-constants';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { StackRoutesParametros } from '../utils/StackRoutesParametros';

type LoginProps = {
    navigation: NativeStackNavigationProp<StackRoutesParametros, 'Inicial'>;
};

export default function Login({navigation} : LoginProps) {

    const fecharTeclado = () => {
        Keyboard.dismiss();
    };

    return(
        <TouchableWithoutFeedback onPress={fecharTeclado} >
            <View style={styles.container}>
                
                <TopBar
                    nome = 'Login'
                    icone = 'menu'
                />

                <BoxLogin NavegarPara={() => navigation.navigate("Loading")}/>

                <TouchableOpacity style={styles.botao_facebook} onPress={fecharTeclado}>
                    <AntDesign name="facebook-square" size={16} color="#f7f7f7" style={{}}/>
                    <Text style={styles.botao_texto}>ENTRAR COM O FACEBOOK</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botao_google} onPress={fecharTeclado}>
                    <Entypo name="google-" size={16} color="#f7f7f7" style={{}}/>
                    <Text style={styles.botao_texto}>ENTRAR COM O GOOGLE</Text>
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

    botao_facebook: {
        flexDirection: 'row',
        marginTop: 72,
        width: 232,
        height: 40,
        backgroundColor: '#194f7c',
        justifyContent: 'center',
        alignItems: 'center',
        
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 0.8,
        elevation: 10,
        shadowOffset: { width: 0, height: 2},
        borderRadius: 5,

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
        shadowOffset: { width: 0, height: 2},
        borderRadius: 5,

    },

    botao_texto: {
        marginLeft: 10,
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#f7f7f7',
    },
});