import {Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Modal}from 'react-native'
import Constants from 'expo-constants';

import { TopBar } from '../../../components/TopBar';
import BotaoUsual from '../../../components/BotaoUsual';
import BotaoMarcavelRedondo from '../../../components/BotaoMarcavelRedondo';
import BotaoMarcavelQuadrado from '../../../components/BotaoMarcavelQuadrado';
import {openImagePickerAsync}  from '../../../components/OpenImagePickerAsync';

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from '../../../utils/StackRoutesParametros';
import { useEffect, useState } from 'react';

import { getAuth, db, addDoc, collection } from '../../../configs/firebaseConfig';

import AvisoCadastro from '../../AvisoCadastro';
import ModalLoanding from '../../../components/ModalLoanding';


type MeusPetsProps = {
    navigation: NativeStackNavigationProp<StackRoutesParametros, 'PreencherCadastroAnimal'>;
};


export default function PreencherCadastroAnimal({ navigation } : MeusPetsProps){

    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [esperando, setEsperando] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {

        const user = getAuth().currentUser;

        setCurrentUser(user);
        
        if (user) {
            setEsperando(false);
            console.log("Logado - Pagina Preencher Cadastro Animal");
        } else {
            setEsperando(false);
            console.log("Off - Pagina Preencher Cadastro Animal");
        }

    }, []);

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
    const [imagemBase64, setImagemBase64] = useState(null);
    const [abrirCamera, setAbrirCamera] = useState(false); 

    const novoAnimal = async () => {
        try {

            const usuario = currentUser;

            if (usuario) {
                console.log('Usuario novo animal');
                const userCollectionRef = collection(db, 'Animals');
                console.log(userCollectionRef);

                const docRef = await addDoc(userCollectionRef, {
                    nomeAnimal: nomeAnimal,
                    especie: especie,
                    sexo: sexo,
                    porte: porte,
                    idade: idade,
                    temperamento: temperamento,
                    saude: saude,
                    doencasAnimal: doencasAnimal,
                    sobreAnimal: sobreAnimal,
                    termosAdocao: termosAdocao.length == 0 ? false : true,
                    exigenciaFotosCasa: exigenciaFotosCasa.length == 0 ? false : true,
                    visitaPrevia: visitaPrevia.length == 0 ? false : true,
                    tempoAcompanhamento: acompanhamento.length == 0 ? 0 : Number(tempoAcompanhamento[0]),
                    usuario_id: usuario.uid,
                    imagemBase64: imagemBase64,
                    
                });
                console.log(docRef.id);
                setLoading(false);
                navigation.navigate('CadastroAnimal');

            } else {
                setLoading(false);
                console.log('Nenhum usuário autenticado.');
            }
            
        } catch (error) {
            setLoading(false);
            console.error("Erro ao adicionar animal:", error);
        }

    }

    const cadastrarAnimal =  async () => {
        const cadastrarAnimal = () => {
            setModal(true);
            novoAnimal();
        }
    
    }
   
    const adicionarImagem = async () => {
        setModal(true);
        const base64Image = await openImagePickerAsync(abrirCamera);
        if (base64Image) {
            setImagemBase64(base64Image);
        }
        setModal(false);
    }

    

    if (currentUser) {

        return(
            <>
                <TopBar
                    nome='Cadastro do Animal'
                    icone='voltar'
                    irParaPagina={() => navigation.navigate("DrawerRoutes")}
                    cor='#ffd358'
                />
                <ScrollView >

                    

                    <View style = {styles.container}>

                        <Text style={{fontSize : 16, marginTop:8, marginLeft:24 }}>Adoção</Text>

                        <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginLeft:24 }}>NOME DO ANIMAL</Text>
                        <TextInput style = {styles.textName} onChangeText={setNomeAnimal}> Nome do Animal </TextInput>
                        <View style = {styles.containerName}></View>

                        <Text style={{fontSize : 16, marginTop: 20, color:'#f7a800', marginLeft:24 }}>FOTOS DO ANIMAL</Text>
                        <View style = {styles.imageButtonContainer}> 
                        <TouchableOpacity
                            style={styles.imageButton}
                            onPress={() => {
                                if (!abrirCamera) {
                                    adicionarImagem(); // Chama a função para adicionar imagem se abrirCamera for false
                                } else {
                                    setAbrirCamera(!abrirCamera); // Alterna entre abrir e fechar a câmera se abrirCamera for true
                                }
                            }}
                        >
                            {imagemBase64 ? (
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${imagemBase64}` }}
                                    style={styles.imageAddButton}
                                />
                            ) : (
                                <Image
                                    source={require('../../../assets/images/botao_adicionar.png')}
                                    style={styles.imageAddButton}
                                />
                            )}
                            <Text style={styles.textButton}> {abrirCamera ? "Tirar foto" : "Adicionar foto"}</Text>
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

                        <TouchableOpacity onPress={cadastrarAnimal}  activeOpacity={0.5}>
                            <View style = {{alignItems: 'center'}}>
                                <BotaoUsual texto="COLOCAR PARA ADOÇÃO " marginTop = {24} marginBottom={24} raio={4}></BotaoUsual>
                            </View>
                        </TouchableOpacity>

                        <Modal visible={loading && modal} animationType='fade' transparent={true}>
                            <ModalLoanding spinner={loading} />
                        </Modal>
                    
                    </View>
                </ScrollView>   
            </>
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
        paddingTop: Constants.statusBarHeight,
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