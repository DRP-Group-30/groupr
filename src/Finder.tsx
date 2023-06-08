import {
	DocumentReference,
	doc,
	getDoc,
	getDocs,
	collection,
	DocumentData,
	updateDoc,
} from "firebase/firestore";
import "./App.css";
import { MdDone, MdClose } from "react-icons/md";
import SwipeCard from "./SwipeCard";
import { Button, Center, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { db } from "./Firebase";
import { resetDatabase, updateField, updateFields } from "./FirebaseUtil";
import defaultDatabase from "./DefaultDatabase";
import { Project } from "./Backend";

export const DEFAULT_USER_ID = "uKSLFGA3qTuLmweXlv31";
export const DEFAULT_USER = doc(db, "users", DEFAULT_USER_ID);

const INTERESTED = "interested";
const MATCHED = "matched";
const REJECTED = "rejected";

const USER_CARD_CATEGORIES = [INTERESTED, MATCHED, REJECTED];

const Finder = () => {
	const [offset, setOffset] = useState(0);
	const [dragging, setDragging] = useState(false);
	let [sideBarWidth, setSideBarWidth] = useState(25);
	const [cardAnchor, setCardAnchor] = useState(0);
	let [cards, setCards] = useState<DocumentReference[]>([]);
	let [currentCard, setCurrentCard] = useState<Project["fields"] | null>(null);
	const [cardHidden, setCardHidden] = useState(false);
	let [cardIndex, setCardIndex] = useState(0);

	useEffect(() => {
		setCardAnchor(
			window.innerWidth * (sideBarWidth / 100) +
				(window.innerWidth * (1 - sideBarWidth / 100)) / 2,
		);
		pollCards().then(() => {
			getNextCard();
		});
	}, []);

	async function pollCards() {
		let defaultUser = await getDoc(DEFAULT_USER);
		const seenBefore = USER_CARD_CATEGORIES.flatMap<DocumentReference>(d =>
			defaultUser.get(d),
		).map(r => r.id);

		const ds = await getDocs(collection(db, "projects"));

		setCards((cards = ds.docs.map(d => d.ref).filter(r => !seenBefore.includes(r.id))));
	}

	async function getNextCard() {
		if (cardIndex >= cards.length) {
			setTimeout(() => {
				setCurrentCard(null);
			}, 200);
		}

		let card = await getDoc(cards[cardIndex]);
		setCurrentCard((currentCard = card.data() as Project["fields"]));
		setCardIndex((cardIndex = cardIndex + 1));
	}

	function toggleSideBar() {
		setSideBarWidth((sideBarWidth = sideBarWidth === 4 ? 25 : 4));
		setCardAnchor(
			window.innerWidth * (sideBarWidth / 100) +
				(window.innerWidth * (1 - sideBarWidth / 100)) / 2,
		);
	}

	function acceptCard() {
		console.log(`ACCEPT ${currentCard?.name}`);
		setOffset(window.innerWidth / 2);
		updateField<DocumentReference[]>(DEFAULT_USER, INTERESTED, rs =>
			rs.concat([cards[cardIndex - 1]]),
		);
		showNextCard();
	}

	function rejectCard() {
		console.log(`REJECTED ${currentCard?.name}`);
		setOffset(-window.innerWidth / 2);
		updateField<DocumentReference[]>(DEFAULT_USER, REJECTED, rs =>
			rs.concat([cards[cardIndex - 1]]),
		);
		showNextCard();
	}

	function resetLists() {
		updateFields(
			DEFAULT_USER,
			USER_CARD_CATEGORIES.map(c => [c, () => []]),
		).then(() => window.location.reload());
	}

	function showNextCard() {
		setCardHidden(true);

		getNextCard();

		setTimeout(() => {
			setOffset(0);
			setTimeout(() => {
				setCardHidden(false);
			}, 200);
		}, 200);
	}
	return (
		<Grid
			templateAreas={`"nav main"`}
			gridTemplateRows={"100% 1fr"}
			gridTemplateColumns={`${sideBarWidth}% 1fr`}
			height="calc(100% - 64px)"
			color="blackAlpha.700"
			fontWeight="bold"
			style={{
				transition: "all 0.5s",
			}}
		>
			<GridItem pl="2" bg="gray.100" area={"nav"} zIndex="9999">
				<Flex h="100%" flexDirection="column" justifyContent="center" alignItems="center">
					<Button onClick={resetLists}>Reset</Button>
					<Button
						onClick={toggleSideBar}
						alignSelf="flex-end"
						transform="translate(50%)"
						bg="white"
						boxShadow={"base"}
					>
						{">"}
					</Button>
					<Button onClick={() => resetDatabase(defaultDatabase)}>Reset Full!</Button>
				</Flex>
			</GridItem>
			<GridItem pl="2" area={"main"}>
				<Center h="100%">
					<Flex justifyContent="space-evenly" alignItems="center" w="60%">
						<Button
							className={`${dragging ? "Hidden" : ""}`}
							onClick={rejectCard}
							leftIcon={<MdClose />}
						>
							Reject
						</Button>
						{currentCard ? (
							<SwipeCard
								offset={offset}
								setOffset={setOffset}
								dragging={dragging}
								setDragging={setDragging}
								cardAnchor={cardAnchor}
								acceptCard={acceptCard}
								rejectCard={rejectCard}
								data={currentCard}
								cardHidden={cardHidden}
							></SwipeCard>
						) : (
							<Text fontSize="xl">No projects! Come back later.</Text>
						)}
						<Button
							className={`${dragging ? "Hidden" : ""}`}
							onClick={acceptCard}
							rightIcon={<MdDone />}
						>
							Accept
						</Button>
					</Flex>
				</Center>
			</GridItem>
		</Grid>

		// <div className="App">
		//   {/* <Card></Card> */}
		//   <SwipeCard></SwipeCard>
		// </div>
	);
};

export default Finder;
