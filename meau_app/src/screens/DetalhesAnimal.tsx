import { StyleSheet, Text, View , ScrollView, Image, TouchableOpacity} from "react-native";
import Constants from 'expo-constants';
import { useEffect, useState } from "react";
import { getAuth, db, doc, getDoc } from "../configs/firebaseConfig";
import ModalLoanding from "../components/ModalLoanding";
import AvisoCadastro from "./AvisoCadastro";
import BotaoUsual from "../components/BotaoUsual";
import { TopBar } from "../components/TopBar";

interface DetalhesAnimalProps {
  route: {
      params: {
          animal_id: string;
      };
  };
} // Define a interface para as props do componente, especificamente a rota e os parâmetros passados.


export default function DetalhesAnimal({ route }: DetalhesAnimalProps) {

    const { animal_id } = route.params; // Extrai o id do animal dos parâmetros da rota.
    const [animal, setAnimal] = useState<any>(null); // Define um estado para armazenar os dados do animal.
    const [loading, setLoading] = useState(true); // Define um estado para controlar o carregamento.
    const [modal, setModal] = useState(true); // Define um estado para controlar a visibilidade do modal.
    const [currentUser, setCurrentUser] = useState<any>(null); // Define um estado para armazenar o usuário atual.
    const [esperando, setEsperando] = useState(true); // Define um estado para controlar o estado de espera.

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

    if (true){
      return(
          <ScrollView contentContainerStyle={styles.container}>
          <TopBar
            nome ="Nome Animal"
            icone='voltar'
            cor='#88c9bf'
            irParaPagina={() => navigation.navigate("DrawerRoutes")}
            />
          <Image source={{ }} style={styles.image} />
          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>SEXO</Text>
                <Text style={styles.text}>{animal_id}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>PORTE</Text>
                <Text style={styles.text}>{animal_id}</Text>

              </View>
              <View style={styles.column}>
                <Text style={styles.label}>IDADE</Text>
                <Text style={styles.text}>{animal_id}</Text>
              </View>

            </View>
            <Text style={styles.label}>LOCALIZAÇÃO</Text>
            <Text style={styles.text}>{animal_id}</Text>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>CASTRADO</Text>
                <Text style={styles.text}>{animal_id}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}> VERMIFUGADO</Text>
                <Text style={styles.text}>{animal_id}</Text>

              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>VACINADO</Text>
                <Text style={styles.text}>{animal_id}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>DOENÇAS</Text>
                <Text style={styles.text}>{animal_id}</Text>

              </View>
            </View>

            <Text style={styles.label}>TEMPERAMENTO</Text>
            <Text style={styles.text}>{animal_id}</Text>

    
            <Text style={styles.label}>O {animal_id} PRECISA DE</Text>
            <Text style={styles.description}>{animal_id}</Text>
    
    
            <Text style={styles.label}>EXIGÊNCIAS DO DOADOR</Text>
            <Text style={styles.text}>{animal_id ? 'Sim' : 'Não'}</Text>
    
            <Text style={styles.label}>O {animal_id} PRECISA DE</Text>
            <Text style={styles.text}>{animal_id}</Text>
            <Text style={styles.text}>{animal_id}</Text>
            <Text style={styles.text}>{animal_id}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>VER INTERESSADOS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>REMOVER PET</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )
  }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'left',
        paddingLeft: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 16,
  },
  column: {
    flex: 1,
    alignItems: 'center',
},
    image: {
        width: 360,
        height: 184,
        borderRadius: 10,
        
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
        marginTop: 16,
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
});