import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface BotaoMarcavelRedondoProps {
    vetor_opcoes: Array<string>;
    setEstadoDoPai: React.Dispatch<React.SetStateAction<string>>;
    width?: number;
    marginBottom?: number;
    borderRadius?: number;
    acompanhamentoTam?: number;
}

export default function BotaoMarcavelRedondo({ vetor_opcoes, setEstadoDoPai, width = 115, marginBottom = 0, borderRadius = 15, acompanhamentoTam } : BotaoMarcavelRedondoProps) {

    let opacidade = 1;
    let travar = false;

    const [selecionado, setSelecionado] = useState('');

    const marcar = (opcao : string) => {
        setSelecionado(opcao);
        setEstadoDoPai(opcao);
      };

    if (acompanhamentoTam != undefined) {
        if (acompanhamentoTam == 0) {
            opacidade = 0.5;
            travar = true;
        }
    }

    //console.log(selecionado);
    // console.log(travar + selecionado);

    return (

        <>
            {vetor_opcoes.map( opcao => (
                
                <View key={opcao} style={[styles.container, {width: width, marginBottom: marginBottom}]}>

                    <TouchableOpacity style={[styles.radioButton, {borderRadius: borderRadius, opacity: opacidade}]}
                        onPress={() => marcar(opcao)}
                        disabled={travar}
                    >

                        { (selecionado == opcao && !travar) && <View style={[styles.marcado, {borderRadius: borderRadius}]} /> }

                    </TouchableOpacity>

                    <Text style={[styles.opcao, {opacity: opacidade}]} >{opcao}</Text>

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
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#757575',
        marginRight: 5,
    },

    marcado : {
        width: 14,
        height: 14,
        backgroundColor: '#ffd358',
        borderRadius: 10,
        
    }
});
