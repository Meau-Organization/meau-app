import {Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image}from 'react-native'
import Constants from 'expo-constants';

import { TopBar } from '../../../components/TopBar';
import BotaoUsual from '../../../components/BotaoUsual';

import BotaoMarcavelRedondo from '../../../components/BotaoMarcavelRedondo';
import BotaoMarcavelQuadrado from '../../../components/BotaoMarcavelQuadrado';
import BotaoMarcavelQuadradoOpaco from '../../../components/BotaoMarcavelQuadradoOpaco';

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { StackRoutesParametros } from '../../../utils/StackRoutesParametros';
import { useEffect, useState } from 'react';

import { auth, onAuthStateChanged } from '../../../configs/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import AvisoCadastro from '../../AvisoCadastro';


type MeusPetsProps = {
    navigation: NativeStackNavigationProp<StackRoutesParametros, 'PreencherCadastroAnimal'>;
};


export default function PreencherCadastroAnimal({ navigation } : MeusPetsProps){

    const [logado, setLogado] = useState(false);
    const [esperando, setEsperando] = useState(true);

    const [nomeAnimal,          setNomeAnimal]          = useState('');
    const [especie,             setEspecie]             = useState('');
    const [sexo,                setSexo]                = useState('');
    const [porte,               setPorte]               = useState('');
    const [idade,               setIdade]               = useState('');
    const [temperamento,        setTemperamento]        = useState<string[]>([]);
    const [saude,               setSaude]               = useState<string[]>([]);
    const [doencasAnimal,       setDoencasAnimal]       = useState('');
    const [sobreAnimal,         setSobreAnimal]         = useState('');
    const [termosAdocao,        setTermosAdocao]        = useState<string[]>([]);
    const [exigenciaFotosCasa,  setExigenciaFotosCasa]  = useState<string[]>([]);
    const [visitaPrevia,        setVisitaPrevia]        = useState<string[]>([]);
    const [acompanhamento,      setAcompanhamento]      = useState<string[]>([]);
    const [tempoAcompanhamento, setTempoAcompanhamento] = useState('');

    // console.log("especie: " + especie);
    // console.log("idade: " + idade);
    //console.log("lista temperamento: " + temperamento);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLogado(true);

                setEsperando(false);

                console.log("Logado");
            } else {
                setLogado(false);
                setEsperando(false);
                console.log("SAIU " + esperando + " " + logado);
            }
        });

    }, []);

    if (logado) {

        return(
            <ScrollView >
                <View style = {styles.container}>

                    <Text style={{fontSize : 16, marginTop:8, marginLeft:24 }}>Adoção</Text>

                    <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginLeft:24 }}>NOME DO ANIMAL</Text>
                    <TextInput style = {styles.textName} onChangeText={setNomeAnimal}> Nome do Animal </TextInput>
                    <View style = {styles.containerName}></View>

                    <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginLeft:24 }}>FOTOS DO ANIMAL</Text>
                    <View style = {styles.imageButtonContainer}> 
                        <TouchableOpacity style = {styles.imageButton} onPress={() => console.log('Botão pressionado')}>
                            <Image
                                source={require('../../../assets/images/botao_adicionar.png')}
                                style={styles.imageAddButton}
                                />
                            <Text style ={styles.textButton}> Adicionar foto</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>ESPÉCIE</Text>
                    <View style = {styles.containerBotaoMarcavel} >
                        <BotaoMarcavelRedondo vetor_opcoes={['Cachorro', 'Gato']} setEstadoDoPai={setEspecie}/>
                    </View> 
                    

                    <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>SEXO</Text>
                    <View style = {styles.containerBotaoMarcavel} >
                        <BotaoMarcavelRedondo vetor_opcoes={['Macho', 'Fêmea']} setEstadoDoPai={setSexo}/>
                    </View> 

                    <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>PORTE</Text>   
                    <View style = {styles.containerBotaoMarcavel} >
                        <BotaoMarcavelRedondo vetor_opcoes={['Pequeno', 'Médio', 'Grande']} setEstadoDoPai={setPorte}/>
                    </View> 

                    <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>IDADE</Text>   
                    <View style = {styles.containerBotaoMarcavel} >
                        <BotaoMarcavelRedondo vetor_opcoes={['Filhote', 'Adulto', 'Idoso']} setEstadoDoPai={setIdade}/>
                    </View> 

                   <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>TEMPERAMENTO</Text>
                    <View style = {styles.containerBotaoMarcavel} >
                        <BotaoMarcavelQuadrado vetor_opcoes={['Brincalhão', 'Tímido', 'Calmo', 'Guarda', 'Amoroso', 'Preguiçoso']} setEstadoDoPai={setTemperamento}/>
                    </View>

                    
                    
                    <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>SAÚDE</Text>
                    <View style = {styles.containerBotaoMarcavel} >
                        <BotaoMarcavelQuadrado vetor_opcoes={['Vacinado', 'Vermifugado', 'Castrado', 'Doente']} setEstadoDoPai={setSaude}/>
                    </View>

                    <TextInput style = {styles.textName}  onChangeText={setDoencasAnimal}> Doenças do animal</TextInput>
                    <View style = {styles.containerName}></View>



                    <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>EXIGÊNCIAS PARA ADOÇÃO</Text>
                    <View style = {styles.containerBotaoMarcavelColumn} >
                        <BotaoMarcavelQuadrado vetor_opcoes={['Termo de adoção']} setEstadoDoPai={setTermosAdocao} width={150}/>

                        <View style = {{width: 59}}></View>
                        <BotaoMarcavelQuadrado vetor_opcoes={['Fotos da casa']} setEstadoDoPai={setExigenciaFotosCasa}  width={130}/>
                        
                        <View style = {{width: 35}}></View>
                        <BotaoMarcavelQuadrado vetor_opcoes={['Visita pérvia ao animal']} setEstadoDoPai={setVisitaPrevia}  width={180}/>
                        
                        <View style = {{width: 35}}></View>
                        <BotaoMarcavelQuadrado vetor_opcoes={['Acompanhamento pós adoção']} setEstadoDoPai={setAcompanhamento}  width={230}/>
                        
                            <View style = {styles.containerBotaoMarcavelColumn1}>
                                <BotaoMarcavelRedondo vetor_opcoes={['1 mês', '3 meses', '6 meses']} setEstadoDoPai={setTempoAcompanhamento}
                                    marginBottom={28}
                                    borderRadius={4}
                                    acompanhamentoTam={acompanhamento.length}
                                />
                            </View>

                    </View> 

                    <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginLeft:24 }}>SOBRE O ANIMAL</Text>

                    <TextInput style = {styles.textName} onChangeText={setSobreAnimal}> Compatilhe a história do animal </TextInput>
                    <View style = {styles.containerName}></View>

                    <TouchableOpacity onPress={() => navigation.navigate('CadastroAnimal')}  activeOpacity={0.5}>
                        <View style = {{alignItems: 'center'}}>
                            <BotaoUsual texto="COLOCAR PARA ADOÇÃO " marginTop = {24} marginBottom={24} raio={4}></BotaoUsual>
                        </View>
                    </TouchableOpacity>
                
                </View>
            </ScrollView>   
        )

    } else {
        if (esperando) 
            return null;
        else
            return <AvisoCadastro/>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    title: {
        paddingTop: 16,
        color: '#757575',
        fontFamily: 'Roboto',
        alignSelf: 'center'
    },
    containerButtons: {
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'center', 
        alignItems: 'center',

    },
    textName: {
        marginTop: 20,
        color: '#bdbdbd',
        marginLeft: 24,
        fontSize: 14,
        fontFamily: 'Roboto'
      }, 
      containerName:{
        width: 328,
        height: 0.8,
        backgroundColor: '#e6e7e8',
        marginTop: 8,
        justifyContent: 'flex-start',
        marginLeft: 24
      
      },
      imageButton:{
        width: 312,
        height: 128,
        borderRadius: 4,
        marginBottom: 2,
        backgroundColor: '#e6e7e7', 
        marginTop: 16,
        padding:10,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset:{
          width:0,
          height: 8
        },
        elevation:10
      },
      textButton:{
        alignSelf: 'center',
        textAlign: 'center',
        color: '#757575',
        fontFamily: 'Roboto',
        fontSize: 14
      },
      imageAddButton:{
        width: 24,
        height: 24,
        resizeMode: "contain",
        alignSelf: 'center'
      },
      imageButtonContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      containerBotaoMarcavel:{
        flexDirection: 'row',
        marginTop: 8,
        marginLeft: 24,
        flexWrap: 'wrap',
        //borderWidth: 1
        alignItems: 'flex-start', // Altere isso para controlar o alinhamento transversal
        justifyContent: 'flex-start',
        
      },
      containerBotaoMarcavelColumn:{
        flexDirection: 'column',
        marginTop: 8,
        marginLeft: 24
      },
      containerBotaoMarcavelColumn1:{
        flexDirection: 'column',
        marginLeft: 48,
        //borderWidth: 1
      },

      touchEstilo: {
        borderWidth: 1, width: 100, height: 40, alignItems: 'center', justifyContent: 'center'
      }

})