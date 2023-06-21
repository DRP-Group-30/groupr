import { Container, Heading, Text, Center, SimpleGrid, Button, VStack } from "@chakra-ui/react";
import DashboardCard from "./card";
import { Project, User } from "../../../backend";
import { CardStatus } from "./types";
import React from "react";
import NewProjectCard from "../projectsPage/newProjectCard";
import { useNavigate } from "react-router-dom";

export type listProps = {
	heading: CardStatus | string;
	children: User[];
	moveInto: (col: string, project?: User) => void;
	hasAddNewProject?: boolean;
};

const DBList = ({ heading, children, moveInto, hasAddNewProject = false }: listProps) => {
	return (
		<Container
			className="GlassMorphic"
			maxW="100%"
			overflowY="auto"
			centerContent
			borderRadius="xl"
			color="groupr.700"
			p={4}
		>
			<Heading mt="32px" mb="16px">
				{heading}
			</Heading>
			<SimpleGrid
				width="100%"
				height={children.length > 0 || hasAddNewProject ? undefined : "100%"}
				columns={children.length > 0 || hasAddNewProject ? 2 : 1}
				spacing={8}
				p="10pt"
			>
				{children.length > 0 ? (
					children.map(user => (
						<DashboardCard
							key={user.id}
							user={user}
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
								Nothing yet!<br></br>Collaborators you match with will show up here.
							</Text>
						</VStack>
					</Center>
				)}
			</SimpleGrid>
		</Container>
	);
};

export default DBList;
