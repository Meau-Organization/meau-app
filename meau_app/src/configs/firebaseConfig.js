
import { initializeApp, getApp } from "firebase/app";

import { initializeAuth, getAuth, getReactNativePersistence, signInWithEmailAndPassword, onAuthStateChanged,
    User, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { getDatabase, ref, child, get, set, query as queryReal, orderByKey, startAt, endAt, limitToLast, onValue, push } from "firebase/database";

import { getFirestore, addDoc, getDoc, setDoc, doc, collection, query, where, getDocs, updateDoc} from "firebase/firestore";





import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID, DATABASE_URL } from '@env';

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

const realtime = getDatabase(app);

  
export {
    getAuth, auth, signInWithEmailAndPassword, onAuthStateChanged, User, signOut, createUserWithEmailAndPassword, db,
    addDoc, getDoc, setDoc, doc, collection, query, where, getDocs, updateDoc, realtime, ref, child, get, set, orderByKey, startAt, endAt, queryReal, limitToLast, onValue, push
};

if (app && auth) {
  console.log("Firebase config rodou");
}
