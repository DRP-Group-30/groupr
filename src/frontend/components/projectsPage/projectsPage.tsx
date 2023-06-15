import { Box, Container, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import NewProjectCard from "./newProjectCard";
import { DocumentReference, getDocs, collection, getDoc } from "firebase/firestore";
import { Firebase } from "../../../backend/firebase";
import { useEffect, useState } from "react";
import { Project } from "../../../backend";

const ProjectSelector = () => {
	let [projectRefs, setProjectRefs] = useState<DocumentReference[]>([]);
	let [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		pollProjects().then(getProjects);
	}, []);

	async function pollProjects() {
		const ds = await getDocs(collection(Firebase.db, "projects"));
		setProjectRefs((projectRefs = ds.docs.map(d => d.ref)));
	}

	async function getProjects() {
		let snaps = await Promise.all(projectRefs.map((ref: DocumentReference) => getDoc(ref)));
		setProjects((projects = snaps.map(doc => ({ id: doc.id, fields: doc.data() } as Project))));
	}

	return (
		<Container
			maxW="100%"
			w="98%"
			overflowY="initial"
			marginTop="10pt"
			centerContent
			backgroundColor="gray.100"
			borderRadius="xl"
		>
			<Heading margin="16px">{"Your Projects"}</Heading>
			<SimpleGrid width="100%" columns={3} spacing={8} p="10pt">
				{projects.map(p => (
					<Box>{p.fields.name}</Box>
				))}
				<NewProjectCard />
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
