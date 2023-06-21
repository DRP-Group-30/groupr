import { CheckCircleIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Project, User, getProjectDocRef, getUserDocRef } from "../../../backend";
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
import { inlineLog } from "../../../util";
import { useParams } from "react-router-dom";

const Dashboard2 = () => {
	const { projectID } = useParams();
	const [showMatched, setShowMatched] = useState<boolean>(true);
	let [matched, setMatched] = useState<User[]>([]);
	let [interested, setInterested] = useState<User[]>([]);
	let [rejected, setRejected] = useState<User[]>([]);
	let [draggedProject, setDraggedProject] = useState<User | null>(null);

	useEffect(() => {
		getProjects();
	}, []);

	async function getProjects() {
		const projectSnapshot = await getDoc(getProjectDocRef(projectID ?? ""));
		const project: Project["fields"] = projectSnapshot.data() as Project["fields"];
		let matchedRefs = project.irm.matched;
		let matchedDocs = await Promise.all(
			matchedRefs.map((ref: DocumentReference) => getDoc(ref)),
		);
		setMatched(
			(matched = matchedDocs.map(
				doc => ({ id: doc.id, fields: inlineLog(doc.data()) } as User),
			)),
		);

		let interestedRefs = project.irm.interested;
		let interestedDocs = await Promise.all(interestedRefs.map(getDoc));
		setInterested(
			(interested = interestedDocs.map(
				doc =>
					({
						id: doc.id,
						fields: doc.data(),
					} as User),
			)),
		);
		interested.forEach(project => {
			if (project.fields.irm.interested.map(ref => ref.id).includes(projectID ?? "")) {
				moveProjectInto("interested", project);
			}
		});

		let rejectedRefs = project.irm.rejected;
		let rejectedDocs = await Promise.all(
			rejectedRefs.map((ref: DocumentReference) => getDoc(ref)),
		);
		setRejected(
			(rejected = rejectedDocs.map(
				doc =>
					({
						id: doc.id,
						fields: doc.data(),
					} as User),
			)),
		);
	}

	function moveProjectInto(col: string, user?: User | null) {
		if (user === undefined) user = null;
		if (draggedProject === null) draggedProject = user;
		if (draggedProject === null) return;

		setMatched((matched = matched.filter(p => p !== draggedProject)));
		setInterested((interested = interested.filter(p => p !== draggedProject)));
		setRejected((rejected = rejected.filter(p => p !== draggedProject)));

		draggedProject.fields.irm.matched = draggedProject.fields.irm.matched.filter(
			ref => ref.id !== projectID,
		);
		setDraggedProject(draggedProject);

		if (col.toLowerCase() === "interested") {
			console.log(draggedProject.fields.irm.interested);
			if (draggedProject.fields.irm.interested.map(ref => ref.id).includes(projectID ?? "")) {
				matched.push(draggedProject);
				setMatched(matched);
				draggedProject.fields.irm.interested = draggedProject.fields.irm.interested.filter(
					ref => ref.id !== projectID,
				);
				draggedProject.fields.irm.matched.push(getProjectDocRef(projectID ?? ""));
				setDraggedProject(draggedProject);
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

		updateDoc(getProjectDocRef(projectID ?? ""), {
			irm: {
				matched: matched.map(p => doc(Firebase.db, "users", p.id)),
				interested: interested.map(p => doc(Firebase.db, "users", p.id)),
				rejected: rejected.map(p => doc(Firebase.db, "users", p.id)),
			},
		});

		updateDoc(doc(Firebase.db, "users", draggedProject.id), {
			irm: draggedProject.fields.irm,
		});
	}

	return (
		<Sidebar
			sideElem={
				<DashboardSidebar
					showMatched={showMatched}
					setShowMatched={setShowMatched}
				></DashboardSidebar>
			}
			mainElem={
				<Flex p="15" w="100%" h="100%" justifyContent="space-evenly">
					{showMatched ? (
						<DashboardList
							heading={CardStatus.MATCHED}
							children={matched}
							moveInto={moveProjectInto}
						></DashboardList>
					) : (
						<Flex
							width="100%"
							gap={8}
							justifyContent="space-evenly"
							alignItems="center"
						>
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
						</Flex>
					)}
					{/* <DashboardList heading="Interested" children={["Test","Test","Test","Test"]}></DashboardList> */}
				</Flex>
			}
		></Sidebar>
	);
};

export default Dashboard2;
