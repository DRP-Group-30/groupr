import { Center } from "@chakra-ui/react";
import firebase from "firebase/compat/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebaseui from "firebaseui";
import { Firebase } from "../../backend/firebase";
import React from "react";
import { doc, getDoc } from "firebase/firestore";

/**
 * Configuration for the UI.
 */
const SIGN_IN_CONFIG: firebaseui.auth.Config = {
	// Popup signin flow rather than redirect flow.
	signInFlow: "popup",
	// Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
	signInSuccessUrl: "/signedIn",
	// We will display Google and Facebook as auth providers.
	signInOptions: [
		{
			provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
			requireDisplayName: false,
		},
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
	],
};

export function getCurrentUser() {
	const { currentUser } = firebase.auth();
	return getDoc(doc(Firebase.db, "users", currentUser?.uid ?? ""));
}

export function getCurrentUserRef() {
	const { currentUser } = firebase.auth();
	return doc(Firebase.db, "users", currentUser?.uid ?? "");
}

export default function SignInScreen() {
	return (
		<Center>
			<StyledFirebaseAuth uiConfig={SIGN_IN_CONFIG} firebaseAuth={firebase.auth()} />
		</Center>
	);
}
