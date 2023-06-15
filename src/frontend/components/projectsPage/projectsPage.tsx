import { Box, Container, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import Sidebar from "../sidebar";
import DBList from "../dashboard/list";
import { Project } from "../../../backend";
import NewProjectCard from "./newProjectCard";

const projectList: Project[] = [];

const ProjectSelector = () => {
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
			<SimpleGrid
				width="100%"
				columns={3}
				spacing={8}
				p="10pt"
			>
                <NewProjectCard/>
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
