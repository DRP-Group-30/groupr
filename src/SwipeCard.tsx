import {
  Image,
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { MouseEvent, Dispatch, SetStateAction } from "react";
import { Project } from "./Finder";

interface SwipeCardProps {
	offset: number;
	setOffset: Dispatch<SetStateAction<number>>;
	dragging: boolean;
	setDragging: Dispatch<SetStateAction<boolean>>;
	cardAnchor: number;
	acceptCard: () => void;
	rejectCard: () => void;
	data: Project;
	cardHidden: boolean;
}

const SwipeCard = ({
	offset,
	setOffset,
	dragging,
	setDragging,
	cardAnchor,
	acceptCard,
	rejectCard,
	data,
	cardHidden,
}: SwipeCardProps) => {
	function dragStart(ev: MouseEvent<HTMLDivElement>) {
		setDragging(true);
		setOffset(ev.pageX - cardAnchor);
	}

	function dragEnd(ev: MouseEvent<HTMLDivElement>) {
		setDragging(false);

		if (Math.abs(offset) >= 300) {
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

	function dragMove(ev: MouseEvent<HTMLDivElement>) {
		if (!dragging) return;

		setOffset(ev.pageX - cardAnchor);
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
				onMouseUp={dragEnd}
				onMouseMove={dragMove}
				onMouseLeave={dragEnd}
				style={{
					transform: `translate(${offset}px, 0) rotate(${offset / 20}deg)`,
					userSelect: "none",
				}}
			>
				<Box h={"210px"} bg={"gray.100"} mt={-6} mx={-6} mb={6} pos={"relative"}>
					<Image
						src={
							"https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
						}
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
						{data.name}
					</Heading>
					<Text color={"gray.500"}>{data.overview}</Text>
				</Stack>
				<Stack mt={6} direction={"row"} spacing={4} align={"center"}>
					<Avatar src={"https://avatars0.githubusercontent.com/u/1164541?v=4"} />
					<Stack direction={"column"} spacing={0} fontSize={"sm"}>
						<Text fontWeight={600}>Achim Rolle</Text>
						<Text color={"gray.500"}>Feb 08, 2021 · 6min read</Text>
					</Stack>
				</Stack>
			</Box>
		</Center>
	);
};

export default SwipeCard;
