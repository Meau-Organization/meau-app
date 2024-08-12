import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";


import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const userPadrao = require('../assets/images/user.jpg');

const PlaceLogoImage = require('../assets/images/Meau_marca_2.png');

interface chatProps {
    titulo: string;
    ultimaMensagem: string;
    data: string;
    onPress: () => void;  // Passar a função de navegação como prop
    nomeAnimal: string;
    foto: any;
}

export default function ChatComponent({ titulo, ultimaMensagem, data, onPress, nomeAnimal, foto }: chatProps) {


    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros>>();

    const dataFormatada = format(new Date(Number(data)), 'dd/MM/yyyy');

    const timestampEmMilissegundos = Number(data);
    const timestampAtual = Date.now();
    const diferencaEmMilissegundos = timestampAtual - Number(data);
    const _24h_milissegundos = (24 * 60 * 60 * 1000);

    if (diferencaEmMilissegundos >= _24h_milissegundos) {
        console.log('Já passou 24 horas.', diferencaEmMilissegundos);
    } else {
        console.log('Ainda não passaram 24 horas.');
    }

    return (

        <TouchableOpacity onPress={onPress} style={{
            flexDirection: 'row',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomEndRadius: 24,
            borderBottomStartRadius: 24,
            borderBottomColor: '#e6e7e8',
            alignItems: 'center',
            width: '100%',
        }}>

            <View style={styles.placeholderAvatar}>
                {foto ?
                    <ImageBackground
                        source={{ uri: `data:${foto.mimeType};base64,${foto.base64}` }}
                        imageStyle={{ borderRadius: 100}}
                        resizeMode="cover"
                        style={styles.placeholderAvatar}
                    ></ImageBackground>
                :
                    <ImageBackground
                        source={userPadrao}
                        imageStyle={{ borderRadius: 100}}
                        resizeMode="cover"
                        style={styles.placeholderAvatar}
                    ></ImageBackground>
                }
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
                <View style={styles.nameTimeContainer}>
                    <Text style={styles.userName}>{titulo != undefined ? <Text>{titulo.toUpperCase().slice(0, 15)}</Text> : <></>} {nomeAnimal != undefined ? <Text>| {nomeAnimal.toUpperCase().slice(0, 15)}</Text> : <></>}</Text>
                    
                    <Text style={styles.time}>
                        {diferencaEmMilissegundos >= _24h_milissegundos ? format(new Date(Number(data)), 'dd/MM/yyyy', {locale: ptBR})
                        :
                        format(new Date(Number(data)), 'HH:mm', {locale: ptBR}) }
                    </Text>

                </View>
                <Text style={styles.lastMessage}>{ ultimaMensagem.length < 38 ? ultimaMensagem : <Text>{ultimaMensagem.slice(0, 38)}...</Text>} </Text>
            </View>
        </TouchableOpacity>

    )
}



const styles = StyleSheet.create({
    placeholderAvatar: {
        width: 48,
        height: 48,
        borderRadius: 100,
        backgroundColor: '#cfe9e5', // Bola verde
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    time: {
        fontSize: 14,
        color: '#434343',
        
    },
    lastMessage: {
        marginTop: 2,
        fontSize: 14,
        color: '#757575',
    },
    nameTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#589b9b',
        fontFamily: 'Roboto',
    },
});