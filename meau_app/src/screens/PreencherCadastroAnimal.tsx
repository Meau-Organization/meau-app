import {Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image}from 'react-native'
import Constants from 'expo-constants';

import { TopBar } from '../components/TopBar';
import BotaoUsual from '../components/BotaoUsual';

import BotaoMarcavelRedondo from '../components/BotaoMarcavelRedondo';
import BotaoMarcavelQuadrado from '../components/BotaoMarcavelQuadrado';
import BotaoMarcavelQuadradoOpaco from '../components/BotaoMarcavelQuadradoOpaco';

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { StackRoutesParametros } from '../utils/StackRoutesParametros';


type MeusPetsProps = {
    navigation: NativeStackNavigationProp<StackRoutesParametros, 'PreencherCadastroAnimal'>;
};


export default function PreencherCadastroAnimal({ navigation } : MeusPetsProps){
    return(
       <View style = {{paddingTop: Constants.statusBarHeight}}> 
        <ScrollView >
            <View style = {styles.container}>

                <TopBar
                    nome='Cadastro do Animal'
                    cor='#ffd358'
                    icone='voltar'
                />
            

                <Text style={{fontSize : 16, marginTop: 8, marginLeft:24 }}>Adoção</Text>

                <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginLeft:24 }}>NOME DO ANIMAL</Text>

                <TextInput style = {styles.textName}> Nome do Animal </TextInput>
                <View style = {styles.containerName}></View>

                <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginLeft:24 }}>FOTOS DO ANIMAL</Text>

                <View style = {styles.imageButtonContainer}> 
                <TouchableOpacity style = {styles.imageButton} onPress={() => console.log('Botão pressionado')}>
                    <Image
                         source={require('../assets/images/botao_adicionar.png')}
                        style={styles.imageAddButton}
                        />
                    <Text style ={styles.textButton}> Adicionar foto</Text>
                </TouchableOpacity>
                
                </View>

                <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>ESPÉCIE</Text>   
                
                <View style = {styles.containerBotaoMarcavel} >
                    <BotaoMarcavelRedondo label={'Cachorro'}></BotaoMarcavelRedondo>
                    <View style = {{width: 20}}></View>
                    <BotaoMarcavelRedondo label={'Gato'}></BotaoMarcavelRedondo>
                </View> 

                <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>SEXO</Text>   
                
                <View style = {styles.containerBotaoMarcavel} >
                    <BotaoMarcavelRedondo label={'Macho'}></BotaoMarcavelRedondo>
                    <View style = {{width: 35}}></View>
                    <BotaoMarcavelRedondo label={'Fêmea'}></BotaoMarcavelRedondo>
                </View> 

                <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>PORTE</Text>   
                
                <View style = {styles.containerBotaoMarcavel} >
                    <BotaoMarcavelRedondo label={'Pequeno'}></BotaoMarcavelRedondo>
                    <View style = {{width: 23}}></View>
                    <BotaoMarcavelRedondo label={'Médio'}></BotaoMarcavelRedondo>
                    <View style = {{width: 30}}></View>
                    <BotaoMarcavelRedondo label={'Grande'}></BotaoMarcavelRedondo>
                </View> 

                <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>IDADE</Text>   
                
                <View style = {styles.containerBotaoMarcavel} >
                    <BotaoMarcavelRedondo label={'Filhote'}></BotaoMarcavelRedondo>
                    <View style = {{width: 35}}></View>
                    <BotaoMarcavelRedondo label={'Adulto'}></BotaoMarcavelRedondo>
                    <View style = {{width: 30}}></View>
                    <BotaoMarcavelRedondo label={'Idoso'}></BotaoMarcavelRedondo>
                </View> 

                <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>TEMPERAMENTO</Text>
                
                <View style = {styles.containerBotaoMarcavel} >
                    <BotaoMarcavelQuadrado label={'Brincalhão'}></BotaoMarcavelQuadrado>
                    <View style = {{width: 35}}></View>
                    <BotaoMarcavelQuadrado label={'Tímido'}></BotaoMarcavelQuadrado>
                    <View style = {{width: 50}}></View>
                    <BotaoMarcavelQuadrado label={'Calmo'}></BotaoMarcavelQuadrado>
                </View> 

                <View style = {styles.containerBotaoMarcavel} >
                    <BotaoMarcavelQuadrado label={'Guarda'}></BotaoMarcavelQuadrado>
                    <View style = {{width: 59}}></View>
                    <BotaoMarcavelQuadrado label={'Amoroso'}></BotaoMarcavelQuadrado>
                    <View style = {{width: 35}}></View>
                    <BotaoMarcavelQuadrado label={'Preguiçoso'}></BotaoMarcavelQuadrado>
                </View> 

                <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>SAÚDE</Text>
                
                <View style = {styles.containerBotaoMarcavel} >
                    <BotaoMarcavelQuadrado label={'Vacinado'}></BotaoMarcavelQuadrado>
                    <View style = {{width: 35}}></View>
                    <BotaoMarcavelQuadrado label={'Vermifugado'}></BotaoMarcavelQuadrado>
                </View> 
                
                <View style = {styles.containerBotaoMarcavel} >
                    <BotaoMarcavelQuadrado label={'Castrado'}></BotaoMarcavelQuadrado>
                    <View style = {{width: 37}}></View>
                    <BotaoMarcavelQuadrado label={'Doente'}></BotaoMarcavelQuadrado>
                </View> 



                <TextInput style = {styles.textName}> Doenças do animal</TextInput>
                <View style = {styles.containerName}></View>

                <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginBottom: 8, marginLeft:24 }}>EXIGÊNCIAS PARA ADOÇÃO</Text>
                <View style = {styles.containerBotaoMarcavelColumn} >
                    <BotaoMarcavelQuadrado label={'Termo de adoção'}></BotaoMarcavelQuadrado>
                    <View style = {{width: 59}}></View>
                    <BotaoMarcavelQuadrado label={'Fotos da casa'}></BotaoMarcavelQuadrado>
                    <View style = {{width: 35}}></View>
                    <BotaoMarcavelQuadrado label={'Visita pérvia ao animal'}></BotaoMarcavelQuadrado>
                    <View style = {{width: 35}}></View>
                    <BotaoMarcavelQuadrado label={'Acompanhamento pós adoção'}></BotaoMarcavelQuadrado>
                        <View style = {styles.containerBotaoMarcavelColumn1}>
                            <BotaoMarcavelQuadradoOpaco label={'1 mês'}></BotaoMarcavelQuadradoOpaco>
                            <View style = {{width: 35}}></View>
                            <BotaoMarcavelQuadradoOpaco label={'3 meses'}></BotaoMarcavelQuadradoOpaco>
                            <View style = {{width: 35}}></View>
                            <BotaoMarcavelQuadradoOpaco label={'6 meses'}></BotaoMarcavelQuadradoOpaco> 
                        </View>

                </View> 

                <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginLeft:24 }}>SOBRE O ANIMAL</Text>

                <TextInput style = {styles.textName}> Compatilhe a história do animal </TextInput>
                <View style = {styles.containerName}></View>

                <TouchableOpacity onPress={() => navigation.navigate('CadastroAnimal')}  activeOpacity={0.5}>
                    <View style = {{alignItems: 'center'}}>
                        <BotaoUsual texto="COLOCAR PARA ADOÇÃO " marginTop = {24} marginBottom={24} raio={4}></BotaoUsual>
                    </View>
                </TouchableOpacity>
             
            </View>
         </ScrollView>
        </View>
    )
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
        marginLeft: 24
      },
      containerBotaoMarcavelColumn:{
        flexDirection: 'column',
        marginTop: 8,
        marginLeft: 24
      },
      containerBotaoMarcavelColumn1:{
        flexDirection: 'column',
        marginTop: 8,
        marginLeft: 48
      },

      touchEstilo: {
        borderWidth: 1, width: 100, height: 40, alignItems: 'center', justifyContent: 'center'
      }

})