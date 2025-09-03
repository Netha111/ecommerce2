import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB-5xSjL1ptNfHVuFL5YcGqiXBmJ-U7iM4",
    authDomain: "ecommerce-5175a.firebaseapp.com",
    projectId: "ecommerce-5175a",
    storageBucket: "ecommerce-5175a.firebasestorage.app",
    messagingSenderId: "1049383381276",
    appId: "1:1049383381276:web:9b5e56eb4c0d2b5a5b72d9",
    measurementId: "G-XCK4DBS5W6"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
