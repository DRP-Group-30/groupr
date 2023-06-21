import { Heading, VStack, Text, Center, Flex } from "@chakra-ui/react";
import DashboardCard from "./card";
import { Dispatch, DragEvent, SetStateAction } from "react";
import { Project } from "../../../backend";
import { CardStatus } from "./types";
import React from "react";

export type columnProps = {
	heading: CardStatus;
	children: Project[];
	moveProject: (col: string) => void;
	setDragged: Dispatch<SetStateAction<Project | null>>;
};

const DBColumn = ({ heading, children, moveProject, setDragged }: columnProps) => {
	function dragOver(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
	}

	function drop(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
		moveProject(heading);
	}

	return (
		<Flex
			className="GlassMorphic"
			flexDirection="column"
			alignItems="center"
			h="100%"
			w="45%"
			p={4}
			overflowY="auto"
			borderRadius="lg"
			onDragOver={dragOver}
			onDrop={drop}
			color="groupr.700"
			flexGrow="1"
		>
			<Heading mt="32px" mb="16px">
				{heading}
			</Heading>
			<VStack h="100%" w="100%" spacing={5} scrollMarginBottom="100px">
				{children.length > 0 ? (
					children.map(project => (
						<DashboardCard
							key={project.id}
							status={heading}
							project={project}
							moveInto={moveProject}
							setDragged={setDragged}
						></DashboardCard>
					))
				) : (
					<Center w="100%" h="100%">
						<Text fontSize="xl" textAlign="center">
							Nothing yet!<br></br> Projects you{" "}
							{heading === "Rejected" ? "reject" : "accept"} will show up here.
						</Text>
					</Center>
				)}
			</VStack>
		</Flex>
	);
};

export default DBColumn;
