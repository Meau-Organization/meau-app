require('dotenv').config();
const fs = require('fs');
const path = require('path');

const googleServicesBase = fs.readFileSync('./google-services-base.json', 'utf8');

// console.log("PROJECT_NUMBER", process.env.PROJECT_NUMBER);

const googleServices = googleServicesBase
    .replace('${PROJECT_NUMBER}', process.env.PROJECT_NUMBER)
    .replace('${FIREBASE_URL}', process.env.FIREBASE_URL)
    .replace('${PROJECT_ID}', process.env.PROJECT_ID)
    .replace('${STORAGE_BUCKET}', process.env.STORAGE_BUCKET)
    .replace('${MOBILESDK_APP_ID}', process.env.MOBILESDK_APP_ID)
    .replace('${CURRENT_KEY}', process.env.CURRENT_KEY);

fs.writeFileSync('./google-services.json', googleServices, 'utf8');

console.log('google-services.json GERADO.');