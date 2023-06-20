import {
	Image,
	Box,
	Center,
	Heading,
	Text,
	Stack,
	useColorModeValue,
	Flex,
	Tag,
} from "@chakra-ui/react";
import { MouseEvent, Dispatch, SetStateAction } from "react";
import { Project, ProjectOrUser, ProjectOrUserData, User, discriminate } from "../../backend";
import React from "react";
import { useAsync } from "../../util/react";
import { inlineLog, map, swapPromiseNull } from "../../util";
import { getImg } from "../../util/firebase";

interface SwipeCardProps<T extends ProjectOrUser> {
	offset: number;
	setOffset: Dispatch<SetStateAction<number>>;
	dragging: boolean;
	setDragging: Dispatch<SetStateAction<boolean>>;
	cardAnchor: number;
	acceptCard: () => void;
	rejectCard: () => void;
	data: ProjectOrUserData<T>;
	cardHidden: boolean;
	coverImgURL: string | null;
}

const SwipeCard = <T extends ProjectOrUser>({
	offset,
	setOffset,
	dragging,
	setDragging,
	cardAnchor,
	acceptCard,
	rejectCard,
	data,
	cardHidden,
	coverImgURL,
}: SwipeCardProps<T>) => {
	function dragStart(e: MouseEvent<HTMLDivElement>) {
		e.preventDefault();
		setDragging(true);
		setOffset(e.pageX - cardAnchor);
	}

	function dragEnd(e: MouseEvent<HTMLDivElement>, released: boolean) {
		e.preventDefault();
		setDragging(false);

		if (released && Math.abs(offset) >= 300) {
			if (offset > 0) {
				acceptCard();
			} else {
				rejectCard();
			}
			// In an ideal world, we would have the card that flies up be a separate
			// card, given the same state as the current one
			// nextCard();
		} else {
			setOffset(0);
		}
	}

	function dragMove(e: MouseEvent<HTMLDivElement>) {
		e.preventDefault();
		if (!dragging) return;

		setOffset(e.pageX - cardAnchor);
	}

	return (
		<Center py={6}>
			<Box
				maxW={"445px"}
				w={"full"}
				bg={useColorModeValue("white", "gray.900")}
				boxShadow={"2xl"}
				rounded={"md"}
				border={Math.abs(offset) >= 300 ? "4px" : "0px"}
				borderColor={offset >= 300 ? "green" : offset <= -300 ? "red" : "transparent"}
				opacity={cardHidden ? "0%" : "100%"}
				p={6}
				overflow={"hidden"}
				className={`${dragging ? "" : "Released"}`}
				onMouseDown={dragStart}
				onMouseUp={e => dragEnd(e, true)}
				onMouseMove={dragMove}
				onMouseLeave={e => dragEnd(e, false)}
				style={{
					transform: `translate(${offset}px, 0) rotate(${offset / 20}deg)`,
					userSelect: "none",
				}}
			>
				<Box h={"210px"} bg={"gray.100"} mt={-6} mx={-6} mb={6} pos={"relative"}>
					<Image
						src={coverImgURL ?? ""}
						boxSize="100%"
						objectFit="fill"
						draggable="false"
					/>
				</Box>
				<Stack>
					<Text
						color={"green.500"}
						textTransform={"uppercase"}
						fontWeight={800}
						fontSize={"sm"}
						letterSpacing={1.1}
					>
						Developer
					</Text>
					<Heading
						color={useColorModeValue("gray.700", "white")}
						fontSize={"2xl"}
						fontFamily={"body"}
					>
						{dName(data)}
					</Heading>
					<Text color={"gray.500"}>{dOverview(data)}</Text>
				</Stack>

				<Box backgroundColor="gray.100" borderRadius="md" padding="16px" marginTop="16px">
					<Text>Because you're interested in</Text>
					<Flex flexWrap="wrap">
						{dTagSkills(data).map(tag => (
							<Tag variant="solid" key={tag} colorScheme="teal" margin="2px">
								{tag}
							</Tag>
						))}
					</Flex>
				</Box>
			</Box>
		</Center>
	);
};

const dName = <T extends ProjectOrUser>(x: ProjectOrUserData<T>) =>
	discriminate(
		x,
		p => p.name,
		u => u.firstName + " " + u.lastName,
	);

const dTagSkills = <T extends ProjectOrUser>(x: ProjectOrUserData<T>) =>
	discriminate(
		x,
		p => p.tags,
		u => u.skills,
	);

const dOverview = <T extends ProjectOrUser>(x: ProjectOrUserData<T>) =>
	discriminate(
		x,
		p => p.overview,
		u => u.bio,
	);

export default SwipeCard;
