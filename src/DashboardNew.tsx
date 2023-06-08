import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
	Container,
	Heading,
	VStack,
	Card,
	Flex,
	Text,
	Link,
	Image,
	Badge,
	Button,
	Center,
	Stack,
	useColorModeValue,
	CardBody,
	CardFooter,
	IconButton,
	SimpleGrid,
} from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DEFAULT_USER, Project } from "./Finder";
import { DocumentData, DocumentReference, DocumentSnapshot, getDoc } from "firebase/firestore";

const DashboardCard = ({ data }: { data: Project }) => {
	return (
		<Card direction={{ base: "column", sm: "row" }} overflow="hidden" variant="outline">
			<Image
				objectFit="cover"
				maxW={{ base: "100%", sm: "200px" }}
				src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
				alt="Caffe Latte"
			/>

			<Stack>
				<CardBody>
					<Heading size="md">{data.name}</Heading>

					<Text py="2">{data.overview}</Text>
				</CardBody>

				<CardFooter alignSelf="end">
					<IconButton
						colorScheme="blue"
						icon={<ChevronRightIcon />}
						size="sm"
						aria-label={""}
					/>
				</CardFooter>
			</Stack>
		</Card>
	);
};

const DashboardList = ({ heading, children }: { heading: string; children: Project[] }) => {
	return (
		<Container maxW="100%" maxH="" overflowY="auto" centerContent>
			<Heading>{heading}</Heading>
			<SimpleGrid columns={2} spacing={8}>
				{children.map(project => (
					<DashboardCard key={project.name} data={project}></DashboardCard>
				))}
			</SimpleGrid>
		</Container>
	);
};

const DashboardColumn = ({ heading, children }: { heading: string; children: Project[] }) => {
	return (
		<Container maxW="80%" maxH="" overflowY="auto" centerContent>
			<Heading>{heading}</Heading>
			<VStack spacing={5}>
				{children.map(project => (
					<DashboardCard key={project.name} data={project}></DashboardCard>
				))}
			</VStack>
		</Container>
	);
};

const DashboardSidebar = ({
	setShowMatched,
}: {
	setShowMatched: Dispatch<SetStateAction<boolean>>;
}) => {
	return (
		<Card w="90%" p="2">
			<VStack>
				<Button size="md" width="90%" onClick={() => setShowMatched(true)}>
					Matched Projects
				</Button>
				<Button size="md" width="90%" onClick={() => setShowMatched(false)}>
					Pending Projects
				</Button>
			</VStack>
		</Card>
	);
};

const DashboardNew = () => {
	const [showMatched, setShowMatched] = useState(true);
	let [matched, setMatched] = useState<Project[]>([]);
	let [interested, setInterested] = useState<Project[]>([]);
	let [rejected, setRejected] = useState<Project[]>([]);

	useEffect(() => {
		getProjects();
	}, []);

	async function getProjects() {
		let defaultUser = await getDoc(DEFAULT_USER);

		let matchedRefs = defaultUser.get("matched");
		let matchedDocs = await Promise.all(
			matchedRefs.map((ref: DocumentReference) => getDoc(ref)),
		);
		setMatched((matched = matchedDocs.map(doc => doc.data() as Project)));

		let interestedRefs = defaultUser.get("interested");
		let interestedDocs = await Promise.all(
			interestedRefs.map((ref: DocumentReference) => getDoc(ref)),
		);
		setInterested((interested = interestedDocs.map(doc => doc.data() as Project)));

		let rejectedRefs = defaultUser.get("rejected");
		let rejectedDocs = await Promise.all(
			rejectedRefs.map((ref: DocumentReference) => getDoc(ref)),
		);
		setRejected((rejected = rejectedDocs.map(doc => doc.data() as Project)));
	}

	return (
		<Sidebar
			sideElem={<DashboardSidebar setShowMatched={setShowMatched}></DashboardSidebar>}
			mainElem={
				<Flex p="15" w="100%">
					{showMatched ? (
						<DashboardList heading="Matched" children={matched}></DashboardList>
					) : (
						<>
							<DashboardColumn
								heading="Interested"
								children={interested}
							></DashboardColumn>
							<DashboardColumn
								heading="Rejected"
								children={rejected}
							></DashboardColumn>
						</>
					)}
					{/* <DashboardList heading="Interested" children={["Test","Test","Test","Test"]}></DashboardList> */}
				</Flex>
			}
		></Sidebar>
	);
};

export default DashboardNew;