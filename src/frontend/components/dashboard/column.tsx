import { Container, Heading, VStack, Text } from "@chakra-ui/react";
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
		<Container
			h="100%"
			overflowY="auto"
			bgColor="gray.100"
			borderRadius="lg"
			centerContent
			onDragOver={dragOver}
			onDrop={drop}
		>
			<Heading m="16px">{heading}</Heading>
			<VStack h="100%" spacing={5}>
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
					<Text fontSize="lg">
						Nothing yet! Projects you {heading === "Rejected" ? "reject" : "accept"}{" "}
						will show up here.
					</Text>
				)}
			</VStack>
		</Container>
	);
};

export default DBColumn;
