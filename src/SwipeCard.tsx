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
import { Project } from "./Backend";

interface SwipeCardProps {
	offset: number;
	setOffset: Dispatch<SetStateAction<number>>;
	dragging: boolean;
	setDragging: Dispatch<SetStateAction<boolean>>;
	cardAnchor: number;
	acceptCard: () => void;
	rejectCard: () => void;
	data: Project["fields"];
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
				onMouseDown={e => dragStart(e)}
				onMouseUp={e => dragEnd(e, true)}
				onMouseMove={e => dragMove(e)}
				onMouseLeave={e => dragEnd(e, false)}
				style={{
					transform: `translate(${offset}px, 0) rotate(${offset / 20}deg)`,
					userSelect: "none",
				}}
			>
				<Box h={"210px"} bg={"gray.100"} mt={-6} mx={-6} mb={6} pos={"relative"}>
					<Image
						src={`https://picsum.photos/seed/${data.name}/800`}
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
