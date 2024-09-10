import Constants from 'expo-constants';
import { useCallback, useState } from "react";
import BotaoUsual from "../components/BotaoUsual";
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";
import { ImageBackground, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import useLoading from '../hooks/useLoading';
import ModalLoanding from '../components/ModalLoanding';
import { StatusBar } from 'expo-status-bar';

const userPadrao = require('../assets/images/user.jpg');

export default function MeuPerfil() {

    //console.log("statusbar: " + Constants.statusBarHeight);

    const { user, dadosUser, buscarDadosUsuario } = useAutenticacaoUser();

    const Loanding = useLoading();

    useFocusEffect(
        useCallback(() => {

            Loanding.setCarregando();

            const fetchUserData = async () => {
                await buscarDadosUsuario(user.uid);
                Loanding.setPronto();

            };

            fetchUserData();
            return () => {
                Loanding.setParado();
                //console.log('Tela perdeu foco');
            };

        }, [])
    );


    return (
        <>
        <ScrollView>
            <StatusBar style="dark" backgroundColor='#cfe9e5' />

            { Loanding.Pronto ?
                <View style={styles.container}>

                    {dadosUser.imagemPrincipalBase64 ? (
                        <ImageBackground
                            source={{ uri: `data:${dadosUser.imagemPrincipalBase64.mimeType};base64,${dadosUser.imagemPrincipalBase64.base64}` }}
                            imageStyle={{ borderRadius: 100 }}
                            resizeMode="cover"
                            style={styles.mini_foto}
                        ></ImageBackground>

                    ) : (
                        <ImageBackground
                            source={userPadrao}
                            imageStyle={{ borderRadius: 100 }}
                            resizeMode="cover"
                            style={styles.mini_foto}
                        ></ImageBackground>
                    )}




                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Roboto-Medium',
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

                    

                </View>
                :
                <Modal visible={Loanding.Carregando} animationType='fade' transparent={true}>
                    <ModalLoanding spinner={Loanding.Carregando} cor={'#cfe9e5'} />
                </Modal>
            }

        </ScrollView>
        <View style={{
            backgroundColor: '#fafafa',
            width: '100%',
            alignItems: 'center',
            height: 80,
            justifyContent: 'center',
        }}>
            <TouchableOpacity activeOpacity={0.5}>
                        <BotaoUsual texto='EDITAR PERFIL' cor='#88c9bf' />
                    </TouchableOpacity>

        </View>
        </>
        


    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        alignItems: 'center',
    },
    mini_foto: {
        width: 112,
        height: 112,
        borderRadius: 100,
        backgroundColor: 'black',
        marginTop: 16,

    },
    label: {
        fontSize: 12,
        fontFamily: 'Roboto-Medium',
        color: '#589b9b',
        marginTop: 28,
        //borderWidth: 1
    },
    dado: {
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
        color: '#757575',
        marginTop: 4,
        //borderWidth: 1
    }
});