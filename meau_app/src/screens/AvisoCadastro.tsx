import Constants from 'expo-constants';
import { TopBar } from "../components/TopBar";
import BotaoUsual from "../components/BotaoUsual";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProps } from '../utils/UtilsType';

interface AvisoCadastroProps {
    route: {
        params: {
            topbar: boolean;
        };
    };
}

export default function AvisoCadastro( { route } : AvisoCadastroProps ) {

    const { topbar } = route.params;

    const navigationStack = useNavigation<NativeStackNavigationProps>();

    return(
        <>
            {topbar ? (
                    <TopBar
                        nome='Cadastro'
                        icone='voltar'
                        irParaPagina={() => navigationStack.getState().index > 0 ? navigationStack.goBack() : navigationStack.navigate('DrawerRoutes')}
                        cor='#88c9bf'
                    />
                ) : (
                    <>
                    </>
                )}
            
            <View style={styles.container}>


                    <Text style={ [styles.welcomeText, {fontFamily: 'Courgette-Regular'}]}>
                        Ops!
                    </Text>

                <View style={styles.middleView}>
                    <Text style={styles.middleText}>
                        Você não pode realizar esta ação sem {'\n'}
                        possuir um cadastro.
                    </Text>
                </View>
                    
                <TouchableOpacity onPress={() => navigationStack.navigate("CadastroPessoal")}  activeOpacity={0.5}>
                    <BotaoUsual texto='FAZER CADASTRO' marginTop={52}/>
                </TouchableOpacity>

                <View style={[styles.middleView, {marginTop: 44}]}>
                    <Text style={styles.middleText}>
                        Já possui cadastro?
                    </Text>
                </View>
                
                <TouchableOpacity onPress={() => navigationStack.navigate("Login")}  activeOpacity={0.5}>
                    <BotaoUsual texto='FAZER LOGIN' marginTop={16}/>
                </TouchableOpacity>

            </View>
        </>
    );



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'center',
    },
    welcomeText: {
        marginTop: 52,
        fontSize: 53,
        textAlign: 'center',
        color: '#88c9bf'
    },
    middleView : {
        paddingHorizontal: 48,
        marginTop: 52,
    },
    middleText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
    },
});