import BotaoUsual from "./BotaoUsual";
import Constants from 'expo-constants';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProps } from "../utils/UtilsType";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BotaoMarcavelQuadrado from './BotaoMarcavelQuadrado';
import { useState } from "react";

interface ModalLoandingProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    cor?: string;
}

export default function ModalAviso({ cor = "#ffd358", setModal }: ModalLoandingProps) {

    const [userNegou, setUserNegou] = useState([]);

    const navigationStack = useNavigation<NativeStackNavigationProps>();

    async function continuar() {

        if (userNegou.length > 0) {
            await AsyncStorage.setItem('@userNegou', 'yes');
        }
        setModal(false);
        navigationStack.navigate("DrawerRoutes");
    }

    return (
        <View style={styles.container}>
            <View style={styles.modal}>


                <Text style={[styles.middleText, { marginTop: 8 }]}>
                    <MaterialIcons name="notifications-off" size={64} color="#fafafa" />
                </Text>



                <View style={styles.middleView}>

                    <Text style={[styles.middleText, { fontSize: 14, marginBottom: 10 }]}>
                        Tem certeza?

                    </Text>
                    <BotaoMarcavelQuadrado
                        vetor_opcoes={['Não perguntar novamente.']}
                        setEstadoDoPai={setUserNegou}
                        width={200}
                        marginBottom={0}
                        color="#fafafa"
                        radioBackgroundColor="#88c9bf"
                        fontSize={12}
                        sizeRadio={16}
                        justifyContent={true}
                    />
                </View>
                
                

                <View style={styles.buttonsContainer}>
                    
                    <TouchableOpacity onPress={() => continuar()}>
                        <BotaoUsual texto='SIM' cor='#d4d4d4' marginRight={16} largura={80} altura={40} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { setModal(false) }}>
                        <BotaoUsual texto='NÃO' cor='#88c9bf' largura={80} altura={40} />
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(43, 43, 43, 0.5)"
    },
    modal: {
        width: "80%",
        height: 200,
        marginTop: -Constants.statusBarHeight,
        backgroundColor: "rgba(43, 43, 43, 0.8)",
        borderRadius: 10
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 14,
        marginBottom: 28,

    },
    middleView: {
        paddingHorizontal: 48,
        marginTop: 10,
        alignItems: 'center'
    },
    middleText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        color: '#fafafa',
        textAlign: 'center',
        fontWeight: 'bold'
    },

});