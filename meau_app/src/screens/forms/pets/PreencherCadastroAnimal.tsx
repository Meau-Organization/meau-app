import { Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Modal, ImageBackground, Alert } from 'react-native'
import Constants from 'expo-constants';

import { TopBar } from '../../../components/TopBar';
import BotaoUsual from '../../../components/BotaoUsual';
import BotaoMarcavelRedondo from '../../../components/BotaoMarcavelRedondo';
import BotaoMarcavelQuadrado from '../../../components/BotaoMarcavelQuadrado';
import OpenImagePicker from '../../../components/OpenImagePicker';


import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from '../../../utils/StackRoutesParametros';

import { getAuth, db, addDoc, collection, doc, getDoc, setDoc } from '../../../configs/firebaseConfig';

import ModalLoanding from '../../../components/ModalLoanding';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { useAutenticacaoUser } from '../../../../assets/contexts/AutenticacaoUserContext';

const PlaceLogoImage = require('../../../assets/images/animais-seed/1.jpg');


type MeusPetsProps = {
    navigation: NativeStackNavigationProp<StackRoutesParametros, 'PreencherCadastroAnimal'>;
};


export default function PreencherCadastroAnimal({ navigation }: MeusPetsProps) {

    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [pacoteImagemBase64, setPacoteImagemBase64] = useState(null);



    const [nomeAnimal, setNomeAnimal] = useState('');
    const [especie, setEspecie] = useState('');
    const [sexo, setSexo] = useState('');
    const [porte, setPorte] = useState('');
    const [idade, setIdade] = useState('');
    const [temperamento, setTemperamento] = useState<string[]>([]);
    const [saude, setSaude] = useState<string[]>([]);
    const [doencasAnimal, setDoencasAnimal] = useState('');
    const [sobreAnimal, setSobreAnimal] = useState('');
    const [termosAdocao, setTermosAdocao] = useState<string[]>([]);
    const [exigenciaFotosCasa, setExigenciaFotosCasa] = useState<string[]>([]);
    const [visitaPrevia, setVisitaPrevia] = useState<string[]>([]);
    const [acompanhamento, setAcompanhamento] = useState<string[]>([]);
    const [tempoAcompanhamento, setTempoAcompanhamento] = useState('');

    const { user } = useAutenticacaoUser();

    const novoAnimal = async () => {
        try {
            

            const userDocRef = doc(db, 'Users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {

                console.log('Usuario novo animal');
                const userCollectionRef = collection(db, 'Animals');
                console.log(userCollectionRef);

                const docRef = await addDoc(userCollectionRef, {
                    nomeAnimal: nomeAnimal,
                    sexo: sexo,
                    porte: porte,
                    idade: idade,
                    usuario_id: user.uid,
                    cidade: userDoc.data().cidade,
                    estado: userDoc.data().estado,
                    imagemComprimidaBase64: pacoteImagemBase64.imagemCard,
                    disponivel: true,

                });
                console.log(docRef.id);

                // Referência à subcoleção dentro do novo documento
                const subcollectionRef = collection(docRef, 'Detalhes');

                await setDoc(doc(subcollectionRef, docRef.id), {
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
                    usuario_id: user.uid,
                    cidade: userDoc.data().cidade,
                    estado: userDoc.data().estado,
                    imagemPrincipalBase64: pacoteImagemBase64.imagemPrincipal,
                    disponivel: true,
                });

                setLoading(false);
                navigation.navigate('CadastroAnimal');

            } else {
                console.log('Dados do usuario não encontrados');
                setLoading(false);

            }

        } catch (error) {
            setLoading(false);
            console.error("Erro ao adicionar animal:", error);
            alert("Erro ao adicionar animal: " + error);
        }

    }

    const cadastrarAnimal = async () => {
        setModal(true);
        novoAnimal();
    }


    const handleImagePicked = (pacoteImagem : any) => {

        if (!pacoteImagem.canceled) {
            setPacoteImagemBase64(pacoteImagem);
        }
        setModalVisible(false);

    };



    return (
        <>

            <TopBar
                nome='Cadastro do Animal'
                icone='voltar'
                irParaPagina={() => navigation.navigate("DrawerRoutes")}
                cor='#ffd358'
            />
            <ScrollView >
                <View style={styles.container}>

                    <Text style={{ fontSize: 16, marginTop: 8, marginLeft: 24 }}>Adoção</Text>
                    <Text style={{ fontSize: 16, marginTop: 20, color: '#f7a800', marginLeft: 24 }}>NOME DO ANIMAL</Text>
                    <TextInput style={styles.textName} onChangeText={setNomeAnimal}> Nome do Animal </TextInput>
                    <View style={styles.containerName}></View>
                    <Text style={{ fontSize: 16, marginTop: 20, color: '#f7a800', marginLeft: 24 }}>FOTOS DO ANIMAL</Text>

                    <View style={styles.imageButtonContainer}>

                        <TouchableOpacity
                            onPress={() => { setModalVisible(true) }}
                            style={[styles.imageButton, { borderColor: pacoteImagemBase64 ? pacoteImagemBase64.tamBase64Principal <= 1 ? '#e6e7e7' : '#fb6565' : '#e6e7e7' } ]}
                        >
                            {pacoteImagemBase64 ? (
                                
                                <>
                                    {pacoteImagemBase64.imagemPrincipal ? (
                                        <>
                                            {/* {console.log("base6400: " + pacoteImagemBase64.imagemPrincipal.mimeType)} */}
                                            <ImageBackground
                                                source={{ uri: `data:${pacoteImagemBase64.imagemPrincipal.mimeType};base64,${pacoteImagemBase64.imagemPrincipal.base64}` }}
                                                resizeMode="cover"
                                                style={styles.imageAddButton}
                                            ></ImageBackground>
                                            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', width: '80%', height: '80%', position: 'absolute', borderRadius: 4 }}></View>

                                            <View style={{ position: 'absolute' }}>
                                                <MaterialIcons style={styles.AddButton} name="change-circle" size={24} color="#757575" />
                                                <Text style={[styles.textButton, {}]}> Trocar foto</Text>
                                            </View>
                                        </>

                                    ) : (
                                        <>
                                            <MaterialIcons name="add-circle-outline" size={24} color="#757575" />
                                            <Text style={styles.textButton}>"Adicionar foto"</Text>
                                        </>
                                    )}
                                </>

                            ) : (
                                <>
                                    <MaterialIcons name="add-circle-outline" size={24} color="#757575" />
                                    <Text style={styles.textButton}>"Adicionar foto"</Text>
                                </>
                            )}


                            {modalVisible && (<OpenImagePicker
                                onImagePicked={handleImagePicked}
                                onClose={() => setModalVisible(false)}>
                            </OpenImagePicker>)}

                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.textFotoTam,
                        { color:
                        pacoteImagemBase64 ? pacoteImagemBase64.tamBase64Principal <= 1 ? '#f7a800' : '#fb6565' : '#f7a800'
                        }
                    
                    ]}>Limite arquivo: 1.5 Megabytes.</Text>

                    <Text style={{ fontSize: 16, marginTop: 20, color: '#f7a800', marginBottom: 8, marginLeft: 24 }}>ESPÉCIE</Text>
                    <View style={styles.containerBotaoMarcavel} >
                        <BotaoMarcavelRedondo vetor_opcoes={['Cachorro', 'Gato']} setEstadoDoPai={setEspecie} />
                    </View>


                    <Text style={{ fontSize: 16, marginTop: 20, color: '#f7a800', marginBottom: 8, marginLeft: 24 }}>SEXO</Text>
                    <View style={styles.containerBotaoMarcavel} >
                        <BotaoMarcavelRedondo vetor_opcoes={['Macho', 'Fêmea']} setEstadoDoPai={setSexo} />
                    </View>

                    <Text style={{ fontSize: 16, marginTop: 20, color: '#f7a800', marginBottom: 8, marginLeft: 24 }}>PORTE</Text>
                    <View style={styles.containerBotaoMarcavel} >
                        <BotaoMarcavelRedondo vetor_opcoes={['Pequeno', 'Médio', 'Grande']} setEstadoDoPai={setPorte} />
                    </View>

                    <Text style={{ fontSize: 16, marginTop: 20, color: '#f7a800', marginBottom: 8, marginLeft: 24 }}>IDADE</Text>
                    <View style={styles.containerBotaoMarcavel} >
                        <BotaoMarcavelRedondo vetor_opcoes={['Filhote', 'Adulto', 'Idoso']} setEstadoDoPai={setIdade} />
                    </View>

                    <Text style={{ fontSize: 16, marginTop: 20, color: '#f7a800', marginBottom: 8, marginLeft: 24 }}>TEMPERAMENTO</Text>
                    <View style={styles.containerBotaoMarcavel} >
                        <BotaoMarcavelQuadrado vetor_opcoes={['Brincalhão', 'Tímido', 'Calmo', 'Guarda', 'Amoroso', 'Preguiçoso']} setEstadoDoPai={setTemperamento} />
                    </View>



                    <Text style={{ fontSize: 16, marginTop: 20, color: '#f7a800', marginBottom: 8, marginLeft: 24 }}>SAÚDE</Text>
                    <View style={styles.containerBotaoMarcavel} >
                        <BotaoMarcavelQuadrado vetor_opcoes={['Vacinado', 'Vermifugado', 'Castrado', 'Doente']} setEstadoDoPai={setSaude} />
                    </View>

                    <TextInput style={styles.textName} onChangeText={setDoencasAnimal}> Doenças do animal</TextInput>
                    <View style={styles.containerName}></View>



                    <Text style={{ fontSize: 16, marginTop: 20, color: '#f7a800', marginBottom: 8, marginLeft: 24 }}>EXIGÊNCIAS PARA ADOÇÃO</Text>
                    <View style={styles.containerBotaoMarcavelColumn} >
                        <BotaoMarcavelQuadrado vetor_opcoes={['Termo de adoção']} setEstadoDoPai={setTermosAdocao} width={150} />

                        <View style={{ width: 59 }}></View>
                        <BotaoMarcavelQuadrado vetor_opcoes={['Fotos da casa']} setEstadoDoPai={setExigenciaFotosCasa} width={130} />

                        <View style={{ width: 35 }}></View>
                        <BotaoMarcavelQuadrado vetor_opcoes={['Visita pérvia ao animal']} setEstadoDoPai={setVisitaPrevia} width={180} />

                        <View style={{ width: 35 }}></View>
                        <BotaoMarcavelQuadrado vetor_opcoes={['Acompanhamento pós adoção']} setEstadoDoPai={setAcompanhamento} width={230} />

                        <View style={styles.containerBotaoMarcavelColumn1}>
                            <BotaoMarcavelRedondo vetor_opcoes={['1 mês', '3 meses', '6 meses']} setEstadoDoPai={setTempoAcompanhamento}
                                marginBottom={28}
                                borderRadius={4}
                                acompanhamentoTam={acompanhamento.length}
                            />
                        </View>

                    </View>

                    <Text style={{ fontSize: 16, marginTop: 20, color: '#f7a800', marginLeft: 24 }}>SOBRE O ANIMAL</Text>
                    <TextInput style={styles.textName} onChangeText={setSobreAnimal}> Compatilhe a história do animal </TextInput>
                    <View style={styles.containerName}></View>

                    <TouchableOpacity
                        onPress={
                            e => {
                                pacoteImagemBase64.tamBase64Principal <= 1 ?
                                    cadastrarAnimal()
                                    :
                                    Alert.alert('Arquivo de foto excedeu o limite de 1.5 Megabytes')
                            }
                        }
                        activeOpacity={0.5} >

                        <View style={{ alignItems: 'center' }}>
                            <BotaoUsual texto="COLOCAR PARA ADOÇÃO " marginTop={24} marginBottom={24} raio={4}></BotaoUsual>
                        </View>
                    </TouchableOpacity>

                    <Modal visible={loading && modal} animationType='fade' transparent={true}>
                        <ModalLoanding spinner={loading} />
                    </Modal>

                </View>
            </ScrollView>
        </>
    )
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
    textFotoTam: {
        marginTop: 8,
        //color: '#f7a800',
        marginLeft: 50,
        fontSize: 14,
        fontFamily: 'Roboto',
        //backgroundColor: 'red',
        width: 200
    },
    containerName: {
        width: 328,
        height: 0.8,
        backgroundColor: '#e6e7e8',
        marginTop: 8,
        justifyContent: 'flex-start',
        marginLeft: 24

    },
    imageButton: {
        width: 312,
        height: 128,
        borderRadius: 4,
        marginBottom: 2,
        backgroundColor: '#e6e7e7',
        marginTop: 16,
        padding: 10,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8
        },
        elevation: 10,
        borderWidth: 4,
    },
    textButton: {
        alignSelf: 'center',
        textAlign: 'center',
        color: '#757575',
        fontFamily: 'Roboto',
        fontSize: 14
    },
    imageAddButton: {
        width: 306,
        height: 122,
        resizeMode: "cover",
        alignSelf: 'center',
        borderRadius: 4,
    },
    AddButton: {
        width: 24,
        height: 24,
        alignSelf: 'center'
    },
    imageButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerBotaoMarcavel: {
        flexDirection: 'row',
        marginTop: 8,
        marginLeft: 24,
        flexWrap: 'wrap',
        //borderWidth: 1
        alignItems: 'flex-start', // Altere isso para controlar o alinhamento transversal
        justifyContent: 'flex-start',

    },
    containerBotaoMarcavelColumn: {
        flexDirection: 'column',
        marginTop: 8,
        marginLeft: 24
    },
    containerBotaoMarcavelColumn1: {
        flexDirection: 'column',
        marginLeft: 48,
        //borderWidth: 1
    },

    touchEstilo: {
        borderWidth: 1, width: 100, height: 40, alignItems: 'center', justifyContent: 'center'
    }

})