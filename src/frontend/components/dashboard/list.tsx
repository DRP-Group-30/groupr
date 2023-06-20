import { Container, Heading, Text, Center, SimpleGrid, Button, VStack } from "@chakra-ui/react";
import DashboardCard from "./card";
import { Project } from "../../../backend";
import { CardStatus } from "./types";
import React from "react";
import NewProjectCard from "../projectsPage/newProjectCard";
import { useNavigate } from "react-router-dom";

export type listProps = {
	heading: CardStatus | string;
	children: Project[];
	moveInto: (col: string, project?: Project) => void;
	hasAddNewProject?: boolean;
};

const DBList = ({ heading, children, moveInto, hasAddNewProject = false }: listProps) => {
	return (
		<Container
			className="GlassMorphic"
			maxW="100%"
			maxH=""
			overflowY="auto"
			centerContent
			borderRadius="xl"
			color="groupr.700"
		>
			<Heading mt="32px">{heading}</Heading>
			<SimpleGrid
				width="100%"
				height={children.length > 0 || hasAddNewProject ? undefined : "100%"}
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
					<Center height="100%">
						<VStack>
							<Text fontSize="xl" textAlign="center">
								Nothing yet!<br></br>Projects you match with will show up here.
							</Text>
						</VStack>
					</Center>
				)}
			</SimpleGrid>
		</Container>
	);
};

export default DBList;
