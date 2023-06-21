import { Flex } from "@chakra-ui/layout";
import ProfileCard from "./profile_card";
import { useParams } from "react-router-dom";
import { Project, User } from "../../../backend";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Firebase } from "../../../backend/firebase";
import { useAuth } from "../../../context/AuthContext";

const ProfilePage = () => {
	const { userID } = useParams();
	let [profile, setProfile] = useState<User | null>(null);

	const { currentUser, logout } = useAuth();
	const isLoggedIn = !!currentUser;

	useEffect(() => {
		if (userID != null) {
			getDoc(doc(Firebase.db, "users", userID)).then(doc => {
				setProfile(
					(profile = {
						id: doc.id,
						fields: doc.data(),
					} as User),
				);
			});
		}
	}, []);

	return (
		<Flex backgroundColor="groupr.100" align="center" justify="center" h="100%">
			<ProfileCard canEdit={currentUser?.uid === userID} profile={profile}></ProfileCard>
		</Flex>
	);
};

export default ProfilePage;
