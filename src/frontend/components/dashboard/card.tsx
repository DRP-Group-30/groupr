import {
	Heading,
	Card,
	Flex,
	Text,
	Link,
	Image,
	Button,
	Stack,
	CardBody,
	CardFooter,
	Tag,
	Box,
} from "@chakra-ui/react";
import { Dispatch, DragEvent, SetStateAction, useEffect, useState } from "react";
import { MdClose, MdDone } from "react-icons/md";
import { CardStatus } from "./types";
import { Project } from "../../../backend";
import React from "react";
import { getImg } from "../../../util/firebase";
import { map, swapPromiseNull } from "../../../util";
import { useAsync } from "../../../util/react";

const PROMPTS: Map<CardStatus, string> = new Map([
	[CardStatus.INTERESTED, "Revoke Interest"],
	[CardStatus.REJECTED, "Express Interest"],
	[CardStatus.MATCHED, "Unmatch"],
]);

export type cardProps = {
	project: Project;
	status: CardStatus;
	moveInto: (status: CardStatus, project?: Project) => void;
	setDragged: Dispatch<SetStateAction<Project | null>>;
};

function DBCard({ project, status, moveInto, setDragged }: cardProps) {
	const coverImageURL = useAsync<string | null>(() =>
		swapPromiseNull(map(project.fields.coverImage, getImg)),
	);

	function dragStart(e: DragEvent<HTMLDivElement>) {
		setDragged(project);
	}

	function moveProject() {
		moveInto(
			status === CardStatus.REJECTED ? CardStatus.INTERESTED : CardStatus.REJECTED,
			project,
		);
	}

	return (
		<Card
			direction={{ base: "column", sm: "row" }}
			boxShadow={"xl"}
			draggable={status !== CardStatus.MATCHED}
			onDragStart={dragStart}
			width="100%"
		>
			<Image
				roundedLeft="md"
				objectFit="cover"
				maxW={{ base: "100%", sm: "200px" }}
				src={coverImageURL ?? ""}
				alt="Project Cover Image"
			/>

			<Stack width="100%">
				<CardBody>
					<Heading size="md">{project.fields.name}</Heading>

					<Text py="2">{project.fields.overview}</Text>

					{status === "Matched" && (
						<Box backgroundColor="gray.100" borderRadius="md" padding="8px">
							<Text>Because you're interested in</Text>
							<Flex flexWrap="wrap">
								{project.fields.tags.map(tag => (
									<Tag variant="solid" colorScheme="teal" margin="2px">
										{tag}
									</Tag>
								))}
							</Flex>
						</Box>
					)}
				</CardBody>

				<CardFooter>
					<Flex width="100%" justifyContent="space-between" alignItems="center">
						{status === CardStatus.MATCHED ? (
							<Link
								href={`mailto:${project.fields.contactInfo}`}
								textDecoration="underline"
							>
								{project.fields.contactInfo}
							</Link>
						) : (
							<div></div>
						)}
						<Button
							colorScheme="groupr"
							rightIcon={status === CardStatus.REJECTED ? <MdDone /> : <MdClose />}
							size="sm"
							aria-label={""}
							onClick={moveProject}
						>
							{PROMPTS.get(status)}
						</Button>
					</Flex>
				</CardFooter>
			</Stack>
		</Card>
	);
}

export default DBCard;
