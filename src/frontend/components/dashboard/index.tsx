import { CheckCircleIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Project, User } from "../../../backend";
import { DocumentReference, doc, getDoc, updateDoc } from "firebase/firestore";
import { DEFAULT_USER } from "../finder";
import { Firebase } from "../../../backend/firebase";

import {
	Flex,
	Text,
	Center,
	Stack,
	useToast,
	Tag,
	TagLeftIcon,
	TagLabel,
	LinkBox,
	LinkOverlay,
} from "@chakra-ui/react";
import Sidebar from "../sidebar";

import DashboardColumn from "./column";
import DashboardList from "./list";
import DashboardSidebar from "./sidebar";
import { CardStatus } from "./types";
import React from "react";
import { getCurrentUser, getCurrentUserRef } from "../auth";
import { get } from "http";
import { useAuth } from "../../../context/AuthContext";

const Dashboard = () => {
	const toast = useToast();
	const [showMatched, setShowMatched] = useState<boolean>(true);
	let [matched, setMatched] = useState<Project[]>([]);
	let [interested, setInterested] = useState<Project[]>([]);
	let [rejected, setRejected] = useState<Project[]>([]);
	let [draggedProject, setDraggedProject] = useState<Project | null>(null);
	const { currentUser } = useAuth();

	useEffect(() => {
		getProjects();
	}, []);

	async function getProjects() {
		const userSnapshot = await getCurrentUser();
		const user: User["fields"] = userSnapshot.data() as User["fields"];
		let matchedRefs = user.irm.matched;
		let matchedDocs = await Promise.all(
			matchedRefs.map((ref: DocumentReference) => getDoc(ref)),
		);
		setMatched(
			(matched = matchedDocs.map(doc => ({ id: doc.id, fields: doc.data() } as Project))),
		);

		let interestedRefs = user.irm.interested;
		let interestedDocs = await Promise.all(interestedRefs.map(getDoc));
		setInterested(
			(interested = interestedDocs.map(
				doc =>
					({
						id: doc.id,
						fields: doc.data(),
					} as Project),
			)),
		);
		interested.forEach(project => {
			if (project.fields.irm.interested.map(ref => ref.id).includes(currentUser?.uid ?? "")) {
				moveProjectInto("interested", project);
			}
		});

		let rejectedRefs = user.irm.rejected;
		let rejectedDocs = await Promise.all(
			rejectedRefs.map((ref: DocumentReference) => getDoc(ref)),
		);
		setRejected(
			(rejected = rejectedDocs.map(
				doc =>
					({
						id: doc.id,
						fields: doc.data(),
					} as Project),
			)),
		);
	}

	function moveProjectInto(col: string, project?: Project | null) {
		if (project === undefined) project = null;
		if (draggedProject === null) draggedProject = project;
		if (draggedProject === null) return;

		setMatched((matched = matched.filter(p => p !== draggedProject)));
		setInterested((interested = interested.filter(p => p !== draggedProject)));
		setRejected((rejected = rejected.filter(p => p !== draggedProject)));

		if (col.toLowerCase() === "interested") {
			if (
				draggedProject.fields.irm.interested
					.map(ref => ref.id)
					.includes(currentUser?.uid ?? "")
			) {
				matched.push(draggedProject);
				setMatched(matched);
				toast({
					render: () => (
						<Center>
							<LinkBox>
								<LinkOverlay href="dashboard"></LinkOverlay>
								<Tag colorScheme="green" size="lg" variant="solid">
									<TagLeftIcon as={CheckCircleIcon}></TagLeftIcon>
									<TagLabel padding="12px">
										<Stack spacing="0">
											<Text as="b">Matched project!</Text>
											<Text>See your matches in the Dashboard.</Text>
										</Stack>
									</TagLabel>
								</Tag>
							</LinkBox>
						</Center>
					),
					duration: 2000,
					isClosable: true,
				});
			} else {
				interested.push(draggedProject);
				setInterested(interested);
			}
			setDraggedProject(null);
		} else if (col.toLowerCase() === "rejected") {
			rejected.push(draggedProject);
			setRejected(rejected);
			setDraggedProject(null);
		}

		updateDoc(getCurrentUserRef(), {
			matched: matched.map(p => doc(Firebase.db, "projects", p.id)),
			interested: interested.map(p => doc(Firebase.db, "projects", p.id)),
			rejected: rejected.map(p => doc(Firebase.db, "projects", p.id)),
		});
	}

	return (
		<Sidebar
			sideElem={<DashboardSidebar setShowMatched={setShowMatched}></DashboardSidebar>}
			mainElem={
				<Flex p="15" w="100%" h="100%" justifyContent="space-evenly">
					{showMatched ? (
						<DashboardList
							heading={CardStatus.MATCHED}
							children={matched}
							moveInto={moveProjectInto}
						></DashboardList>
					) : (
						<>
							<DashboardColumn
								heading={CardStatus.INTERESTED}
								children={interested}
								moveProject={moveProjectInto}
								setDragged={setDraggedProject}
							></DashboardColumn>
							<DashboardColumn
								heading={CardStatus.REJECTED}
								children={rejected}
								moveProject={moveProjectInto}
								setDragged={setDraggedProject}
							></DashboardColumn>
						</>
					)}
					{/* <DashboardList heading="Interested" children={["Test","Test","Test","Test"]}></DashboardList> */}
				</Flex>
			}
		></Sidebar>
	);
};

export default Dashboard;
