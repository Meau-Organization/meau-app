import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native'
import React, { useState } from 'react';

import { getAuth, createUserWithEmailAndPassword, db, setDoc, doc } from '../../../configs/firebaseConfig';
import { TopBar } from '../../../components/TopBar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackRoutesParametros } from '../../../utils/StackRoutesParametros';
import { useNavigation } from '@react-navigation/native';

import Feather from '@expo/vector-icons/Feather';

import { openImagePickerAsync } from '../../../components/OpenImagePickerAsync';
import OpenImagePicker from '../../../components/OpenImagePickerAsync';
import * as ImagePicker from 'expo-image-picker';
import useVetorBool from '../../../hooks/useVetorBool';

import { validarFinal, onChangeSenhaConfirm, onChangeSenha, validarEmail, onChangeGenerico, mostrarIconeCheckFunc, alertaErros } from '../../../utils/Valida';
import BotaoUsual from '../../../components/BotaoUsual';
import ModalLoanding from '../../../components/ModalLoanding';

export default function CadastroPessoal() {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'CadastroPessoal'>>();
    const [imagemBase64, setImagemBase64] = useState(null);
    //const [abrirCamera, setAbrirCamera] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const [image, setImage] = useState(null);

    const [nome, setNome] = useState(''); const idNome = 0;
    const [idade, setIdade] = useState(''); const idIdade = 1;
    const [email, setEmail] = useState(''); const idEmail = 2;
    const [estado, setEstado] = useState(''); const idEstado = 3;
    const [cidade, setCidade] = useState(''); const idCidade = 4;
    const [endereco, setEndereco] = useState(''); const idEndereco = 5;
    const [telefone, setTelefone] = useState(''); const idTelefone = 6;
    const [username, setUsername] = useState(''); const idUsername = 7;
    const [senha, setSenha] = useState(''); const idSenha = 8;
    const [senhaConfirm, setSenhaConfirm] = useState(''); const idSenhaConfirm = 9;

    const [isLoading, setIsLoadign] = useState(false);
    const [modal, setModal] = useState(true);

    // -------------------------------------------------------------------------------------------------------------------------------
    const [validar, setValidar] = useState(false);
    const [vetorBoolCheckIcone, AlternarCheckIcone] = useVetorBool(10);
    const [vetorBoolFoco, AlternarFoco] = useVetorBool(10);
    const [vetorBoolError, AlternarError] = useVetorBool(10);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result);
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    /*const adicionarImagem = async () => {       // Codigo antigo para usar a camera
        setModal(true);
        const base64 = await openImagePickerAsync(abrirCamera);

        console.log("teste" + base64)
        if (base64) {
            setImagemBase64(base64);
        }
        setModal(false);
    }
     */ 

    //Metodo trata a imagem
    async function handleImagePicked (fromCamera, onImagePicked, onClose) {
        const options = {
            base64: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        };

        let pickerResult;
        if (fromCamera){
            pickerResult = await ImagePicker.launchCameraAsync(options);
        } else {
            pickerResult = await ImagePicker.launchImageLibraryAsync(options);
        }
        if (!pickerResult.cancelled && pickerResult.base64) {
            setImagemBase64(`data:image/jpeg;base64,${pickerResult.base64}`);
        }
        setModalVisible(false);
    };


    type SetStateFunction<String> = React.Dispatch<React.SetStateAction<string>>;
    function onChangeGenericoBase<String>(setFuncao: SetStateFunction<String>, novoTexto: string, checkid: number) {

        onChangeGenerico(
            setFuncao, novoTexto, checkid, vetorBoolCheckIcone, vetorBoolError,
            AlternarCheckIcone, AlternarError);
    }
    const onChangeSenhaConfirmBase = (novoTexto: string) => {
        onChangeSenhaConfirm(
            senha, idSenhaConfirm, novoTexto, setSenhaConfirm,
            vetorBoolCheckIcone, vetorBoolError, AlternarCheckIcone,
            AlternarError,
        )
    }
    const onChangeSenhaBase = (novoTexto: string) => {
        onChangeSenha(
            senha, senhaConfirm, idSenhaConfirm, idSenha, novoTexto,
            setSenha, vetorBoolCheckIcone, vetorBoolError, AlternarCheckIcone,
            AlternarError
        );
    }
    // -------------------------------------------------------------------------------------------------------------------------------


    const auth = getAuth();

    async function cadastrarNovaConta() {
        setIsLoadign(true);

        if (!validarFinal(senha, senhaConfirm, setValidar, vetorBoolCheckIcone)) {

            try {
                await createUserWithEmailAndPassword(getAuth(), email, senha)
                    .then(() => {
                        Alert.alert("Conta", "cadastrada com sucesso");
                        navigation.navigate("DrawerRoutes");
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        setIsLoadign(false);
                    });

                const usuario = getAuth().currentUser;

                if (usuario) {
                    const docRef = await setDoc(doc(db, "Users", usuario.uid), {
                        nome: nome,
                        idade: idade,
                        email: email,
                        estado: estado,
                        cidade: cidade,
                        endereco: endereco,
                        telefone: telefone,
                        username: username,
                        imagemBase64: imagemBase64,
                    });
                    // console.log("Document written with ID: ", docRef.id);
                }

            } catch (e) {
                console.error("Erro para adicionar usuário:", e);
            }
        } else {
            console.log("dados incompletos");

            alertaErros(senha, senhaConfirm, email);
            setIsLoadign(false);
        }
    };

   

    return (
        <>
            <TopBar
                nome='Cadastro'
                icone='voltar'
                irParaPagina={() => navigation.goBack()}
                cor='#88c9bf'
            />
            
            

            <Modal visible={isLoading && modal} animationType='fade' transparent={true}>
                <ModalLoanding spinner={isLoading} />
            </Modal>

            <ScrollView>
                <View style={styles.container}>


                    <View style={styles.messageView}>
                        <Text style={styles.message}> As informações preenchidas serão divulgadas apenas para
                            a pessoa com a qual você realizar o processo de adoção e/ou apadrinhamento,
                            após a formalização do processo.
                        </Text>
                    </View>

                    <Text style={styles.info}> Informações Pessoais</Text>

                    <View style={[
                        styles.inputContainer, { borderColor: vetorBoolFoco[idNome] ? '#88c9bf' : '#e6e7e8', marginTop: 32 }, validar ? !vetorBoolCheckIcone[idNome] ? styles.inputError : null : null]}>

                        <TextInput
                            style={{ width: 288, marginLeft: 12 }}
                            value={nome}
                            onChangeText={(nome) => onChangeGenericoBase(setNome, nome, idNome)}
                            placeholder="Nome completo"
                            placeholderTextColor="#bdbdbd"
                            onFocus={() => AlternarFoco(idNome)}
                            onBlur={() => AlternarFoco(idNome)}
                        />
                        {mostrarIconeCheckFunc(vetorBoolCheckIcone[idNome])}
                    </View>

                    <View style={[styles.inputContainer, { borderColor: vetorBoolFoco[idIdade] ? '#88c9bf' : '#e6e7e8', marginTop: 32 }, validar ? !vetorBoolCheckIcone[idIdade] ? styles.inputError : null : null]}>
                        <TextInput
                            style={{ width: 288, marginLeft: 12 }}
                            value={idade}
                            onChangeText={(idade) => onChangeGenericoBase(setIdade, idade, idIdade)}
                            placeholder="Idade"
                            placeholderTextColor="#bdbdbd"
                            onFocus={() => AlternarFoco(idIdade)}
                            onBlur={() => AlternarFoco(idIdade)}
                        />
                        {mostrarIconeCheckFunc(vetorBoolCheckIcone[idIdade])}
                    </View>

                    <View style={[styles.inputContainer, { borderColor: vetorBoolFoco[idEmail] ? '#88c9bf' : '#e6e7e8', marginTop: 32 }, validar ? !vetorBoolCheckIcone[idEmail] ? styles.inputError : null : null]}>
                        <TextInput
                            style={{ width: 288, marginLeft: 12 }}
                            value={email}
                            onChangeText={(email) => onChangeGenericoBase(setEmail, email, idEmail)}
                            placeholder="Email"
                            placeholderTextColor="#bdbdbd"
                            onFocus={() => AlternarFoco(idEmail)}
                            onBlur={() => AlternarFoco(idEmail)}
                        />
                        {mostrarIconeCheckFunc(vetorBoolCheckIcone[idEmail])}
                        {vetorBoolError[idEmail] ? <Feather name="x" size={24} color="red" /> : null}
                    </View>

                    <View style={[styles.inputContainer, { borderColor: vetorBoolFoco[idEstado] ? '#88c9bf' : '#e6e7e8', marginTop: 32 }, validar ? !vetorBoolCheckIcone[idEstado] ? styles.inputError : null : null]}>
                        <TextInput
                            style={{ width: 288, marginLeft: 12 }}
                            value={estado}
                            onChangeText={(estado) => onChangeGenericoBase(setEstado, estado, idEstado)}
                            placeholder="Estado"
                            placeholderTextColor="#bdbdbd"
                            onFocus={() => AlternarFoco(idEstado)}
                            onBlur={() => AlternarFoco(idEstado)}
                        />
                        {mostrarIconeCheckFunc(vetorBoolCheckIcone[idEstado])}
                    </View>

                    <View style={[styles.inputContainer, { borderColor: vetorBoolFoco[idCidade] ? '#88c9bf' : '#e6e7e8', marginTop: 32 }, validar ? !vetorBoolCheckIcone[idCidade] ? styles.inputError : null : null]}>
                        <TextInput
                            style={{ width: 288, marginLeft: 12 }}
                            value={cidade}
                            onChangeText={(cidade) => onChangeGenericoBase(setCidade, cidade, idCidade)}
                            placeholder="Cidade"
                            placeholderTextColor="#bdbdbd"
                            onFocus={() => AlternarFoco(idCidade)}
                            onBlur={() => AlternarFoco(idCidade)}
                        />
                        {mostrarIconeCheckFunc(vetorBoolCheckIcone[idCidade])}
                    </View>

                    <View style={[styles.inputContainer, { borderColor: vetorBoolFoco[idEndereco] ? '#88c9bf' : '#e6e7e8', marginTop: 32 }, validar ? !vetorBoolCheckIcone[idEndereco] ? styles.inputError : null : null]}>
                        <TextInput
                            style={{ width: 288, marginLeft: 12 }}
                            value={endereco}
                            onChangeText={(endereco) => onChangeGenericoBase(setEndereco, endereco, idEndereco)}
                            placeholder="Endereço"
                            placeholderTextColor="#bdbdbd"
                            onFocus={() => AlternarFoco(idEndereco)}
                            onBlur={() => AlternarFoco(idEndereco)}
                        />
                        {mostrarIconeCheckFunc(vetorBoolCheckIcone[idEndereco])}
                    </View>

                    <View style={[styles.inputContainer, { borderColor: vetorBoolFoco[idTelefone] ? '#88c9bf' : '#e6e7e8', marginTop: 32 }, validar ? !vetorBoolCheckIcone[idTelefone] ? styles.inputError : null : null]}>
                        <TextInput
                            style={{ width: 288, marginLeft: 12 }}
                            value={telefone}
                            onChangeText={(telefone) => onChangeGenericoBase(setTelefone, telefone, idTelefone)}
                            placeholder="Telefone"
                            placeholderTextColor="#bdbdbd"
                            onFocus={() => AlternarFoco(idTelefone)}
                            onBlur={() => AlternarFoco(idTelefone)}
                        />
                        {mostrarIconeCheckFunc(vetorBoolCheckIcone[idTelefone])}
                    </View>


                    <Text style={styles.info}> Informações de Perfil</Text>

                    <View style={[styles.inputContainer, { borderColor: vetorBoolFoco[idUsername] ? '#88c9bf' : '#e6e7e8', marginTop: 32 }, validar ? !vetorBoolCheckIcone[idUsername] ? styles.inputError : null : null]}>
                        <TextInput
                            style={{ width: 288, marginLeft: 12 }}
                            value={username}
                            onChangeText={(username) => onChangeGenericoBase(setUsername, username, idUsername)}
                            placeholder="Nome de usuário"
                            placeholderTextColor="#bdbdbd"
                            onFocus={() => AlternarFoco(idUsername)}
                            onBlur={() => AlternarFoco(idUsername)}
                        />
                        {mostrarIconeCheckFunc(vetorBoolCheckIcone[idUsername])}
                    </View>

                    <View style={[styles.inputContainer, { borderColor: vetorBoolFoco[idSenha] ? '#88c9bf' : '#e6e7e8', marginTop: 32 }, validar ? !vetorBoolCheckIcone[idSenha] ? styles.inputError : null : null]}>
                        <TextInput
                            secureTextEntry={true}
                            style={{ width: 288, marginLeft: 12 }}
                            value={senha}
                            onChangeText={onChangeSenhaBase}
                            placeholder="Senha"
                            placeholderTextColor="#bdbdbd"
                            onFocus={() => AlternarFoco(idSenha)}
                            onBlur={() => AlternarFoco(idSenha)}
                        />
                        {mostrarIconeCheckFunc(vetorBoolCheckIcone[idSenha])}
                        {!vetorBoolCheckIcone[idSenha] ? <Text style={{ color: '#bdbdbd', marginLeft: -80, fontSize: 12 }}>Min 8 caracteres</Text> : null}
                    </View>

                    <View style={[styles.inputContainer, { borderColor: vetorBoolFoco[idSenhaConfirm] ? '#88c9bf' : '#e6e7e8', marginTop: 32 }, validar ? !vetorBoolCheckIcone[idSenhaConfirm] ? styles.inputError : null : null]}>
                        <TextInput
                            secureTextEntry={true}
                            style={{ width: 288, marginLeft: 12 }}
                            value={senhaConfirm}
                            onChangeText={onChangeSenhaConfirmBase}
                            placeholder="Confirmação de senha"
                            placeholderTextColor="#bdbdbd"
                            onFocus={() => AlternarFoco(idSenhaConfirm)}
                            onBlur={() => AlternarFoco(idSenhaConfirm)}
                        />
                        {mostrarIconeCheckFunc(vetorBoolCheckIcone[idSenhaConfirm])}
                        {vetorBoolError[idSenhaConfirm] ? <Feather name="x" size={24} color="red" /> : null}
                    </View>

                    <Text style={styles.info}> Foto de Perfil</Text>

                    <View style={styles.imageButtonContainer}>
                        <TouchableOpacity
                            style={styles.imageButton}
                            onPress={() => setModalVisible(true)}>
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
                            {modalVisible && (<OpenImagePicker
                                                    onImagePicked={handleImagePicked}
                                                    onClose={() => setModalVisible(false)}>                                    
                                                </OpenImagePicker>)}
                            <Text style={styles.textButton}>Adicionar Foto</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity disabled={isLoading} onPress={cadastrarNovaConta} activeOpacity={0.5}>
                        <BotaoUsual texto='FAZER CADASTRO' marginTop={32} marginBottom={24} cor='#88c9bf' />
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        alignItems: 'center'
    },
    messageView: {
        height: 81,
        width: 329,
        backgroundColor: '#cfe8e5',
        marginTop: 15,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    message: {
        marginLeft: 35,
        marginRight: 33,
        fontSize: 10,
        textAlign: 'center',

    },
    info: {
        width: 328,
        marginTop: 28,
        color: '#589b9b',
        fontWeight: 'bold',
    },
    imageButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageButton: {
        width: 128,
        height: 128,
        borderRadius: 8,
        backgroundColor: '#e6e7e7',
        marginTop: 32,
        padding: 10,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 8,
            height: 8
        },
        elevation: 15,
    },
    textButton: {
        alignSelf: 'center',
        textAlign: 'center',
        color: '#757575',
        fontFamily: 'Roboto',
        fontSize: 14
    },
    imageAddButton: {
        width: 24,
        height: 24,
        resizeMode: "contain",
        alignSelf: 'center'
    },
    image: {
        width: 128,
        height: 128,
        borderRadius: 8,
        backgroundColor: '#e6e7e7',
        marginTop: 32,
        padding: 10,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: 328,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e7e8',
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor: 'green'
    },
    inputError: {
        borderColor: 'red',
    },

})

export { CadastroPessoal };