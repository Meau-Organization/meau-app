import AsyncStorage from '@react-native-async-storage/async-storage';


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