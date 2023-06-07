import { Center } from "@chakra-ui/react";
import firebase from "firebase/compat/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

// Configure FirebaseUI.
const uiConfig = {
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

const SignInScreen = () => {
	return (
		<Center>
			<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
		</Center>
	);
};

export default SignInScreen;
