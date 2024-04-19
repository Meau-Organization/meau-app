import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native";

import { TopBar } from "../components/TopBar";
import BotaoUsual from "../components/BotaoUsual";
import { fonteCarregada } from "../utils/FontsLoad";

import Constants from 'expo-constants';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


type StackRoutesParametros = {
    CadastroAnimal : undefined;
    Login : undefined;
};


type MeusPetsProps = {
    navigation: NativeStackNavigationProp<StackRoutesParametros, 'CadastroAnimal'>;
};


export default function CadastroAnimal({ navigation } : MeusPetsProps){
    return(

        <TouchableWithoutFeedback>
            <View style = {styles.container}>

                <Text style = {styles.title}> EBA!</Text>

                <Text style = {styles.message}> O cadastro do seu pet foi realizado {'\n'} com sucesso! {'\n'}{'\n'}
                    Certifique-se que permitiu o envio de {'\n'} 
                    notificações por push no campo {'\n'}
                    privacidade do menu configurações do {'\n'}
                    aplicativo. Assim, poderemos te avisar {'\n'}
                    assim que alguém interessado entrar {'\n'}
                    em contato!
                </Text>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}  activeOpacity={0.5}>
                    <BotaoUsual texto="Meus Pets" marginTop={250} cor='#ffd358'/>
                </TouchableOpacity>

            </View>
        
        </TouchableWithoutFeedback>    
    )
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        alignItems: 'center'
    },
    title: {
        color: '#ffd358',
        fontSize: 53,
        marginTop: 52,
        textAlign: 'center',
        fontFamily: 'Courgette-Regular'
    }, 
    message: {
        color: "#757575",
        textAlign: 'center',
        marginTop: 52,
        fontSize: 14, 
        fontFamily: 'Roboto'
    }, 
    

})

export{CadastroAnimal};