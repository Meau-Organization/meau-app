import Constants from 'expo-constants';
import { TopBar } from "../components/TopBar";
import BotaoUsual from "../components/BotaoUsual";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { DrawerNavigationProps, NativeStackNavigationProps } from '../utils/UtilsType';

export default function SucessoCadastroAnimal(){

    const navigationStack = useNavigation<NativeStackNavigationProps>();
    const navigationDrawer = useNavigation<DrawerNavigationProps>();

    return(

        <TouchableWithoutFeedback>
            <>
            <TopBar
                    nome='Cadastro do Animal'
                    icone='voltar'
                    irParaPagina={() => navigationStack.navigate("DrawerRoutes")}
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
                        () => navigationDrawer.navigate('MeusPets')
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
        fontFamily: 'Roboto-Medium'
    }, 
    

})