import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, signOut } from '../configs/FirebaseConfig';
import { Alert } from 'react-native';
import * as Font from 'expo-font';


export async function getOrCreateInstallationId() {
    let installationId = await AsyncStorage.getItem('installationId');
    if (!installationId) {
        installationId = Math.floor(Date.now() * Math.random()).toString(36);
        await AsyncStorage.setItem('installationId', installationId);
    }
    console.log("ID Instalação do App:", installationId);
    return installationId;
}

export async function salvarRotaAtiva(nomeRotaAtiva: string) {
    try {
        await AsyncStorage.setItem('@rotaAtiva', nomeRotaAtiva);
        //console.log('Salvou rota....................', nomeRotaAtiva);
    } catch (error) {
        console.error('Erro ao salvar o nome da rota:', error);
    }
};

export async function processarRota(nomeRotaAtiva : string) {
    const nomeRotaArmazenada = await AsyncStorage.getItem('@rotaAtiva');
    if (nomeRotaArmazenada) {
        const [preFixoRotaAtiva, _] = nomeRotaArmazenada.split(':');
        // console.log('Pre-fixo ROTA:', preFixoRotaAtiva);
        if (nomeRotaAtiva != preFixoRotaAtiva) {
            await salvarRotaAtiva(nomeRotaAtiva);
        }
    } else {
        await salvarRotaAtiva(nomeRotaAtiva);
    }
};

export async function logout(userId : string, setUser: React.Dispatch<React.SetStateAction<any>>) {

    signOut(auth)
        .then(() => {
            setUser(null); //Define o estaudo global como null após logout
            console.log('Usuario Saiu');
        })
        .catch((error) => {
            Alert.alert('Erro', 'Erro ao tentar fazer fazer o logout');
            console.error('Erro ao tentar fazer fazer o logout:', error);
        });
};

export async function carregarFontes() {
    console.log('Carregando fontes...');
    await Font.loadAsync({
        'Courgette-Regular': require('../assets/fonts/Courgette-Regular.ttf'),
        'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf')
    });
    console.log('Fontes Carregadas');
};