
import { initializeApp } from "firebase/app";

import {
    User, signOut, getAuth, initializeAuth, onAuthStateChanged, getReactNativePersistence,
    signInWithEmailAndPassword, createUserWithEmailAndPassword
} from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import {
    getFirestore, addDoc, getDoc, setDoc, doc, collection, query, where, getDocs, updateDoc,
    onSnapshot, orderBy, limitToLast, arrayUnion
} from "firebase/firestore";


import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID,
    MEASUREMENT_ID, DATABASE_URL
} from '@env';

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
    databaseURL: DATABASE_URL,
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export {
    getAuth, auth, signInWithEmailAndPassword, onAuthStateChanged, User, signOut,
    createUserWithEmailAndPassword, db, addDoc, getDoc, setDoc, doc, collection, query,
    where, getDocs, updateDoc, onSnapshot, orderBy, limitToLast, arrayUnion
};

if (app && auth) {
    console.log("Firebase config rodou");
}
