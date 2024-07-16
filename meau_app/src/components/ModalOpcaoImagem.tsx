import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Constants from 'expo-constants';
import BotaoUsual from "./BotaoUsual";

interface ModalLoandingProps {
    //spinner: boolean;
    adicionarImagem: () => void,
    setOpcaoImagem: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalOpcaoImagem( { adicionarImagem, setOpcaoImagem} : ModalLoandingProps ) {

    return(
        <View style={styles.container}>
            

            <View style={styles.modal}>
                <TouchableOpacity onPress={() => {setOpcaoImagem(false);}} activeOpacity={0.5}>
                    <MaterialCommunityIcons style={{marginLeft: 280, marginTop: -35}} name="close" size={24} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => {
                    adicionarImagem();
                    setOpcaoImagem(false);
                }} activeOpacity={0.5}>
                    
                    <BotaoUsual texto='GALERIA' cor='#88c9bf' marginBottom={20}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {alert('Em construção')}} activeOpacity={0.5}>
                    <BotaoUsual texto='CÂMERA' cor='#88c9bf' />
                </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        width: "80%",
        height: 200,
        marginTop: -Constants.statusBarHeight,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

        
    },

});