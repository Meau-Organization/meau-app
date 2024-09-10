import BotaoUsual from "./BotaoUsual";
import Constants from 'expo-constants';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

interface ModalLoandingProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    texto: string;
}

export default function ModalSucesso({ setModal, texto }: ModalLoandingProps) {

    return (
        <View style={styles.container}>
            <View style={styles.modal}>


                <Text style={[styles.middleText, { marginTop: 14 }]}>
                    <AntDesign name="checkcircle" size={64} color="#88c9bf"/>
                </Text>



                <View style={styles.middleView}>

                    <Text style={[styles.middleText, { fontSize: 14, marginBottom: 10 }]}>
                        {texto}
                    </Text>
                    
                </View>
                
                <View style={styles.buttonsContainer}>
                    
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { setModal(false) }}>
                        <BotaoUsual texto='OK' cor='#bdbdbd' largura={80} altura={40} />
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