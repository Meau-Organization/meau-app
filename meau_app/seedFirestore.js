
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
                //await addDoc(animalsCollection, animal);
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
    const caminho6 = './src/assets/images/animais-seed/6.jpg';
    const caminho7 = './src/assets/images/animais-seed/7.jpg';
    const caminho8 = './src/assets/images/animais-seed/8.jpg';
    const caminho9 = './src/assets/images/animais-seed/9.jpg';
    const caminho10 = './src/assets/images/animais-seed/10.jpg';
    const caminho11 = './src/assets/images/animais-seed/11.jpg';
    const caminho12 = './src/assets/images/animais-seed/12.jpg';
    const caminho13 = './src/assets/images/animais-seed/13.jpg';
    const caminho14 = './src/assets/images/animais-seed/14.jpg';
    const caminho15 = './src/assets/images/animais-seed/15.jpg';
    const caminho16 = './src/assets/images/animais-seed/16.jpg';
    const caminho17 = './src/assets/images/animais-seed/17.jpg';
    const caminho18 = './src/assets/images/animais-seed/18.jpg';
    const caminho19 = './src/assets/images/animais-seed/19.jpg';
    const caminho20 = './src/assets/images/animais-seed/20.jpg';

    const img1 = require('./src/assets/images/animais-seed/1.jpg');
    const img2 = require('./src/assets/images/animais-seed/2.jpg');
    const img3 = require('./src/assets/images/animais-seed/3.jpg');
    const img4 = require('./src/assets/images/animais-seed/4.jpg');
    const img5 = require('./src/assets/images/animais-seed/5.jpg');
    const img6 = require('./src/assets/images/animais-seed/6.jpg');
    const img7 = require('./src/assets/images/animais-seed/7.jpg');
    const img8 = require('./src/assets/images/animais-seed/8.jpg');
    const img9 = require('./src/assets/images/animais-seed/9.jpg');
    const img10 = require('./src/assets/images/animais-seed/10.jpg');
    const img11 = require('./src/assets/images/animais-seed/11.jpg');
    const img12 = require('./src/assets/images/animais-seed/12.jpg');
    const img13 = require('./src/assets/images/animais-seed/13.jpg');
    const img14 = require('./src/assets/images/animais-seed/14.jpg');
    const img15 = require('./src/assets/images/animais-seed/15.jpg');
    const img16 = require('./src/assets/images/animais-seed/16.jpg');
    const img17 = require('./src/assets/images/animais-seed/17.jpg');
    const img18 = require('./src/assets/images/animais-seed/18.jpg');
    const img19 = require('./src/assets/images/animais-seed/19.jpg');
    const img20 = require('./src/assets/images/animais-seed/20.jpg');


    const caminho_string = './src/assets/images/botao_adicionar.png';
    
    let caminhos = [caminho1, caminho2, caminho3, caminho4, caminho5,
                    caminho6, caminho7, caminho8, caminho9, caminho10,
                    caminho11, caminho12, caminho13, caminho14, caminho15,
                    caminho16, caminho17, caminho18, caminho19, caminho20
    ];
    
    let requires = [img1, img2, img3, img4, img5,
                    img6, img7, img8, img9, img10,
                    img11, img12, img13, img14, img15,
                    img16, img17, img18, img19, img20
    ];
    let fotos = [];

    for (let i = 0; i < 20; i++) {
        

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
        {nomeAnimal: "Bolt", especie: "Cachorro", sexo: "Macho", porte: "Grande",
        idade: "Adulto", temperamento: ["Brincalhão", "Guarda"], saude: ["Vacinado", "Castrado"], doencasAnimal: "Sem doenças",
        sobreAnimal: "Bolt é um cachorro cheio de energia que adora brincar no parque. Ele é muito leal e protege sua família com todo o coração.",
        termosAdocao: true, exigenciaFotosCasa: true, visitaPrevia: false, tempoAcompanhamento: 2,
        usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Braslia", estado: "DF", imagemBase64: fotos[0], disponivel: true},

        {nomeAnimal: "Luna", especie: "Gato", sexo: "Fêmea", porte: "Pequeno",
        idade: "Filhote", temperamento: ["Tímido", "Calmo"], saude: ["Vermifugado"], doencasAnimal: "Sem doenças",
        sobreAnimal: "Luna é uma gatinha tímida que está à procura de um lar calmo e amoroso. Ela adora se esconder em lugares aconchegantes.",
        termosAdocao: false, exigenciaFotosCasa: false, visitaPrevia: true, tempoAcompanhamento: 1,
        usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Braslia", estado: "DF", imagemBase64: fotos[1], disponivel: true},

        {nomeAnimal: "Max", especie: "Cachorro", sexo: "Macho", porte: "Médio",
        idade: "Idoso", temperamento: ["Calmo", "Amoroso"], saude: ["Vacinado", "Castrado", "Doente"],doencasAnimal: "Sem doenças",
        sobreAnimal: "Max é um cãozinho idoso que ainda tem muito amor para dar. Ele adora um carinho e passeios tranquilos pelo bairro.",
        termosAdocao: true, exigenciaFotosCasa: true, visitaPrevia: true, tempoAcompanhamento: 3,
        usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Braslia", estado: "DF", imagemBase64: fotos[2], disponivel: true},

        {nomeAnimal: "Mia", especie: "Gato", sexo: "Fêmea", porte: "Pequeno",
        idade: "Adulto", temperamento: ["Amoroso", "Preguiçoso"], saude: ["Vermifugado", "Castrado"], doencasAnimal: "Sem doenças",
        sobreAnimal: "Mia é uma gata adulta muito carinhosa que adora passar o dia deitada no sol. Ela é perfeita para quem procura um companheiro tranquilo.",
        termosAdocao: false, exigenciaFotosCasa: true, visitaPrevia: false, tempoAcompanhamento: 0,
        usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Braslia", estado: "DF", imagemBase64: fotos[3], disponivel: true},

        {nomeAnimal: "Rex", especie: "Cachorro", sexo: "Macho", porte: "Grande",
        idade: "Filhote", temperamento: ["Brincalhão", "Amoroso"], saude: ["Vacinado", "Vermifugado"], doencasAnimal: "Sem doenças",
        sobreAnimal: "Rex é um filhote de cachorro cheio de energia e amor. Ele está sempre pronto para uma brincadeira e adora receber carinho.",
        termosAdocao: true, exigenciaFotosCasa: false, visitaPrevia: true, tempoAcompanhamento: 1,
        usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Braslia", estado: "DF", imagemBase64: fotos[4], disponivel: true},

        {nomeAnimal: "Bella", especie: "Cachorro", sexo: "Fêmea", porte: "Médio",
        idade: "Adulto", temperamento: ["Calmo", "Amoroso"], saude: ["Vacinado", "Castrado"], doencasAnimal: "Sem doenças",
        sobreAnimal: "Bella é uma cachorra adulta muito carinhosa e calma. Ela adora passeios tranquilos e receber carinho.",
        termosAdocao: true, exigenciaFotosCasa: false, visitaPrevia: true, tempoAcompanhamento: 2,
        usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[5], disponivel: true},

        {nomeAnimal: "Charlie", especie: "Gato", sexo: "Macho", porte: "Pequeno", idade: "Filhote", temperamento: ["Brincalhão", "Tímido"], saude: ["Vermifugado"], doencasAnimal: "Sem doenças", sobreAnimal: "Charlie é um gatinho filhote brincalhão que adora explorar, mas é um pouco tímido no início.", termosAdocao: false, exigenciaFotosCasa: true, visitaPrevia: false, tempoAcompanhamento: 0, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[6], disponivel: true},
        {nomeAnimal: "Lucy", especie: "Cachorro", sexo: "Fêmea", porte: "Grande", idade: "Idoso", temperamento: ["Calmo", "Guarda"], saude: ["Vacinado", "Castrado"], doencasAnimal: "Sem doenças", sobreAnimal: "Lucy é uma cadela idosa muito calma que adora proteger sua família. Ela é uma guardiã leal.", termosAdocao: true, exigenciaFotosCasa: true, visitaPrevia: true, tempoAcompanhamento: 3, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[7], disponivel: true},
        {nomeAnimal: "Simba", especie: "Gato", sexo: "Macho", porte: "Pequeno", idade: "Adulto", temperamento: ["Amoroso", "Preguiçoso"], saude: ["Vermifugado", "Castrado"], doencasAnimal: "Sem doenças", sobreAnimal: "Simba é um gato adulto muito amoroso que adora passar o dia descansando em lugares confortáveis.", termosAdocao: false, exigenciaFotosCasa: false, visitaPrevia: true, tempoAcompanhamento: 1, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[8], disponivel: true},
        {nomeAnimal: "Rocky", especie: "Cachorro", sexo: "Macho", porte: "Grande", idade: "Filhote", temperamento: ["Brincalhão", "Guarda"], saude: ["Vacinado", "Vermifugado"], doencasAnimal: "Sem doenças", sobreAnimal: "Rocky é um filhote cheio de energia que adora brincar e proteger sua família. Ele é muito leal.", termosAdocao: true, exigenciaFotosCasa: true, visitaPrevia: false, tempoAcompanhamento: 2, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[9], disponivel: true},
        {nomeAnimal: "Lola", especie: "Cachorro", sexo: "Fêmea", porte: "Médio", idade: "Filhote", temperamento: ["Amoroso", "Brincalhão"], saude: ["Vacinado"], doencasAnimal: "Sem doenças", sobreAnimal: "Lola é uma filhote muito amorosa que adora brincar e receber carinho. Ela é muito afetuosa.", termosAdocao: false, exigenciaFotosCasa: false, visitaPrevia: true, tempoAcompanhamento: 1, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[10], disponivel: true},
        {nomeAnimal: "Oscar", especie: "Gato", sexo: "Macho", porte: "Pequeno", idade: "Idoso", temperamento: ["Calmo", "Preguiçoso"], saude: ["Vermifugado", "Castrado", "Doente"], doencasAnimal: "Sem doenças", sobreAnimal: "Oscar é um gato idoso muito calmo que adora descansar e receber carinho. Ele tem algumas necessidades especiais de saúde.", termosAdocao: true, exigenciaFotosCasa: true, visitaPrevia: false, tempoAcompanhamento: 3, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[11], disponivel: true},
        {nomeAnimal: "Daisy", especie: "Cachorro", sexo: "Fêmea", porte: "Pequeno", idade: "Adulto", temperamento: ["Tímido", "Calmo"], saude: ["Vacinado", "Castrado"], doencasAnimal: "Sem doenças", sobreAnimal: "Daisy é uma cachorra adulta muito calma e tímida que procura um lar tranquilo onde possa se sentir segura.", termosAdocao: false, exigenciaFotosCasa: true, visitaPrevia: true, tempoAcompanhamento: 2, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[12], disponivel: true},
        {nomeAnimal: "Milo", especie: "Gato", sexo: "Macho", porte: "Pequeno", idade: "Filhote", temperamento: ["Brincalhão", "Amoroso"], saude: ["Vermifugado"], doencasAnimal: "Sem doenças", sobreAnimal: "Milo é um gatinho filhote cheio de energia que adora brincar e receber carinho. Ele é muito sociável.", termosAdocao: true, exigenciaFotosCasa: false, visitaPrevia: true, tempoAcompanhamento: 1, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[13], disponivel: true},
        {nomeAnimal: "Buddy", especie: "Cachorro", sexo: "Macho", porte: "Grande", idade: "Adulto", temperamento: ["Calmo", "Guarda"], saude: ["Vacinado", "Castrado"], doencasAnimal: "Sem doenças", sobreAnimal: "Buddy é um cachorro adulto muito calmo e protetor. Ele é muito leal e está sempre alerta para proteger sua família.", termosAdocao: true, exigenciaFotosCasa: true, visitaPrevia: false, tempoAcompanhamento: 3, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[14], disponivel: true},
        {nomeAnimal: "Nala", especie: "Gato", sexo: "Fêmea", porte: "Pequeno", idade: "Adulto", temperamento: ["Amoroso", "Preguiçoso"], saude: ["Vermifugado", "Castrado"], doencasAnimal: "Sem doenças", sobreAnimal: "Nala é uma gata adulta muito amorosa que adora passar o dia descansando em lugares confortáveis e receber carinho.", termosAdocao: false, exigenciaFotosCasa: true, visitaPrevia: true, tempoAcompanhamento: 2, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[15], disponivel: true},
        {nomeAnimal: "Snoopy", especie: "Cachorro", sexo: "Macho", porte: "Médio", idade: "Filhote", temperamento: ["Brincalhão", "Amoroso"], saude: ["Vacinado", "Vermifugado"], doencasAnimal: "Sem doenças", sobreAnimal: "Snoopy é um filhote muito brincalhão que adora correr e brincar. Ele é muito afetuoso e adora receber carinho.", termosAdocao: true, exigenciaFotosCasa: false, visitaPrevia: true, tempoAcompanhamento: 1, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[16], disponivel: true},
        {nomeAnimal: "Chloe", especie: "Gato", sexo: "Fêmea", porte: "Pequeno", idade: "Idoso", temperamento: ["Calmo", "Preguiçoso"], saude: ["Vermifugado", "Castrado", "Doente"], doencasAnimal: "Sem doenças", sobreAnimal: "Chloe é uma gata idosa muito calma que adora descansar e receber carinho. Ela tem algumas necessidades especiais de saúde.", termosAdocao: false, exigenciaFotosCasa: true, visitaPrevia: true, tempoAcompanhamento: 3, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[17], disponivel: true},
        {nomeAnimal: "Toby", especie: "Cachorro", sexo: "Macho", porte: "Grande", idade: "Adulto", temperamento: ["Guarda", "Amoroso"], saude: ["Vacinado", "Castrado"], doencasAnimal: "Sem doenças", sobreAnimal: "Toby é um cachorro adulto muito protetor e amoroso. Ele adora passear e proteger sua família.", termosAdocao: true, exigenciaFotosCasa: false, visitaPrevia: true, tempoAcompanhamento: 2, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[18], disponivel: true},
        {nomeAnimal: "Mimi", especie: "Gato", sexo: "Fêmea", porte: "Pequeno", idade: "Filhote", temperamento: ["Brincalhão", "Amoroso"], saude: ["Vermifugado"], doencasAnimal: "Sem doenças", sobreAnimal: "Mimi é uma gatinha filhote muito brincalhona que adora explorar e receber carinho. Ela é muito sociável.", termosAdocao: true, exigenciaFotosCasa: true, visitaPrevia: false, tempoAcompanhamento: 1, usuario_id: 'LfWJ8Kb1EWOwfcaq2pbKO6aTPok1', cidade: "Brasília", estado: "DF", imagemBase64: fotos[19], disponivel: true},


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