import { Image, StyleSheet, Text, View , TouchableOpacity} from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Constants from 'expo-constants';
import  { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";


interface CardProps {
    primeiro?: boolean;
    modo: any;
    nome: string;
    sexo: string;
    idade: string;
    porte: string;
    cidade: string;
    estado: string;
    trocaIcone?: boolean;
    id: string;
}

export default function CardAnimal( { primeiro, modo, nome, sexo, idade, porte, cidade, estado, trocaIcone = false, id} : CardProps ) {

    const modoJustifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' = modo;

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'CardAnimal'>>();

    return (

        <View style={ [styles.card, { marginTop: primeiro ? 8 - Constants.statusBarHeight : 8 } ] }>

            
            

            <View style={styles.titulo}>

                <TouchableOpacity onPress={() => navigation.navigate("DetalhesAnimal", { animal_id: id })}>

                <Text style={styles.text_nome}>{nome}</Text>
                </TouchableOpacity>
                {trocaIcone ?
                    <MaterialIcons name="error-outline" size={24} color="#434343" style={{marginRight: 15}}/>
                :
                    <MaterialCommunityIcons name="cards-heart-outline" size={24} color="#434343" style={{marginRight: 15}}/>
                }
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("DetalhesAnimal", {animal_id: id })} styles={styles.foto}>

                <Text style={styles.text}>foto</Text>
            
            </TouchableOpacity>

            <View style={styles.view_dados}>

                <View style={ [styles.dados1, { justifyContent: modoJustifyContent }] } >
                    <Text style={[styles.text_dados, {marginLeft: 35}]}>{sexo != undefined ? sexo.toUpperCase() : null}</Text>

                    <Text style={styles.text_dados}>{idade != undefined ? idade.toUpperCase() : null}</Text>

                    <Text style={[styles.text_dados, {marginRight: 35}]}>{porte != undefined ? porte.toUpperCase() : null}</Text>
                </View>

                <View style={styles.dados2}>
                    <Text style={styles.text_dados}>{cidade != undefined ? cidade.toUpperCase() : null} – {estado != undefined ? estado.toUpperCase() : null}</Text>
                </View>

            </View>
            
        </View>
           
    )
}



const styles = StyleSheet.create({
    card: {
        flex: 1,
        width: '95.5%',
        height: 264,
        marginTop: 8 - Constants.statusBarHeight,
        borderWidth: 0.4,
        borderRadius: 12,
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.2)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    titulo: {
        flexDirection: 'row',
        width: '100%',
        height: 32,
        backgroundColor: '#fee29b',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    view_dados: {
        flexDirection: 'column',
        width: '100%',
        height: 49,
        backgroundColor: '#fff',
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
    },
    dados1: {
        flexDirection: 'row',
        width: '100%',
        height: 24.5,
        backgroundColor: '#fff',    
        alignItems: 'center',
    },
    dados2: {
        marginTop: 0,
        width: '100%',
        height: 24.5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
    },
    foto: {
        width: '100%',
        height: 180,
        backgroundColor: '#97aeff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_nome: {
        color: '#434343',
        marginLeft: 15,
        fontFamily: 'Roboto',
        fontSize: 16,
    },
    text_dados: {
        color: '#434343',
        fontSize: 12,
        fontFamily: 'Roboto'
    },
    text: {
        color: '#fff',
    },
});
