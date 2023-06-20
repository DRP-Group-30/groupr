import { Container, Heading, VStack, Text, Center } from "@chakra-ui/react";
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
			className="GlassMorphic"
			h="100%"
			w="100%"
			overflowY="auto"
			borderRadius="lg"
			centerContent
			onDragOver={dragOver}
			onDrop={drop}
			color="groupr.700"
		>
			<Heading mt="32px">{heading}</Heading>
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
					<Center height="100%">
						<Text fontSize="lg" textAlign="center">
							Nothing yet!<br></br> Projects you{" "}
							{heading === "Rejected" ? "reject" : "accept"} will show up here.
						</Text>
					</Center>
				)}
			</VStack>
		</Container>
	);
};

export default DBColumn;
