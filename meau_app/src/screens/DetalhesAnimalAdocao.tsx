import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ImageBackground, Modal } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { getAuth, db, doc, getDoc, collection, set, ref, realtime } from "../configs/firebaseConfig";
import ModalLoanding from "../components/ModalLoanding";
import AvisoCadastro from "./AvisoCadastro";
import BotaoUsual from "../components/BotaoUsual";
import { TopBar } from "../components/TopBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const ani = require('../assets/images/animais-seed/5.jpg');

interface DetalhesAnimalProps {
    route: {
        params: {
            animal_id: string;
        };
    };
}

import { useAutenticacaoUser } from "../../assets/contexts/AutenticacaoUserContext";



export default function DetalhesAnimalAdocao({ route }: DetalhesAnimalProps) {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'BoxLogin'>>();

    const { user } = useAutenticacaoUser();

    const [dadosAnimal, setDadosAnimal] = useState(null);

    const [esperando, setEsperando] = useState(true);
    const [modal, setModal] = useState(true);

    const [curtida, setCurtida] = useState(false);
    const curtir = () => {
        if (!user){
            navigation.navigate("AvisoCadastro", {topbar: true} )
        } else {
            curtida ? setCurtida(false) : setCurtida(true);
        }
        
    };

    const { animal_id } = route.params;

    const [dadosUser, setDadosUser] = useState(null);
    const buscarDadosUsuario = async (userId : string) => {
        try {
                
            const userDocRef = doc(db, 'Users', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setDadosUser(userDoc.data());

            } else {
                console.log('Dados do usuario não encontrados');

            }
            setEsperando(false);

        } catch (error) {
            console.error('Erro ao buscar dados do user: ', error);
            setEsperando(false);

        } finally {
            setEsperando(false);

        }
    };

    const buscarDadosAnimais = async (animalId: string) => {
        try {
            
            const detalhesRef = doc(db, `Animals/${animalId}/Detalhes/${animalId}`);


            const animalDoc = await getDoc(detalhesRef);

            if (animalDoc.exists()) {
                setDadosAnimal(animalDoc.data());

            } else {
                console.log('Dados do animal não encontrados');

            }
            setEsperando(false);

        } catch (error) {
            console.error('Erro ao buscar dados do animal: ', error);
            setEsperando(false);

        } finally {
            setEsperando(false);

        }
    };


    const createChat = async (idDono: string, idInteressado: string, idAnimal: string, msg : string) => {

        const data = new Date();


        try {

            const idChat = 'chat-' + idDono + '-' + idInteressado + '-' + idAnimal;
            


            const userChatRef1 = ref(realtime, `userChats/${idDono}/${idChat}`);
            const userChatRef2 = ref(realtime, `userChats/${idInteressado}/${idChat}`);
            const userChatRef3 = ref(realtime, `userChats/${idInteressado}/${dadosUser.nome}`);
            const userChatRef4 = ref(realtime, `userChats/${idDono}/${dadosAnimal.dono}`);

            set(ref(realtime, 'chats/' + idChat + '/messages/' + Math.floor(Date.now() * Math.random()).toString(36)), {
                conteudo: msg,
                dataMsg: data,
                sender: idInteressado,
            });
            await set(userChatRef1, true);
            await set(userChatRef2, true);
            await set(userChatRef3, true);
            await set(userChatRef4, true);


            console.log('Criou o chat');

        } catch (error) {
            console.log('erro ao criar chat');
        }

    };

    useFocusEffect(
        useCallback(() => {
            
            setEsperando(true);
            
            buscarDadosUsuario(user.uid);

            buscarDadosAnimais(animal_id);

            return () => {
                //console.log('Tela perdeu foco');
            };

        }, [])
    );

    // if (!esperando) {
    //     //console.log(dadosAnimal);
    // }

    if (!esperando) {

        // console.log("base64 original: " + dadosAnimal.imagemPrincipalBase64.base64.length + " bytes : " + dadosAnimal.nomeAnimal);

        return (
            <>
                <TopBar
                    nome={dadosAnimal.nomeAnimal}
                    icone='voltar'
                    irParaPagina={() => navigation.goBack()}
                    cor='#fee29b'
                />
                <ScrollView style={{ backgroundColor: '#fafafa' }}>

                    <View style={styles.container}>

                        <View style={styles.caixaFoto}>
                            <ImageBackground
                                source={{ uri: `data:${dadosAnimal.imagemPrincipalBase64.mimeType};base64,${dadosAnimal.imagemPrincipalBase64.base64}` }}
                                imageStyle={{ borderRadius: 0 }}
                                resizeMode="cover"
                                style={styles.caixaFoto}
                            ></ImageBackground>
                            <View style={styles.barraFina}></View>
                            
                        </View>

                        <View style={styles.view_geral}>
                            <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: '#434343', marginTop: 16}}>{dadosAnimal.nomeAnimal}</Text>
                            <View style={styles.caixaLike}>
                                <TouchableOpacity onPress={curtir}>
                                    <View style={styles.circuloLike}>
                                        
                                            { curtida ?
                                                <MaterialCommunityIcons name="cards-heart" size={24} color="#ff3030"/>
                                                :
                                                <MaterialCommunityIcons name="cards-heart-outline" size={24} color="#434343"/>
                                            }
                                        
                                    </View>
                                </TouchableOpacity>
                                
                            </View>

                            <View style={styles.linha}></View>

                            <View style={styles.infoContainer}>
                                <View style={styles.row}>
                                    <View style={styles.column}>
                                        <Text style={styles.label}>SEXO</Text>
                                        <Text style={styles.text}>{dadosAnimal.sexo}</Text>
                                    </View>
                                    <View style={styles.column}>
                                        <Text style={styles.label}>PORTE</Text>
                                        <Text style={styles.text}>{dadosAnimal.porte}</Text>

                                    </View>
                                    <View style={styles.column}>
                                        <Text style={styles.label}>IDADE</Text>
                                        <Text style={styles.text}>{dadosAnimal.idade}</Text>
                                    </View>

                                </View>


                                <Text style={styles.label}>LOCALIZAÇÃO</Text>
                                <Text style={styles.text}>{dadosAnimal.cidade} - {dadosAnimal.estado}</Text>

                                {/* SAUDE ------------------------------------------------------------------------------- */}

                                <View style={styles.row}>

                                    <View style={styles.column}>
                                        <Text style={styles.label}>CASTRADO</Text>
                                        {dadosAnimal.saude.find((saude: string) => saude === 'Castrado') == 'Castrado' ?
                                            <Text style={styles.text}>Sim</Text>
                                            :
                                            <Text style={styles.text}>Não</Text>
                                        }
                                    </View>

                                    <View style={styles.column}>
                                        <Text style={styles.label}>VERMIFUGADO</Text>
                                        {dadosAnimal.saude.find((saude: string) => saude === 'Vermifugado') == 'Vermifugado' ?
                                            <Text style={styles.text}>Sim</Text>
                                            :
                                            <Text style={styles.text}>Não</Text>
                                        }
                                    </View>

                                </View>

                                <View style={styles.row}>

                                    <View style={styles.column}>
                                        <Text style={styles.label}>VACINADO</Text>
                                        {dadosAnimal.saude.find((saude: string) => saude === 'Vacinado') == 'Vacinado' ?
                                            <Text style={styles.text}>Sim</Text>
                                            :
                                            <Text style={styles.text}>Não</Text>
                                        }
                                    </View>

                                    <View style={styles.column}>
                                        <Text style={styles.label}>DOENÇAS</Text>
                                        {dadosAnimal.saude.find((saude: string) => saude === 'Doente') == 'Doente' ?
                                            <Text style={styles.text}>Sim</Text>
                                            :
                                            <Text style={styles.text}>Nenhuma</Text>
                                        }
                                    </View>

                                </View>

                                {/* ------------------------------------------------------------------------------------- */}

                                <Text style={styles.label}>TEMPERAMENTO</Text>

                                {dadosAnimal.temperamento.length > 0 ?
                                    <>
                                        <Text style={styles.text}>
                                            {dadosAnimal.temperamento.map((temp, i: number) =>
                                            (i < dadosAnimal.temperamento.length - 2 ?
                                                (`${temp}, `)
                                                :
                                                i >= dadosAnimal.temperamento.length - 2 && i < dadosAnimal.temperamento.length - 1 ? `${temp} e `
                                                    :
                                                    `${temp}.`
                                            )
                                            )}
                                        </Text>
                                    </>
                                    :
                                    <Text style={styles.text}>--</Text>
                                }

                                <Text style={styles.label}>EXIGÊNCIAS DO DOADOR</Text>

                                <Text style={styles.text}>
                                    {dadosAnimal.termosAdocao ? <>Termo de adoção</> : <></>}

                                    { !dadosAnimal.exigenciaFotosCasa
                                        && !dadosAnimal.visitaPrevia
                                        && dadosAnimal.tempoAcompanhamento == 0  ?
                                            <>.</>
                                            :
                                            <></>
                                    }

                                    {dadosAnimal.exigenciaFotosCasa ?
                                        <>
                                            {dadosAnimal.termosAdocao ? <>, fotos da casa</> : <>Fotos da casa</>}
                                        </>
                                        :
                                        <></>
                                    }

                                    {!dadosAnimal.visitaPrevia && dadosAnimal.tempoAcompanhamento == 0  ? <>.</> : <></>}

                                    {dadosAnimal.visitaPrevia ?
                                        <>
                                            {   dadosAnimal.termosAdocao || dadosAnimal.exigenciaFotosCasa ?
                                                    <>, visita prévia</>
                                                    :
                                                    <>Visita prévia</>
                                            }
                                        </>
                                        :
                                        <></>
                                    }

                                    {dadosAnimal.tempoAcompanhamento == 0  ? <>.</> : <></>}

                                    {dadosAnimal.tempoAcompanhamento != 0 ?
                                        <>
                                            {   dadosAnimal.termosAdocao || dadosAnimal.exigenciaFotosCasa || dadosAnimal.visitaPrevia ?
                                                    <> e acompanhamento durante {dadosAnimal.tempoAcompanhamento} meses</>
                                                    :
                                                    <>Acompanhamento durante {dadosAnimal.tempoAcompanhamento} meses</>
                                            }
                                        </>
                                        :
                                        <></>
                                    }

                                </Text>

                                <Text style={styles.label}>MAIS SOBRE {dadosAnimal.nomeAnimal.toUpperCase()}</Text>
                                <Text style={styles.text}>{dadosAnimal.sobreAnimal}</Text>

                            </View>



                        </View>

                        <TouchableOpacity
                        onPress={() =>
                            user ?
                                //alert('Em construção')
                                createChat(dadosAnimal.usuario_id, user.uid, animal_id, "ola meu consagrado")
                            :
                                navigation.navigate("AvisoCadastro", {topbar: true} )
                            }
                        activeOpacity={0.5}>

                            <BotaoUsual texto='PRETENDO ADOTAR' cor='#fdcf58' marginTop={28} marginBottom={28} largura={232} altura={40} />
                        </TouchableOpacity>


                    </View>


                </ScrollView>
            </>
        )
    } else {

        return (
            <Modal visible={esperando && modal} animationType='fade' transparent={true}>
                <ModalLoanding spinner={esperando} />
            </Modal>
        );
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        //paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'center'
    },
    view_geral: {
        flex: 1,
        width: '90%',
        backgroundColor: '#fafafa',
        //backgroundColor: 'red',
        marginTop: 0.5,
        alignItems: 'flex-start'

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        marginBottom: 16,
        //backgroundColor: 'red'
    },
    column: {
        alignItems: 'flex-start',
        //backgroundColor: 'yellow',
        marginRight: 50
    },
    caixaFoto: {
        width: '100%',
        height: 184,
        borderRadius: 0,
        backgroundColor: 'red',
        flexDirection: 'row',
        borderBottomWidth: 2,
    },
    barraFina: {
        width: '100%',
        height: '2%',
        borderRadius: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        position: 'absolute',
        marginTop: 0
    },
    caixaLike: {
        width: 70,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        marginTop: '-9.5%',
        marginLeft: '81%',
    },
    circuloLike: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: '#fafafa',
        marginTop: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 8,
            height: 8
        },
        elevation: 15,
        
    },
    infoContainer: {
        marginTop: 16,
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#434343',
        marginBottom: 10,
    },
    label: {
        fontSize: 12,
        color: '#f7a800',
    },
    text: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 28,
        marginBottom: 28,

    },
    button: {
        width: 148,
        height: 40,
        backgroundColor: '#88c9bf',
        borderWidth: 2,
        borderColor: '#88c9bf',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 2,
        flex: 1,
        margin: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    removeButton: {
        backgroundColor: '#e57373',
    },
    removeButtonText: {
        color: '#fff',
    },
    linha: {
        width: "90%",
        height: 0.8,
        backgroundColor: '#e6e7e8',
        marginTop: 8,
        justifyContent: 'flex-start',


    },
});