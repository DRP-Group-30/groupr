import { Container, Heading, Text, Center, SimpleGrid } from "@chakra-ui/react";
import DashboardCard from "./card";
import { Project } from "../../../backend";
import { CardStatus } from "./types";
import NewProjectCard from "../projectsPage/newProjectCard";

export type listProps = {
	heading: CardStatus | string;
	children: Project[];
	moveInto: (col: string, project?: Project) => void;
	hasAddNewProject?: boolean;
};

const DBList = ({ heading, children, moveInto, hasAddNewProject = false }: listProps) => {
	return (
		<Container
			maxW="100%"
			maxH=""
			overflowY="auto"
			centerContent
			backgroundColor="gray.100"
			borderRadius="xl"
		>
			<Heading margin="16px">{heading}</Heading>
			<SimpleGrid
				width="100%"
				columns={children.length > 0 || hasAddNewProject ? 2 : 1}
				spacing={8}
				p="10pt"
			>
				{children.length > 0 ? (
					children.map(project => (
						<DashboardCard
							key={project.id}
							project={project}
							status={CardStatus.MATCHED}
							moveInto={moveInto}
							setDragged={() => {}}
						></DashboardCard>
					))
				) : hasAddNewProject ? (
					<NewProjectCard></NewProjectCard>
				) : (
					<Center>
						<Text fontSize="lg">Nothing here for now!</Text>
					</Center>
				)}
			</SimpleGrid>
		</Container>
	);
};

export default DBList;
