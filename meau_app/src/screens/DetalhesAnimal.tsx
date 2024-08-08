import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ImageBackground, Modal } from "react-native";
import Constants from 'expo-constants';
import { useCallback, useState } from "react";
import { db, doc, getDoc } from "../configs/firebaseConfig";
import ModalLoanding from "../components/ModalLoanding";

import BotaoUsual from "../components/BotaoUsual";
import { TopBar } from "../components/TopBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

interface DetalhesAnimalProps {
    route: {
        params: {
            animal_id: string;
        };
    };
} // Define a interface para as props do componente, especificamente a rota e os parâmetros passados.




export default function DetalhesAnimal({ route }: DetalhesAnimalProps) {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'BoxLogin'>>();

    const [dadosAnimal, setDadosAnimal] = useState(null);

    const [esperando, setEsperando] = useState(true);
    const [modal, setModal] = useState(true);

    const { animal_id } = route.params; // Extrai o id do animal dos parâmetros da rota.

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

    useFocusEffect(
        useCallback(() => {
            
            setEsperando(true);
            
            buscarDadosAnimais(animal_id);

            return () => {
                //console.log('Tela perdeu foco');
            };

        }, [])
    );



    if (!esperando) {

        return (
            <>
                <TopBar
                    nome={dadosAnimal.nomeAnimal}
                    icone='voltar'
                    irParaPagina={() => navigation.goBack()}
                    cor='#88c9bf'
                />
                <ScrollView style={{backgroundColor: '#fafafa'}}>

                    <View style={styles.container}>

                    <View style={styles.caixaFoto}>
                        <ImageBackground
                            source={{ uri: `data:${dadosAnimal.imagemPrincipalBase64.mimeType};base64,${dadosAnimal.imagemPrincipalBase64.base64}` }}
                            imageStyle={{ borderRadius: 0}}
                            resizeMode="cover"
                            style={styles.caixaFoto}
                        ></ImageBackground>
                        <View style={styles.caixaFoto2}></View>
                    </View>

                    

                    <View style={styles.view_geral}>
                        <Text style={{fontFamily: 'Roboto', fontSize: 16, color: '#434343', marginTop: 16}}>{dadosAnimal.nomeAnimal}</Text>

                        <View style = {styles.linha}></View>

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

                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.label}>CASTRADO</Text>
                                    <Text style={styles.text}>Não</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.label}> VERMIFUGADO</Text>
                                    <Text style={styles.text}>Sim</Text>

                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.label}>VACINADO</Text>
                                    <Text style={styles.text}>Não</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.label}>DOENÇAS</Text>
                                    <Text style={styles.text}>Nenhuma</Text>

                                </View>
                            </View>

                            <Text style={styles.label}>TEMPERAMENTO</Text>
                            <Text style={styles.text}>Brincalhao e Dócil</Text>


                            <Text style={styles.label}>O {dadosAnimal.nomeAnimal.toUpperCase()} PRECISA DE</Text>
                            <Text style={styles.description}>Ajuda Financeira e alimento</Text>


                            <Text style={styles.label}>EXIGÊNCIAS DO DOADOR</Text>
                            <Text style={styles.text}>Termo de apadrinhamento, auxílio financeiro com
                            alimentação</Text>

                            <Text style={styles.label}>MAIS SOBRE {dadosAnimal.nomeAnimal.toUpperCase()}</Text>
                            <Text style={styles.text}>Pequi é um cão muito dócil e de fácil convivência.
                            Adora caminhadas e se dá muito bem com
                            crianças. Tem muito medo de raios e chuva. Está
                            disponível para adoção pois eu e minha família o
                            encontramos na rua e não podemos mantê-lo em
                            nossa casa. </Text>

                        </View>

                        

                    </View>

                    <View style={styles.buttonsContainer}>
                            <TouchableOpacity  activeOpacity={0.5}>
                                <BotaoUsual texto='VER INTERESSADOS' cor='#88c9bf' marginRight={16} largura={148} altura={40}/>
                            </TouchableOpacity>
                            <TouchableOpacity  activeOpacity={0.5}>
                                <BotaoUsual texto='REMOVER PET' cor='#88c9bf' largura={148} altura={40}/>
                            </TouchableOpacity>
                        
                        </View>

                    
                    </View>
                    

                </ScrollView>
            </>
        )
    } else {

        return (
            <Modal visible={esperando && modal} animationType='fade' transparent={true}>
                <ModalLoanding spinner={esperando} cor={'#cfe9e5'}/>
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
            borderBottomWidth: 2
        },
        caixaFoto2: {
            width: '100%',
            height: '2%',
            borderRadius: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            position: 'absolute',
            marginTop: 0
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
            color: '#589b9b',
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
        linha:{
            width: "90%",
            height: 0.8,
            backgroundColor: '#e6e7e8',
            marginTop: 8,
            justifyContent: 'flex-start',
            
          
          },
    });