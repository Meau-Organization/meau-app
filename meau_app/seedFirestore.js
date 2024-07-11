
import { useState } from 'react';
import { db, collection, addDoc } from './src/configs/firebaseConfig';

import { Image } from 'react-native';

import * as ImageManipulator from 'expo-image-manipulator';

import { Asset } from 'expo-asset';

const convertImageToBase64 = async (req, caminho_string) => {
    try {
        // Carregar a imagem usando expo-asset
        const asset = Asset.fromModule(req);
        await asset.downloadAsync();

        // Usar ImageManipulator para obter informações e converter para base64
        const manipulatedImage = await ImageManipulator.manipulateAsync(
            asset.localUri || asset.uri,
            [],
            { base64: true }
        );

        const formato = "image/" + (caminho_string.split('.').pop() || 'unknown');
        const largura = manipulatedImage.width;
        const altura = manipulatedImage.height;

        return {
            base64: manipulatedImage.base64 || '',
            formato: formato,
            largura: largura,
            altura: altura,
            uri: asset.uri,
        };

    } catch (error) {
        console.log('Error reading file: ', error);
        return { base64: '', formato: '', largura: 0, altura: 0 }; // Retorna um objeto vazio ou você pode lançar um erro
    }
};

// // Exemplo de uso
// const caminhoDaImagem = './src/assets/images/botao_adicionar.png'; // Caminho da imagem
// convertImageToBase64(caminhoDaImagem).then(result => {
//     console.log('Base64:', result.base64);
//     console.log('Formato:', result.formato);
//     console.log('Largura:', result.largura);
//     console.log('Altura:', result.altura);
// }).catch(error => {
//     console.error('Erro:', error);
// });




const seedAnimals = async (animals) => {

    const animalsCollection = collection(db, 'Animals');

    const promises = animals.map(async (animal) => {
        try {
            await addDoc(animalsCollection, animal);
            console.log(`Animal ${animal.nomeAnimal} adionado!`);
        } catch (error) {
            console.error(`Erro ao adicionar animal ${animal.nomeAnimal}:`, error);
            throw error;
        }
    });

    await Promise.all(promises);
    console.log('Seed completo.');
};


const main = async () => {

    const caminho1 = './src/assets/images/animais-seed/1.jpg';
    const caminho2 = './src/assets/images/animais-seed/2.jpg';
    const caminho3 = './src/assets/images/animais-seed/3.jpg';
    const caminho4 = './src/assets/images/animais-seed/4.jpg';
    const caminho5 = './src/assets/images/animais-seed/5.jpg';

    const img1 = require('./src/assets/images/animais-seed/1.jpg');
    const img2 = require('./src/assets/images/animais-seed/2.jpg');
    const img3 = require('./src/assets/images/animais-seed/3.jpg');
    const img4 = require('./src/assets/images/animais-seed/4.jpg');
    const img5 = require('./src/assets/images/animais-seed/5.jpg');


    const caminho_string = './src/assets/images/botao_adicionar.png';
    
    let caminhos = [caminho1, caminho2, caminho3, caminho4, caminho5];
    let requires = [img1, img2, img3, img4, img5];
    let fotos = [];

    for (let i = 0; i < 5; i++) {
        

        const imagem = await convertImageToBase64(requires[i], caminhos[i]);
        
        const base64 = {"assets": [{
            "assetId": null, "base64": imagem.base64, "duration": null, "exif": null,
            "fileName": null, "filesize": null, "height": imagem.altura, "mimeType": imagem.formato,
            "rotation": null, "type": "image", "uri": imagem.uri, "width": imagem.largura}], "canceled": false
        };
        //console.log(base64);

        fotos.push(base64);
    }
    
    //console.log(fotos);

    //const i = await convertImageToBase64(req, caminho_string);
    //console.log("-> " + i.uri);

    //const ob = {"assets": [{"assetId": null, "base64": i.base64, "duration": null, "exif": null, "fileName": null, "filesize": null, "height": i.altura, "mimeType": i.formato, "rotation": null, "type": "image", "uri": i.uri, "width": i.largura}], "canceled": false};
    //console.log(ob);



    const animals = [
        { nomeAnimal: 'animal1', imagemBase64: fotos[0] },
        { nomeAnimal: 'animal2', imagemBase64: fotos[1] },
        { nomeAnimal: 'animal3', imagemBase64: fotos[2] },
        { nomeAnimal: 'animal4', imagemBase64: fotos[3] },
        { nomeAnimal: 'animal5', imagemBase64: fotos[4] },
        // Adicione mais animais conforme necessário
    ];

    try {
        await seedAnimals(animals);
        console.log('Processo completo.');
    } catch (error) {
        console.error('Erro geral:', error);
    } finally {
        //process.exit(0);
    }
};

main().catch((error) => {
    console.error('Erro na main ', error);
    //process.exit(1);
});