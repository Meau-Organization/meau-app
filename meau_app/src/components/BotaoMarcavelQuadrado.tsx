import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface BotaoMarcavelRedondoProps {
    vetor_opcoes: Array<string>;
    setEstadoDoPai: React.Dispatch<React.SetStateAction< string[] >>;
    width?: number;
    marginBottom?: number;
    marginLeft?: number;
}

interface nomesBotao {
  [key: string]: Boolean;
}

export default function BotaoMarcavelRedondo({ vetor_opcoes, setEstadoDoPai, width = 115, marginBottom = 28, marginLeft = 0 } : BotaoMarcavelRedondoProps) {

    const [mapaDeNomes, setMapaDeNomes] = useState<nomesBotao>(() => {

        const initialState: nomesBotao = {};
        vetor_opcoes.forEach( chave => {
            initialState[chave] = false;
        });

        return initialState;
    });

    // console.log(mapaDeNomes);

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
                
                <View key={opcao} style={[styles.container, {width: width, marginBottom: marginBottom, marginLeft: marginLeft} ]}>

                    <TouchableOpacity style={styles.radioButton} onPress={() => marcar(opcao)}>

                        { mapaDeNomes[opcao] && <View style={styles.marcado} />}

                    </TouchableOpacity>

                    <Text style={styles.opcao} >{opcao}</Text>

                </View>
            ) )}
        </>
    );

    
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        //borderWidth: 1,
    },
    opcao: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#757575',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderWidth: 2.5,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#757575',
        marginRight: 5,
    },

    marcado : {
        width: 14,
        height: 14,
        backgroundColor: '#ffd358',
        borderRadius: 4,
        
    }
});
