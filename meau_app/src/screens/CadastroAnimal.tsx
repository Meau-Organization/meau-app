import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native";

import { TopBar } from "../components/TopBar";
import BotaoUsual from "../components/BotaoUsual";

import Constants from 'expo-constants';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";


import { getAuth } from '../configs/firebaseConfig';

export default function CadastroAnimal(){


    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, "AvisoCadastro">>();

    return(

        <TouchableWithoutFeedback>
            <>
            <TopBar
                    nome='Cadastro do Animal'
                    icone='voltar'
                    irParaPagina={() => navigation.navigate("DrawerRoutes")}
                    cor='#ffd358'
                />
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


                <TouchableOpacity
                    onPress={
                        () => navigation.navigate('MeusPets', {
                            recarregar: true,
                            usuario_id: getAuth().currentUser ? getAuth().currentUser.uid : '',
                        })
                    }
                    activeOpacity={0.5}
                >

                    <BotaoUsual texto="Meus Pets" marginTop={250} cor='#ffd358'/>
                </TouchableOpacity>

            </View>
            </>
        
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