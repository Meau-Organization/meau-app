import {View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import React, {useState} from 'react';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import {getAuth, createUserWithEmailAndPassword} from '../../../configs/firebaseConfig';

export default function CadastroPessoal(){
  
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [Logradouro, setLogradouro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoadign] = useState(false);

  const auth = getAuth();

  function cadastrarNovaConta(){
    setIsLoadign(true);

    createUserWithEmailAndPassword(auth, email, senha)
    .then(() => Alert.alert("Conta", "cadastrada com sucesso"))
    .catch((error) => console.log(error))
    .finally(() => setIsLoadign(false));
  }


  return(
    
    <View style = {styles.container}>
      <ScrollView>

        <View style = {styles.messageView}> 
          <Text style = {styles.message}> As informações preenchidas serão divulgadas apenas para 
            a pessoa com a qual você realizar o processo de adoção e/ou apadrinhamento, 
            após a formalização do processo.
          </Text>
        </View>

        <Text style = {styles.info}> Informações Pessoais</Text>

       
          
        <TextInput style = {styles.textName} onChangeText={setNome}> Nome </TextInput>
        <View style = {styles.containerName}>
          
        </View>
          
        <TextInput style = {styles.textName} onChangeText={setIdade}> Idade </TextInput>
        <View style = {styles.containerName}>
            
        </View>

        <TextInput style = {styles.textName} onChangeText={setEmail}> E-mail </TextInput>  
        <View style = {styles.containerName}>
            
        </View>

        <TextInput style = {styles.textName} onChangeText={setEstado}> Estado </TextInput>  
        <View style = {styles.containerName}>
            
        </View>

        <TextInput style = {styles.textName} onChangeText={setCidade}> Cidade </TextInput>
        <View style = {styles.containerName}>
            
        </View>
          
        <TextInput style = {styles.textName} onChangeText={setLogradouro}> Logradouro </TextInput>
        <View style = {styles.containerName}>
            
        </View>

        <TextInput style = {styles.textName} onChangeText={setTelefone}> Telefone </TextInput>
        <View style = {styles.containerName}>
            
            
        </View>
        

        <Text style = {styles.info}> Informações de Perfil</Text>

        <TextInput style = {styles.textName} onChangeText={setUsername}> Nome de usuário </TextInput>
        <View style = {styles.containerName}>
            
        </View>
        
        <TextInput style = {styles.textName} secureTextEntry onChangeText={setSenha}> Senha </TextInput>
        <View style = {styles.containerName}>
            
        </View>

        <TextInput style = {styles.textName}> Confirmação de senha </TextInput>
        <View style = {styles.containerName}>
            
        </View>

        <Text style = {styles.info}> Foto de Perfil</Text>

        <View style = {styles.imageButtonContainer}> 
          <TouchableOpacity style = {styles.imageButton} onPress={() => console.log('Botão pressionado')}>
            <Image
              source={require('../../../assets/images/botao_adicionar.png')}
              style={styles.imageAddButton}
            />
            <Text style ={styles.textButton}> Adicionar foto</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity style = {styles.loginButton} disabled = {isLoading} onPress={cadastrarNovaConta}>
            <Text >Fazer Cadastro</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>  
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
        flex:1, 
        backgroundColor: '#f9f9f9',
    },
    menuIcon:{
      marginTop: 16,
      marginLeft: 16,
    },
    viewTitle: { 
      marginTop:30,
      backgroundColor: '#cfe8e5',
      width: "100%",
      height: 57,
      flex: 1,
      flexDirection: 'row'
    },
    title:{
      marginLeft: 30,
      marginTop: 16,
      fontSize: 20,
      color: '#434343'
    },
    messageView:{
      height: 81,
      width:329,
      backgroundColor: '#cfe8e5',
      marginTop: 15,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8
    },
    message:{
      marginLeft: 35,
      marginRight: 33, 
      fontSize: 10,
      textAlign: 'center',
  
    },
    info: {
      marginTop: 24,
      marginLeft: 24,
      color: '#589b9b',
      fontWeight: 'bold',
    },
    information: {
      width: 332,
      height: 480,
      backgroundColor: '#f9f9f9'
    },
    containerName:{
      width: 328,
      height: 0.8,
      backgroundColor: '#e6e7e8',
      marginLeft: 16,
      marginTop: 8,
      justifyContent: 'flex-start',
    
    },
    textName: {
      marginTop: 32,
      marginLeft: 28,
      color: '#bdbdbd',
      fontSize: 14,
      fontFamily: 'Roboto'
    }, 
    textUsername:{
      opacity: 0.5,
      marginTop: 32,
      marginLeft: 28
    },
    containerPassword: {
      width: 328,
      height: 0.8,
      backgroundColor: '#e6e7e8',
      marginLeft: 16
    },
    imageButtonContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageButton:{
      width: 128,
      height: 128,
      borderRadius: 8,
      backgroundColor: '#e6e7e7', 
      marginTop: 32,
      padding:10,
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset:{
        width: 8,
        height: 8
      },
      elevation:15
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
    loginButton: {
      marginTop: 32,
      backgroundColor: '#88c9bf',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems:'center',
      width: 232,
      height: 40,
      borderRadius: 8,
      shadowColor: '#000000',
      shadowOffset:{
        width: 8,
        height: 8
      },
      elevation: 8,
      marginBottom:32
    }

})

export{CadastroPessoal};