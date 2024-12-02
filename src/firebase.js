import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_4iyDEJ20GcU64U5hIwzBbTuvYS-iSS0",
  authDomain: "healthgate-34f2f.firebaseapp.com",
  projectId: "healthgate-34f2f",
  storageBucket: "healthgate-34f2f.firebasestorage.app",
  messagingSenderId: "413879845831",
  appId: "1:413879845831:web:ba90040fec315b3db84fe2",
  measurementId: "G-QKWQ71P36H"
};

  const app = initializeApp(firebaseConfig);
  

  export const auth = getAuth(app); // Untuk otentikasi
  export const db = getFirestore(app); // Untuk Firestore (database)

  export { collection, getDocs };