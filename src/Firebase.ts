import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDXfjUuI5_Zkx_aHnG3K83Hr24_Kd4HKtA",
  authDomain: "drp-group-30.firebaseapp.com",
  databaseURL:
    "https://drp-group-30-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "drp-group-30",
  storageBucket: "drp-group-30.appspot.com",
  messagingSenderId: "812261315433",
  appId: "1:812261315433:web:baacf1b49b8bdce34ee3f8",
};

initializeApp(firebaseConfig);
export const db = getFirestore();
export const storage = getStorage();
