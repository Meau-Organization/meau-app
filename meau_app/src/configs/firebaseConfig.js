
import envConfig from "./envConfig";

// Import the functions you need from the SDKs you need

import { initializeApp, getApp } from "firebase/app";

import { initializeAuth, getAuth, getReactNativePersistence, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: envConfig.API_KEY,
  authDomain: envConfig.AUTH_DOMAIN,
  projectId: envConfig.PROJECT_ID,
  storageBucket: envConfig.STORAGE_BUCKET,
  messagingSenderId: envConfig.MESSAGING_SENDER_ID,
  appId: envConfig.APP_ID,
  measurementId: envConfig.MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
  
export { getApp, getAuth, signInWithEmailAndPassword, onAuthStateChanged };

console.log("Firebase config rodou");