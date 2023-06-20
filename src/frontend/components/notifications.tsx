import { DocumentData, DocumentReference, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getCurrentUser, getCurrentUserRef } from "./auth";
import { Project, User } from "../../backend";
import { and, inlineLogPre, zipWith } from "../../util";

export const listsOfDocRefsEq = (l1: DocumentReference[], l2: DocumentReference[]) =>
	and(zipWith(l1, l2, (r1, r2) => r1.id === r2.id));

const Notifications = () => {
	const [user, setUser] = useState<User["fields"] | null>(null);
	const [docMatches, setDocMatches] = useState<Map<string, DocumentReference[]>>(new Map());

	const subscribeProject = (p: DocumentReference<DocumentData>) =>
		onSnapshot(p, n => {
			const prev = docMatches.get(p.id);
			const newMatched = (n.data() as Project["fields"]).irm.matched;
			docMatches.set(p.id, newMatched);
			setDocMatches(docMatches);
			if (prev === undefined) return;
			const actuallyNew = newMatched.filter(r => prev.map(r2 => r2.id).includes(r.id));
			if (actuallyNew.length === 0) return;
			alert("MATCH ALTERT!!!!");
		});

	const initUserAndDocs = async () => {
		const u = (await getCurrentUser()).data() as User["fields"];
		setUser(u);
		const cursed: [string, DocumentReference<DocumentData>[]][] = (
			await Promise.all(
				u.ownProjects.map(p => {
					subscribeProject(p);
					return getDoc(p).then(pp => [p.id, pp.data()] as [string, Project["fields"]]);
				}),
			)
		).map(([id, p]) => [id, p.irm.matched] as [string, DocumentReference[]]);

		setDocMatches(new Map(cursed));
	};

	useEffect(() => {
		initUserAndDocs();
		onSnapshot(getCurrentUserRef(), snapshot => {
			if (user === null) return; // Something went wrong!
			const newu = snapshot.data() as User["fields"];
			setUser(newu);
			newu.ownProjects
				.filter(r => user.ownProjects.map(r2 => r2.id).includes(r.id))
				.forEach(r => subscribeProject(r));
			const actuallyNew = newu.irm.matched.filter(r =>
				user.irm.matched.map(r2 => r2.id).includes(r.id),
			);
			if (actuallyNew.length === 0) return;
			alert("MATCH ALTERT!!!!");
		});
	}, []);
	return <></>;
};

export default Notifications;
