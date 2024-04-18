
import envConfig from "./envConfig";

import { initializeApp, getApp } from "firebase/app";

import { initializeAuth, getAuth, getReactNativePersistence, signInWithEmailAndPassword, onAuthStateChanged, User, signOut } from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: envConfig.API_KEY,
  authDomain: envConfig.AUTH_DOMAIN,
  projectId: envConfig.PROJECT_ID,
  storageBucket: envConfig.STORAGE_BUCKET,
  messagingSenderId: envConfig.MESSAGING_SENDER_ID,
  appId: envConfig.APP_ID,
  measurementId: envConfig.MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);


const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
  
export { getApp, auth, signInWithEmailAndPassword, onAuthStateChanged, User, signOut };

if (app && auth) {
  console.log("Firebase config rodou");
}
