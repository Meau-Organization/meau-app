import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface BotaoMarcavelRedondoProps {
    vetor_opcoes: Array<string>;
    setEstadoDoPai: React.Dispatch<React.SetStateAction< string[] >>;
    width?: number;
    marginBottom?: number;
    marginLeft?: number;
    fontSize?: number;
    color?: string;
    sizeRadio?: number;
    radioBackgroundColor?: string;
    justifyContent?: boolean;
    estadoInicial?: boolean;
}

interface nomesBotao {
  [key: string]: Boolean;
}

export default function BotaoMarcavelQuadrado({
        vetor_opcoes,
        setEstadoDoPai,
        width = 115,
        marginBottom = 28,
        marginLeft = 0,
        fontSize = 14,
        color = '#757575',
        sizeRadio = 24,
        radioBackgroundColor = '#ffd358',
        justifyContent = false,
        estadoInicial = false,

    } : BotaoMarcavelRedondoProps) {

        const [mapaDeNomes, setMapaDeNomes] = useState<nomesBotao>(() => {

            const initialState: nomesBotao = {};
            vetor_opcoes.forEach( chave => {        
                initialState[chave] = estadoInicial;
            });

            return initialState;
        });

        //console.log(mapaDeNomes);

        const marcar = (opcao : string) => {

            setMapaDeNomes(botoes => ({
                ...botoes,
                [opcao]: !botoes[opcao]
            }));

            setEstadoDoPai(nome => {
                
                if (nome.includes(opcao)) {
                    //console.log('existe');
                    return nome.filter(item => item !== opcao);

                } else {
                    //console.log('insere');
                    return [...nome, opcao];

                }
            });

        };



        return (

            <>
                {vetor_opcoes.map( opcao => (
                    
                    <View key={opcao} style={[styles.container, { width: width, marginBottom: marginBottom, marginLeft: marginLeft, justifyContent: justifyContent ? 'center' : 'flex-start' } ]}>

                        <TouchableOpacity style={[styles.radioButton, {width: sizeRadio, height: sizeRadio, borderColor: color}]} onPress={() => marcar(opcao)}>

                            { mapaDeNomes[opcao] && <View style={[styles.marcado, {width: (sizeRadio - (sizeRadio * 0.417)), height: (sizeRadio - (sizeRadio * 0.417)), backgroundColor: radioBackgroundColor }]} />}

                        </TouchableOpacity>

                        <Text style={[styles.opcao, {fontSize: fontSize, color: color}]} >{opcao}</Text>

                    </View>
                ) )}
            </>
        );

    
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    opcao: {
        fontFamily: 'Roboto',
        fontSize: 14,
    },
    radioButton: {
        borderWidth: 2.5,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },

    marcado : {
        borderRadius: 4,
    }
});
