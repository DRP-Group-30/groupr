import {
	DocumentReference,
	doc,
	getDoc,
	getDocs,
	collection,
	DocumentData,
	query,
	orderBy,
	where,
} from "firebase/firestore";
import "../app.css";
import { MdDone, MdClose } from "react-icons/md";
import SwipeCard from "./swipe_card";
import {
	Box,
	Button,
	Card,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Firebase } from "../../backend/firebase";
import { Fields, getAllTags, getImg, resetDatabase, updateField } from "../../util/firebase";
import defaultDatabase from "../../backend/default_database";
import { IRM, Project, ProjectOrUser, User } from "../../backend";
import { getCurrentUser, getCurrentUserRef } from "./auth";
import React from "react";
import { inlineLog, map, nubWith, swapPromiseNull } from "../../util";
import { useAuth } from "../../context/AuthContext";
import { get } from "http";
import { useNavigate } from "react-router-dom";
import {
	AutoCompleteTag,
	AutoComplete,
	AutoCompleteInput,
	AutoCompleteList,
	AutoCompleteItem,
	ItemTag,
} from "@choc-ui/chakra-autocomplete";

export const DEFAULT_USER_ID = "uKSLFGA3qTuLmweXlv31";
export const DEFAULT_USER = doc(Firebase.db, "users", DEFAULT_USER_ID);

export const allSeen = (irm: IRM): DocumentReference<DocumentData>[] =>
	irm.interested.concat(irm.rejected).concat(irm.matched);

export const INTERESTED = "irm.interested";
export const MATCHED = "irm.matched";
export const REJECTED = "irm.rejected";

const Finder = () => {
	const navigate = useNavigate();
	const [offset, setOffset] = useState(0);
	const [dragging, setDragging] = useState(false);
	let [sideBarWidth, setSideBarWidth] = useState(25);
	const [cardAnchor, setCardAnchor] = useState(0);
	let [cards, setCards] = useState<DocumentReference[]>([]);
	let [currentCard, setCurrentCard] = useState<Project["fields"] | null>(null);
	const [cardHidden, setCardHidden] = useState(false);
	let [cardIndex, setCardIndex] = useState(0);
	const [coverImgURL, setCoverImg] = useState<string | null>(null);
	const { currentUser } = useAuth();
	const [filterTags, setFilterTags] = useState<ItemTag[]>([]);
	const [allTags, setAllTags] = useState<string[]>([]);
	const initTagTable = async () => setAllTags(inlineLog(await getAllTags()));

	function filterMatches(tags: String[]): number {
		return inlineLog(tags.filter(t => filterTags.map(t => t.label).includes(t)).length);
	}

	useEffect(() => {
		initTagTable();
		swapPromiseNull(map(currentCard?.coverImage ?? null, c => getImg(c))).then(u => {
			return setCoverImg(u);
		});
	}, []);

	useEffect(() => {
		setCardIndex((cardIndex = 0));
		setCardAnchor(
			window.innerWidth * (sideBarWidth / 100) +
				(window.innerWidth * (1 - sideBarWidth / 100)) / 2,
		);
		pollCards().then(() => {
			getNextCard();
		});
	}, [filterTags]);

	async function pollCards() {
		const userSnapshot = await getCurrentUser();
		const user = userSnapshot.data() as User[Fields];
		let userProjects = user.ownProjects.map(p => p.id);
		const seenBefore = allSeen(user.irm).map(r => r.id);

		const ds = await getDocs(
			filterTags.length === 0
				? query(collection(Firebase.db, "projects"), orderBy("name"))
				: query(
						collection(Firebase.db, "projects"),
						where(
							"tags",
							"array-contains-any",
							filterTags.map(t => t.label),
						),
						orderBy("name"),
				  ),
		);

		setCards(
			(cards = ds.docs
				.map(d => d.ref)
				.filter(r => !seenBefore.includes(r.id) && !userProjects.includes(r.id))).sort(),
		);
	}

	async function getNextCard() {
		if (cardIndex >= cards.length) {
			setTimeout(() => {
				setCurrentCard(null);
			}, 200);
		} else {
			let card = await getDoc(cards[cardIndex]);
			setCurrentCard((currentCard = card.data() as Project["fields"]));
			setCardIndex((cardIndex = cardIndex + 1));
			const iHateDRPSoMuchIActuallyWantToDieWTFIsThisShit = await map(
				currentCard?.coverImage ?? null,
				getImg,
			);
			setCoverImg(iHateDRPSoMuchIActuallyWantToDieWTFIsThisShit);
		}
	}

	async function acceptCard() {
		console.log(`ACCEPT ${currentCard?.name}`);
		setOffset(window.innerWidth / 2);
		const cur = cards[cardIndex - 1];
		const snapshot = (await getDoc(cur)).data() as Project["fields"];
		console.log(snapshot.irm.interested);
		const curUser = await getCurrentUserRef();
		console.log("HMMMMMM");
		console.log(snapshot.irm.interested);
		if (snapshot.irm.interested.map(i => i.id).includes(currentUser?.uid ?? "")) {
			console.log("MATCHED!");
			updateField<DocumentReference[]>(curUser, MATCHED, (rs: any[]) =>
				rs.concat([cards[cardIndex - 1]]),
			);
			updateField<DocumentReference[]>(cur, INTERESTED, (rs: any[]) =>
				rs.filter((r: { id: any }) => r.id !== currentUser?.uid ?? ""),
			);
		} else {
			console.log("RECORDED INTEREST!");
			updateField<DocumentReference[]>(curUser, INTERESTED, (rs: any[]) =>
				rs.concat([cards[cardIndex - 1]]),
			);
		}
		showNextCard();
	}

	function rejectCard() {
		const userRef = getCurrentUserRef();
		console.log(`REJECTED ${currentCard?.name}`);
		setOffset(-window.innerWidth / 2);
		updateField<DocumentReference[]>(userRef, REJECTED, (rs: any[]) =>
			rs.concat([cards[cardIndex - 1]]),
		);
		showNextCard();
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
			className="FinderBackground"
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
			<GridItem
				pl="2"
				// bg={useColorModeValue("groupr.900", "groupr.300")}
				area={"nav"}
				zIndex="9999"
				mt="1pt"
				// outlineColor="gray.100"
				// outline="1px solid"
				className="GlassMorphic"
			>
				<Flex
					h="100%"
					flexDirection="column"
					justifyContent="space-between"
					alignItems="center"
				>
					<Card p={4} width="100%" mr={2} backgroundColor="gray.100" boxShadow="lg">
						<Box width="100%" pr={2}>
							<FormControl>
								<FormLabel color="groupr.700" fontWeight="bold">
									Filter by tags
								</FormLabel>
								<Flex maxWidth="600px" flexWrap="wrap">
									{nubWith(
										filterTags.map((tag, tid) => ({
											tid: tid,
											onRemove: tag.onRemove,
											label: (tag.label as string).toUpperCase(),
										})),
										t => t.label,
									).map(({ label, tid, onRemove }) => (
										<AutoCompleteTag
											key={tid}
											label={label}
											onRemove={onRemove}
											variant="solid"
											colorScheme="groupr"
											marginRight="3px"
											marginBottom="6px"
										/>
									))}
								</Flex>
								<AutoComplete
									openOnFocus
									multiple
									onReady={({ tags }) => {
										setFilterTags(tags);
									}}
								>
									<AutoCompleteInput
										placeholder="Search for tags..."
										backgroundColor="white"
										colorScheme="groupr"
										borderColor="groupr.500"
									></AutoCompleteInput>
									<AutoCompleteList height="200px" width="100%" overflow="scroll">
										{allTags
											.filter(
												t => !filterTags.map(tt => tt.label).includes(t),
											)
											.map(t => (
												<AutoCompleteItem
													key={t}
													value={t}
													textTransform="capitalize"
													_selected={{
														bg: "whiteAlpha.50",
													}}
													_focus={{
														bg: "whiteAlpha.100",
													}}
												>
													{t}
												</AutoCompleteItem>
											))}
									</AutoCompleteList>
								</AutoComplete>
							</FormControl>
						</Box>
					</Card>
					<Button
						colorScheme="groupr"
						boxShadow="lg"
						onClick={() => resetDatabase(defaultDatabase())}
					>
						Reset!
					</Button>
					<div></div>
				</Flex>
			</GridItem>
			<GridItem pl="2" area={"main"}>
				<Center h="100%">
					<Flex justifyContent="space-evenly" alignItems="center" w="60%">
						{currentCard ? (
							<>
								<Button
									className={`${dragging ? "Hidden" : ""}`}
									onClick={rejectCard}
									leftIcon={<MdClose />}
									boxShadow="lg"
								>
									Reject
								</Button>
								<SwipeCard
									offset={offset}
									setOffset={setOffset}
									dragging={dragging}
									setDragging={setDragging}
									cardAnchor={cardAnchor}
									acceptCard={acceptCard}
									rejectCard={rejectCard}
									data={{ type: ProjectOrUser.Project, fields: currentCard }}
									cardHidden={cardHidden}
									coverImgURL={coverImgURL}
								></SwipeCard>
								<Button
									className={`${dragging ? "Hidden" : ""}`}
									onClick={acceptCard}
									rightIcon={<MdDone />}
									boxShadow="lg"
								>
									Accept
								</Button>
							</>
						) : (
							<VStack>
								<Text fontSize="xl">No projects! Come back later.</Text>
								<Button
									colorScheme="groupr"
									className={"dashboardbutton"}
									onClick={() => {
										navigate("/dashboard", { replace: false });
									}}
									boxShadow="lg"
								>
									Go to Dashboard
								</Button>
							</VStack>
						)}
					</Flex>
				</Center>
			</GridItem>
		</Grid>
	);
};

export default Finder;
