import React, { useContext, useEffect, useState } from "react";
import { Firebase } from "../backend/firebase";
import firebase from "firebase/compat/app";

interface AuthConfig {
	currentUser: firebase.User | null;
	signupWithEmailAndPassword: (
		email: string,
		password: string,
	) => Promise<firebase.auth.UserCredential>;
	loginWithEmailAndPassword: (
		email: string,
		password: string,
	) => Promise<firebase.auth.UserCredential>;
	logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthConfig | undefined>(undefined);

export function useAuth() {
	const authContext = useContext(AuthContext);
	if (!authContext) throw new Error("No AuthContext.Provider found when calling useAuth.");
	return authContext;
}

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
	const [loading, setLoading] = useState(true);

	const value = {
		currentUser,
		signupWithEmailAndPassword,
		loginWithEmailAndPassword,
		logout,
	};

	function signupWithEmailAndPassword(email: string, password: string) {
		return Firebase.auth.createUserWithEmailAndPassword(email, password);
	}

	function loginWithEmailAndPassword(email: string, password: string) {
		return Firebase.auth.signInWithEmailAndPassword(email, password);
	}

	function logout() {
		return Firebase.auth.signOut();
	}

	useEffect(() => {
		const unsubscribe = Firebase.auth.onAuthStateChanged(user => {
			console.log(JSON.stringify(user));
			setCurrentUser(user);
			setLoading(false);
		});
		return unsubscribe;
	}, []);

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
