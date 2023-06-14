import { Center } from "@chakra-ui/react";
import firebase from "firebase/compat/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { DEFAULT_USER } from "./finder";
import firebaseui from "firebaseui";
import React from "react";

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
	return DEFAULT_USER;
}

export default function SignInScreen() {
	return (
		<Center>
			<StyledFirebaseAuth uiConfig={SIGN_IN_CONFIG} firebaseAuth={firebase.auth()} />
		</Center>
	);
}
