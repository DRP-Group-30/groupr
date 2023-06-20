import { DocumentData, DocumentReference, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { getCurrentUser, getCurrentUserRef } from "./auth";
import { Project, User } from "../../backend";
import { and, inlineLogPre, zipWith } from "../../util";
import {
	Center,
	LinkBox,
	LinkOverlay,
	Stack,
	Tag,
	TagLabel,
	TagLeftIcon,
	Text,
	useToast,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export const listsOfDocRefsEq = (l1: DocumentReference[], l2: DocumentReference[]) =>
	and(zipWith(l1, l2, (r1, r2) => r1.id === r2.id));

const Notifications = () => {
	const toast = useToast();
	const userRef = useRef<User["fields"]>();
	const docMatchesRef = useRef<Map<string, DocumentReference[]>>();

	const subscribeProject = (p: DocumentReference<DocumentData>) =>
		onSnapshot(p, n => {
			const docMatches = docMatchesRef.current ?? null;
			if (docMatches === null) return; // To early
			const prev = docMatches.get(p.id);
			const newMatched = (n.data() as Project["fields"]).irm.matched;
			docMatches.set(p.id, newMatched);
			// Not sure how useRef works internally, this might not be necessary
			docMatchesRef.current = docMatches;
			if (prev === undefined) return;
			const actuallyNew = newMatched.filter(r => !prev.map(r2 => r2.id).includes(r.id));
			if (actuallyNew.length === 0) return;
			console.log(actuallyNew);
			toast({
				render: () => (
					<Center>
						<LinkBox>
							<LinkOverlay href="dashboard"></LinkOverlay>
							<Tag colorScheme="green" size="lg" variant="solid">
								<TagLeftIcon as={CheckCircleIcon}></TagLeftIcon>
								<TagLabel padding="12px">
									<Stack spacing="0">
										<Text as="b">Match!</Text>
										<Text>Someone joined your project.</Text>
									</Stack>
								</TagLabel>
							</Tag>
						</LinkBox>
					</Center>
				),
				duration: 2000,
				isClosable: true,
			});
			console.log("M");
			console.log(prev);
			console.log(newMatched);
			console.log(actuallyNew);
		});

	const initUserAndDocs = async () => {
		const u = (await getCurrentUser()).data() as User["fields"];
		console.log("The current user is");
		console.log(u);
		userRef.current = u;
		console.log("SET THE USER!!!!");
		const cursed: [string, DocumentReference<DocumentData>[]][] = (
			await Promise.all(
				u.ownProjects.map(p => {
					subscribeProject(p);
					return getDoc(p).then(pp => [p.id, pp.data()] as [string, Project["fields"]]);
				}),
			)
		).map(([id, p]) => [id, p.irm.matched] as [string, DocumentReference[]]);
		docMatchesRef.current = new Map(cursed);
	};

	useEffect(() => {
		initUserAndDocs();
		onSnapshot(getCurrentUserRef(), snapshot => {
			console.log("ALLEGEDLY A MATCH!!");
			console.log(userRef.current);
			console.log(snapshot);
			const user = userRef.current ?? null;
			if (user === null) return; // Something went wrong!

			console.log("HMMMMMMMM");
			const newu = snapshot.data() as User["fields"];

			newu.ownProjects
				.filter(r => user.ownProjects.map(r2 => r2.id).includes(r.id))
				.forEach(r => subscribeProject(r));
			const actuallyNew = newu.irm.matched.filter(
				r => !user.irm.matched.map(r2 => r2.id).includes(r.id),
			);
			if (actuallyNew.length !== 0) {
				console.log(actuallyNew);
				toast({
					render: () => (
						<Center>
							<LinkBox>
								<LinkOverlay href="dashboard"></LinkOverlay>
								<Tag colorScheme="green" size="lg" variant="solid">
									<TagLeftIcon as={CheckCircleIcon}></TagLeftIcon>
									<TagLabel padding="12px">
										<Stack spacing="0">
											<Text as="b">Match!</Text>
											<Text>You joined a project!</Text>
										</Stack>
									</TagLabel>
								</Tag>
							</LinkBox>
						</Center>
					),
					duration: 2000,
					isClosable: true,
				});
			}
			userRef.current = newu;
		});
	}, []);
	return <></>;
};

export default Notifications;
