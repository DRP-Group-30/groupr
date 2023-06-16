import { Flex } from "@chakra-ui/layout";
import CreatorCard from "./creator_card";
import { useParams } from "react-router-dom";
import { Project } from "../../../backend";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Firebase } from "../../../backend/firebase";

const ProjectEditor = ({ isNew }: { isNew: boolean }) => {
	const { projectID } = useParams();
	let [project, setProject] = useState<Project | null>(null);

	useEffect(() => {
		if (!isNew && projectID != null) {
			console.log("EDITING A PROJECT");
			getDoc(doc(Firebase.db, "projects", projectID)).then(doc => {
				setProject(
					(project = {
						id: doc.id,
						fields: doc.data(),
					} as Project),
				);
			});
		}
	}, []);

	return (
		<Flex bg="white" align="center" justify="center" h="100%" paddingTop="50px">
			<CreatorCard editMode project={project}></CreatorCard>
		</Flex>
	);
};

export default ProjectEditor;
