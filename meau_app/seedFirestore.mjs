
import { initializeApp } from 'firebase/app';
import envConfig from '/home/lucas/Documentos/DEV APPS/CODIGO/meau-app/meau_app/src/configs/envConfig.js';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: envConfig.API_KEY,
    authDomain: envConfig.AUTH_DOMAIN,
    projectId: envConfig.PROJECT_ID,
    storageBucket: envConfig.STORAGE_BUCKET,
    messagingSenderId: envConfig.MESSAGING_SENDER_ID,
    appId: envConfig.APP_ID,
    measurementId: envConfig.MEASUREMENT_ID
};

const seedAnimals = async (animals) => {

    const db = getFirestore();
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

    initializeApp(firebaseConfig);

    const animals = [
        { nomeAnimal: 'animal1', /* outras propriedades */ },
        { nomeAnimal: 'animal2', /* outras propriedades */ },
        // Adicione mais animais conforme necessário
    ];

    try {
        await seedAnimals(animals);
        console.log('Processo completo.');
    } catch (error) {
        console.error('Erro geral:', error);
    } finally {
        process.exit(0);
    }
};

main().catch((error) => {
    console.error('Erro na main ', error);
    process.exit(1);
});
