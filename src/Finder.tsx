// import {
//   DocumentReference,
//   DocumentData,
//   getDoc,
//   updateDoc,
// } from "firebase/firestore";
import "./App.css";
// import Card from './Card';
// import { DEFAULT_USER, USER_CARD_CATEGORIES } from "./Card";
import { MdDone, MdClose } from "react-icons/md";
import SwipeCard from "./SwipeCard";
import { Button, Center, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Finder = () => {
	const [offset, setOffset] = useState(0);
	const [dragging, setDragging] = useState(false);
	let [sideBarWidth, setSideBarWidth] = useState(25);
	const [cardAnchor, setCardAnchor] = useState(0);

	useEffect(() => {
		setCardAnchor(
			window.innerWidth * (sideBarWidth / 100) +
				(window.innerWidth * (1 - sideBarWidth / 100)) / 2,
		);
	}, [setCardAnchor, sideBarWidth]);

	// async function resetLists() {
	// 	updateFields(
	// 		DEFAULT_USER,
	// 		USER_CARD_CATEGORIES.map(c => [c, () => []]),
	// 	).then(() => window.location.reload());
	// }

	function toggleSideBar() {
		setSideBarWidth((sideBarWidth = sideBarWidth === 4 ? 25 : 4));
		setCardAnchor(
			window.innerWidth * (sideBarWidth / 100) +
				(window.innerWidth * (1 - sideBarWidth / 100)) / 2,
		);
	}

	function acceptCard() {
		setOffset(window.innerWidth / 2);
	}

	function rejectCard() {
		setOffset(-window.innerWidth / 2);
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
					<Button
						onClick={toggleSideBar}
						alignSelf="flex-end"
						transform="translate(50%)"
						bg="white"
						boxShadow={"base"}
					>
						{">"}
					</Button>
				</Flex>
			</GridItem>
			<GridItem pl="2" area={"main"}>
				<Center h="100%">
					<Flex justifyContent="space-evenly" alignItems="center" w="60%">
						<Button
							className={`${dragging ? "Hidden" : ""}`}
							onClick={dragging ? rejectCard : () => {}}
							leftIcon={<MdClose />}
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
						></SwipeCard>
						<Button
							className={`${dragging ? "Hidden" : ""}`}
							onClick={dragging ? acceptCard : () => {}}
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
		//   <button onClick={resetLists}>Reset</button>
		// </div>
	);
};

export default Finder;

// const updateFields = (
//   d: DocumentReference<DocumentData>,
//   fs: [string, (x: any) => any][]
// ): Promise<void> =>
//   getDoc(d)
//     .then((snapshot) => fs.map(([f, _]) => snapshot.get(f)))
//     .then((n) =>
//       updateDoc(d, Object.fromEntries(fs.map(([f, m], i) => [f, m(n[i])])))
//     );
