import Constants from 'expo-constants';
import { TopBar } from "../components/TopBar";
import { BoxLogin } from "../components/BoxLogin";
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from "react-native";
import { NativeStackNavigationProps } from '../utils/UtilsType';

export default function Login() {

    const navigationStack = useNavigation<NativeStackNavigationProps>();

    const fecharTeclado = () => {
        Keyboard.dismiss();
    };

    return(
        <TouchableWithoutFeedback onPress={fecharTeclado} >
            <>
                <TopBar
                    nome='Login'
                    icone='voltar'
                    irParaPagina={() => navigationStack.getState().index > 0 ? navigationStack.goBack() : navigationStack.navigate('DrawerRoutes')}
                    cor='#88c9bf'
                />
            
            <View style={styles.container}>
                

                <BoxLogin />
                <TouchableOpacity style={{marginTop: 8}} onPress={() => navigationStack.navigate('CadastroPessoal')}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12, color: '#88c9bf'}}>Não possui uma conta ? Cadastre-se aqui!</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botao_facebook} onPress={fecharTeclado}>
                    <AntDesign name="facebook-square" size={16} color="#f7f7f7" style={{}}/>
                    <Text style={styles.botao_texto}>ENTRAR COM O FACEBOOK</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botao_google} onPress={fecharTeclado}>
                    <Entypo name="google-" size={16} color="#f7f7f7" style={{}}/>
                    <Text style={styles.botao_texto}>ENTRAR COM O GOOGLE</Text>
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
        fontFamily: 'Roboto-Medium',
        fontSize: 12,
        color: '#f7f7f7',
    },
});