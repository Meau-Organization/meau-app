import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ImageBackground, Modal } from "react-native";
import Constants from 'expo-constants';
import { useCallback, useEffect, useState } from "react";
import { getAuth, db, doc, getDoc } from "../configs/firebaseConfig";
import ModalLoanding from "../components/ModalLoanding";
import AvisoCadastro from "./AvisoCadastro";
import BotaoUsual from "../components/BotaoUsual";
import { TopBar } from "../components/TopBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const ani = require('../assets/images/animais-seed/5.jpg');

interface DetalhesAnimalProps {
    route: {
        params: {
            animal_id: string;
        };
    };
} // Define a interface para as props do componente, especificamente a rota e os parâmetros passados.




export default function DetalhesAnimal({ route }: DetalhesAnimalProps) {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'BoxLogin'>>();

    const [currentUser, setCurrentUser] = useState(null);
    const [dadosAnimal, setDadosAnimal] = useState(null);

    const [esperando, setEsperando] = useState(true);
    const [modal, setModal] = useState(true);

    const { animal_id } = route.params; // Extrai o id do animal dos parâmetros da rota.

    const buscarDadosAnimais = async (animalId : string) => {
        try {
                
            const animalDocRef = doc(db, 'Animals', animalId);
            const animalDoc = await getDoc(animalDocRef);

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
            
            const user = getAuth().currentUser;

            setCurrentUser(user);

            if (user) {

                buscarDadosAnimais(animal_id);

                console.log("Logado - Pagina Detalhes animal");

            } else {
                setEsperando(false);
                console.log("SAIU");
            }

            return () => {
                //console.log('Tela perdeu foco');
            };

        }, [])
    );

    // if (!esperando) {
    //     console.log(dadosAnimal);
    // }

    
    // const [animal, setAnimal] = useState<any>(null); // Define um estado para armazenar os dados do animal.
    // const [loading, setLoading] = useState(true); // Define um estado para controlar o carregamento.
    // const [modal, setModal] = useState(true); // Define um estado para controlar a visibilidade do modal.
    // const [currentUser, setCurrentUser] = useState<any>(null); // Define um estado para armazenar o usuário atual.
    // const [esperando, setEsperando] = useState(true); // Define um estado para controlar o estado de espera.

    /*useEffect(() => {
      const user = getAuth().currentUser; // Obtém o usuário atual autenticado.
      setCurrentUser(user); // Armazena o usuario no estado.

      if (user){
        console.log("Logado - Pagina Detalhes Animal");
        fetchAnimalDetalhes(animal_id); // Busca os detalhes do animal se o usuário estiver logado.
      } else {
        setEsperando(false);
        console.log("SAIU");
      }
    },[animal_id]); */

    /*const fetchAnimalDetalhes = async (id: string) => {
      try {
          const animalDocRef = doc(db, 'Animals', id); // Referencia o documento do animal no Firestore.
          const animalDoc = await getDoc(animalDocRef); // Obtém o documento do animal.

          if (animalDoc.exists()) {
              setAnimal(animalDoc.data()); // Define os dados do animal no estado.
          } else {
              console.log('Dados do animal não encontrados');
          }
          setLoading(false); // Define o estado de carregamento como falso.
      } catch (error) {
          console.error('Erro ao buscar detalhes do animal: ', error);
          setLoading(false); // Define o estado de carregamento como falso em caso de erro.
      }
  };*/

    if (currentUser && !esperando) {

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
                            source={{ uri: `data:${dadosAnimal.imagemBase64.assets[0].mimeType};base64,${dadosAnimal.imagemBase64.assets[0].base64}` }}
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

                            <Text style={styles.label}>MAIS SOBRE PEQUI</Text>
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

        if (esperando) 
            return (
                <Modal visible={esperando && modal} animationType='fade' transparent={true}>
                    <ModalLoanding spinner={esperando} />
                </Modal>
            );
        else
            return <AvisoCadastro topbar={false} />;

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