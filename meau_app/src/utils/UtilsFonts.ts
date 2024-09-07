
import * as Font from 'expo-font';

export let fonteCarregada = false; // Definindo a variável global

async function carregarFontes() {
    await Font.loadAsync({
        'Courgette-Regular': require('../assets/fonts/Courgette-Regular.ttf'),
    });
    fonteCarregada = true;
}

carregarFontes();

console.log('Carregando fontes....');

