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
	Avatar,
} from "@chakra-ui/react";
import { Dispatch, DragEvent, SetStateAction, useEffect, useState } from "react";
import { MdClose, MdDone } from "react-icons/md";
import { CardStatus } from "./types";
import { Project, User } from "../../../backend";
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
	user: User;
	status: CardStatus;
	moveInto: (status: CardStatus, project?: User) => void;
	setDragged: Dispatch<SetStateAction<User | null>>;
};

function DBCard({ user, status, moveInto, setDragged }: cardProps) {
	const coverImageURL = ""; //useAsync<string | null>(() =>
	// 	swapPromiseNull(map(project.fields.coverImage, getImg)),
	// );

	function dragStart(e: DragEvent<HTMLDivElement>) {
		setDragged(user);
	}

	function moveProject() {
		moveInto(
			status === CardStatus.REJECTED ? CardStatus.INTERESTED : CardStatus.REJECTED,
			user,
		);
	}

	return (
		<Card
			direction={{ base: "column", sm: "row" }}
			boxShadow={"xl"}
			draggable={status !== CardStatus.MATCHED}
			onDragStart={dragStart}
			width="85%"
			ml={16}
			align="center"
		>
			<Avatar
				src={coverImageURL ?? ""}
				name={`${user.fields.firstName} ${user.fields.lastName}`}
				borderRadius="full"
				borderWidth="5px"
				size="2xl"
				shadow="lg"
				transform="translate(-50%)"
				mr={-16}
			/>
			<Stack width="100%">
				<CardBody>
					<Heading size="md">
						{user.fields.firstName} {user.fields.lastName}
					</Heading>

					<Text py="2">{user.fields.pronouns}</Text>

					<Text py="2">{user.fields.bio}</Text>

					{status === "Matched" && user.fields.skills.length > 0 && (
						<Box backgroundColor="gray.100" borderRadius="md" padding="8px">
							<Text>Because you're looking for</Text>
							<Flex flexWrap="wrap">
								{user.fields.skills.map(tag => (
									<Tag variant="solid" colorScheme="groupr" margin="2px">
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
							<Link href={`mailto:${user.fields.email}`} textDecoration="underline">
								{user.fields.email}
							</Link>
						) : (
							<div></div>
						)}
						{status !== CardStatus.MATCHED && (
							<Button
								colorScheme="groupr"
								rightIcon={
									status === CardStatus.REJECTED ? <MdDone /> : <MdClose />
								}
								size="sm"
								aria-label={""}
								onClick={moveProject}
							>
								{PROMPTS.get(status)}
							</Button>
						)}
					</Flex>
				</CardFooter>
			</Stack>
		</Card>
	);
}

export default DBCard;
