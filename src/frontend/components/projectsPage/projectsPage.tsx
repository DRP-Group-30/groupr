import { Box, Container, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import NewProjectCard from "./newProjectCard";
import { DocumentReference, getDocs, collection, getDoc } from "firebase/firestore";
import { Firebase } from "../../../backend/firebase";
import { useEffect, useState } from "react";
import { Project, User } from "../../../backend";
import CreatorCard from "../project_creator/creator_card";
import { getCurrentUser } from "../auth";

const ProjectSelector = () => {
	let [projectRefs, setProjectRefs] = useState<DocumentReference[]>([]);
	let [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		pollProjects().then(getProjects);
	}, []);

	async function pollProjects() {
		const userSnapshot = await getCurrentUser();

		const user: User["fields"] = userSnapshot.data() as User["fields"];
		const projects = user.ownProjects;
		setProjectRefs((projectRefs = projects));
	}

	async function getProjects() {
		const snaps = await Promise.all(projectRefs.map((ref: DocumentReference) => getDoc(ref)));
		setProjects((projects = snaps.map(doc => ({ id: doc.id, fields: doc.data() } as Project))));
	}

	return (
		<Container
			maxW="100%"
			w="98%"
			height="calc(100% - 64px - 20pt)"
			overflowY="scroll"
			marginTop="10pt"
			marginBottom="10pt"
			centerContent
			backgroundColor="gray.100"
			borderRadius="xl"
		>
			<Heading margin="16px">{"Your Projects"}</Heading>
			<SimpleGrid width="100%" columns={3} spacing={8} p="10pt">
				<NewProjectCard />
				{projects.map(p => (
					<CreatorCard editMode={false} project={p}></CreatorCard>
				))}
			</SimpleGrid>
		</Container>
	);
};

const ProjectPage = () => {
	return (
		<ProjectSelector></ProjectSelector>
		// <Sidebar sideElem={<Text>test</Text>} mainElem={} />
	);
};

export default ProjectPage;
