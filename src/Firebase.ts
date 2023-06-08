import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: "AIzaSyDXfjUuI5_Zkx_aHnG3K83Hr24_Kd4HKtA",
//     authDomain: "drp-group-30.firebaseapp.com",
//     databaseURL:
//       "https://drp-group-30-default-rtdb.europe-west1.firebasedatabase.app",
//     projectId: "drp-group-30",
//     storageBucket: "drp-group-30.appspot.com",
//     messagingSenderId: "812261315433",
//     appId: "1:812261315433:web:baacf1b49b8bdce34ee3f8",
//   };

const firebaseConfig = {
	apiKey: "AIzaSyA9c0kmEhbCa0qRcaETlW4i6n4MnPRz2dc",
	authDomain: "drp-test-fd4f1.firebaseapp.com",
	projectId: "drp-test-fd4f1",
	storageBucket: "drp-test-fd4f1.appspot.com",
	messagingSenderId: "166892029221",
	appId: "1:166892029221:web:b37e1ac2f98342431fc6cc",
};

initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = firebase.auth();
export const storage = getStorage();
