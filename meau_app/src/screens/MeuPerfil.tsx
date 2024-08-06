import { ActivityIndicator, FlatList, ImageBackground, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from 'expo-constants';

import { getAuth, db, doc, getDoc } from '../configs/firebaseConfig';
import { useCallback, useEffect, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import AvisoCadastro from "./AvisoCadastro";
import ModalLoanding from "../components/ModalLoanding";
import { TouchableOpacity } from "react-native-gesture-handler";
import BotaoUsual from "../components/BotaoUsual";

const userPadrao = require('../assets/images/user.jpg');


export default function MeuPerfil() {

    //console.log("statusbar: " + Constants.statusBarHeight);

    const [currentUser, setCurrentUser] = useState(null);
    const [dadosUser, setDadosUser] = useState(null);

    const [esperando, setEsperando] = useState(true);
    const [modal, setModal] = useState(true);

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

    useFocusEffect(
        useCallback(() => {
            setEsperando(true);
            
            const user = getAuth().currentUser;

            setCurrentUser(user);

            if (user) {

                buscarDadosUsuario(user.uid);

                console.log("Logado - Pagina Meu Perfil");

            } else {
                setEsperando(false);
                console.log("SAIU");
            }

            return () => {
                //console.log('Tela perdeu foco');
            };

        }, [])
    );

    


    if (currentUser && !esperando) {

        return(
            <ScrollView>
            <View style={styles.container}>

                {dadosUser.imagemPrincipalBase64 ? (
                    <ImageBackground
                        source={{ uri: `data:${dadosUser.imagemPrincipalBase64.mimeType};base64,${dadosUser.imagemPrincipalBase64.base64}` }}
                        imageStyle={{ borderRadius: 100}}
                        resizeMode="contain"
                        style={styles.mini_foto}
                    ></ImageBackground>

                ) : (
                    <ImageBackground
                        source={userPadrao}
                        imageStyle={{ borderRadius: 100}}
                        resizeMode="contain"
                        style={styles.mini_foto}
                    ></ImageBackground>
                )}

                
                

                <Text style={{
                    fontSize: 16,
                    fontFamily: 'Roboto',
                    color: '#434343',
                    marginTop: 12,
                }}>{dadosUser.nome}</Text>

                <Text style={styles.label}>NOME COMPLETO</Text>
                <Text style={styles.dado}>{dadosUser.nome}</Text>

                <Text style={styles.label}>IDADE</Text>
                <Text style={styles.dado}>{dadosUser.idade} anos</Text>

                <Text style={styles.label}>EMAIL</Text>
                <Text style={styles.dado}>{dadosUser.email}</Text>

                <Text style={styles.label}>LOCALIZAÇÃO</Text>
                <Text style={styles.dado}>{dadosUser.cidade} - {dadosUser.estado}</Text>

                <Text style={styles.label}>ENDEREÇO</Text>
                <Text style={styles.dado}>{dadosUser.endereco}--</Text>
                

                <Text style={styles.label}>TELEFONE</Text>
                <Text style={styles.dado}>{dadosUser.telefone}</Text>

                <Text style={styles.label}>NOME DE USUÁRIO</Text>
                <Text style={styles.dado}>{dadosUser.username}</Text>

                <Text style={styles.label}>HISTÓRICO</Text>
                <Text style={styles.dado}>Sem histórico</Text>

                <TouchableOpacity  activeOpacity={0.5}>
                    <BotaoUsual texto='EDITAR PERFIL' cor='#88c9bf' marginTop={32} marginBottom={24}/>
                </TouchableOpacity>

            </View>
            </ScrollView>


        );

    } else {

        if (esperando) 
            return (
                <Modal visible={esperando && modal} animationType='fade' transparent={true}>
                    <ModalLoanding spinner={esperando} cor={'#cfe9e5'}/>
                </Modal>
            );
        else
            return <AvisoCadastro topbar={false} />;

    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'center',
    },
    mini_foto: {
        width: 112,
        height: 112,
        borderRadius: 100,
        backgroundColor: 'black',
        marginTop: 16 - Constants.statusBarHeight,
        
    },
    label: {
        fontSize: 12,
        fontFamily: 'Roboto',
        color: '#589b9b',
        marginTop: 36,
        //borderWidth: 1
    },
    dado: {
        fontSize: 14,
        fontFamily: 'Roboto',
        color: '#757575',
        marginTop: 8,
        //borderWidth: 1
    }
});