import {
	DocumentReference,
	doc,
	getDoc,
	getDocs,
	collection,
	DocumentData,
} from "firebase/firestore";
import "../../app.css";
import { MdDone, MdClose } from "react-icons/md";
import SwipeCard from "../swipe_card";
import {
	Button,
	Center,
	Flex,
	Grid,
	GridItem,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Firebase } from "../../../backend/firebase";
import { Fields, getImg, resetDatabase, updateField } from "../../../util/firebase";
import defaultDatabase from "../../../backend/default_database";
import { IRM, Project, ProjectOrUser, User, userName } from "../../../backend";
import { getCurrentUser, getCurrentUserRef } from "../auth";
import React from "react";
import { map, swapPromiseNull } from "../../../util";
import { useAuth } from "../../../context/AuthContext";
import { get } from "http";
import { useNavigate } from "react-router-dom";
import { INTERESTED, MATCHED, REJECTED, allSeen } from "../finder";

const Finder2 = () => {
	const navigate = useNavigate();
	const [offset, setOffset] = useState(0);
	const [dragging, setDragging] = useState(false);
	let [sideBarWidth, setSideBarWidth] = useState(25);
	const [cardAnchor, setCardAnchor] = useState(0);
	let [cards, setCards] = useState<DocumentReference[]>([]);
	let [currentCard, setCurrentCard] = useState<User["fields"] | null>(null);
	const [cardHidden, setCardHidden] = useState(false);
	let [cardIndex, setCardIndex] = useState(0);
	const [coverImgURL, setCoverImg] = useState<string | null>(null);
	const { currentUser } = useAuth();

	useEffect(() => {
		swapPromiseNull(map(currentCard?.profileImage ?? null, c => getImg(c))).then(u => {
			return setCoverImg(u);
		});
	}, []);

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
		const userSnapshot = await getCurrentUser();
		const user = userSnapshot.data() as User[Fields];
		let userProjects = user.ownProjects.map(p => p.id);
		const seenBefore = allSeen(user.irm).map(r => r.id);

		const ds = await getDocs(collection(Firebase.db, "projects"));

		setCards(
			(cards = ds.docs
				.map(d => d.ref)
				.filter(r => !seenBefore.includes(r.id) && !userProjects.includes(r.id))),
		);
	}

	async function getNextCard() {
		if (cardIndex >= cards.length) {
			setTimeout(() => {
				setCurrentCard(null);
			}, 200);
		} else {
			let card = await getDoc(cards[cardIndex]);
			setCurrentCard((currentCard = card.data() as User["fields"]));
			setCardIndex((cardIndex = cardIndex + 1));
			const iHateDRPSoMuchIActuallyWantToDieWTFIsThisShit = await map(
				currentCard?.profileImage ?? null,
				getImg,
			);
			setCoverImg(iHateDRPSoMuchIActuallyWantToDieWTFIsThisShit);
		}
	}

	function toggleSideBar() {
		setSideBarWidth((sideBarWidth = sideBarWidth === 4 ? 25 : 4));
		setCardAnchor(
			window.innerWidth * (sideBarWidth / 100) +
				(window.innerWidth * (1 - sideBarWidth / 100)) / 2,
		);
	}

	async function acceptCard() {
		setOffset(window.innerWidth / 2);
		const cur = cards[cardIndex - 1];
		const snapshot = (await getDoc(cur)).data() as Project["fields"];
		console.log(snapshot.irm.interested);
		const curUser = await getCurrentUserRef();
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
				<Flex h="100%" flexDirection="column" justifyContent="center" alignItems="center">
					<Button
						colorScheme="groupr"
						boxShadow="lg"
						onClick={() => resetDatabase(defaultDatabase())}
					>
						Reset!
					</Button>
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
									data={{ type: ProjectOrUser.User, fields: currentCard }}
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

export default Finder2;
