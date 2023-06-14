import { Container, Heading, Text, Center, SimpleGrid } from "@chakra-ui/react";
import DashboardCard from "./card";
import { Project } from "../../../backend";
import { CardStatus } from "./types";
import React from "react";

export type listProps = {
	heading: CardStatus;
	children: Project[];
	moveInto: (col: string, project?: Project) => void;
};

const DBList = ({ heading, children, moveInto }: listProps) => {
	return (
		<Container
			maxW="100%"
			maxH=""
			overflowY="auto"
			centerContent
			backgroundColor="gray.100"
			borderRadius="xl"
			margin="16px"
		>
			<Heading margin="16px">{heading}</Heading>
			<SimpleGrid width="100%" columns={children.length > 0 ? 2 : 1} spacing={8}>
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
