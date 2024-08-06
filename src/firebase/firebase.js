// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyBPT-VmHUsrR41HofEewU68VDRj-2qF5Vc",
  authDomain: "childvaccinationmanageme-f8806.firebaseapp.com",
  databaseURL: "https://childvaccinationmanageme-f8806-default-rtdb.firebaseio.com",
  projectId: "childvaccinationmanageme-f8806",
  storageBucket: "childvaccinationmanageme-f8806.appspot.com",
  messagingSenderId: "1065332602297",
  appId: "1:1065332602297:web:335f52c468ba509c3e7268"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

export { app, auth, db, storage };
