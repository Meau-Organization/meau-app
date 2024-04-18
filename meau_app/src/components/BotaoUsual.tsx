import { StyleSheet, Text, View } from "react-native";

interface BotaoProps {
    texto: string;
    cor?: string;
    corTexto?: string;
    marginTop?: number;
    marginBottom?: number;
    altura?: number;
    largura?: number;
    raio?: number;
}

export default function BotaoUsual( { texto, cor = '#ffd358', corTexto, marginTop, marginBottom, altura = 40, largura = 232, raio = 5} : BotaoProps ) {

    return (
            <View
                style={[styles.botao, {
                    backgroundColor: cor,
                    marginTop: marginTop,
                    marginBottom: marginBottom,
                    height: altura,
                    width: largura,
                    borderRadius: raio
                }]} >

                    <Text style={[styles.botao_texto, {color: corTexto}]}> {texto} </Text>
            </View>
    )
}


const styles = StyleSheet.create({

    botao: {
        justifyContent: 'center',
        alignItems: 'center',
        
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 1,
        elevation: 2,
        shadowOffset: { width: 0, height: 2},
        margin: 2

    },

    botao_texto: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#434343',
    }

});