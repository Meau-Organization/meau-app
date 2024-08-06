
import { initializeApp, getApp } from "firebase/app";

import { initializeAuth, getAuth, getReactNativePersistence, signInWithEmailAndPassword, onAuthStateChanged,
    User, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { getFirestore, addDoc, getDoc, setDoc, doc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";


import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);


const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);
  
export {
    getAuth, auth, signInWithEmailAndPassword, onAuthStateChanged, User, signOut, createUserWithEmailAndPassword, db,
    addDoc, getDoc, setDoc, doc, collection, query, where, getDocs, updateDoc
};

if (app && auth) {
  console.log("Firebase config rodou");
}
