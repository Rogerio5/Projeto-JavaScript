// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCH6jJ8J6ykwu1Tcbo8qy7j1hmP6sc8gps",
  authDomain: "instagram-clone-project-117db.firebaseapp.com",
  projectId: "instagram-clone-project-117db",
  storageBucket: "instagram-clone-project-117db.appspot.com",
  messagingSenderId: "121821610714",
  appId: "1:121821610714:web:8302bcbf6ad02385349be3",
  measurementId: "G-KREXQEY882"
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Exporta os serviços do Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


