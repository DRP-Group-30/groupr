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
import { Dispatch, DragEvent, SetStateAction, useEffect, useState } from "react";
import { Project } from "./Backend";
import { DocumentData, DocumentReference, DocumentSnapshot, getDoc } from "firebase/firestore";
import { MdClose, MdDone } from "react-icons/md";

const DashboardCard = ({
	data,
	col,
	moveProjectInto,
	setDraggedProject,
}: {
	data: Project;
	col: string;
	moveProjectInto: (col: string, project?: Project) => void;
	setDraggedProject: Dispatch<SetStateAction<Project | null>>;
}) => {
	function dragStart(e: DragEvent<HTMLDivElement>) {
		setDraggedProject(data);
	}

	function moveProjectOut() {
		moveProjectInto(col === "Rejected" ? "Interested" : "Rejected", data);
	}

	return (
		<Card
			direction={{ base: "column", sm: "row" }}
			overflow="hidden"
			boxShadow={"xl"}
			draggable={true}
			onDragStart={e => dragStart(e)}
		>
			<Image
				objectFit="cover"
				maxW={{ base: "100%", sm: "200px" }}
				src={`https://picsum.photos/seed/${data.fields.name}/800`}
				alt="Caffe Latte"
			/>

			<Stack>
				<CardBody>
					<Heading size="md">{data.fields.name}</Heading>

					<Text py="2">{data.fields.overview}</Text>
				</CardBody>

				<CardFooter alignSelf="end">
					<Button
						colorScheme="blue"
						rightIcon={col === "Rejected" ? <MdDone /> : <MdClose />}
						size="sm"
						aria-label={""}
						onClick={moveProjectOut}
					>
						{col === "Rejected" ? "Accept" : "Reject"}
					</Button>
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
					<DashboardCard
						key={project.id}
						data={project}
						col="Matched"
						moveProjectInto={() => {}}
						setDraggedProject={() => {}}
					></DashboardCard>
				))}
			</SimpleGrid>
		</Container>
	);
};

const DashboardColumn = ({
	heading,
	children,
	moveProjectInto,
	setDraggedProject,
}: {
	heading: string;
	children: Project[];
	moveProjectInto: (col: string) => void;
	setDraggedProject: Dispatch<SetStateAction<Project | null>>;
}) => {
	function dragOver(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
	}

	function drop(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
		moveProjectInto(heading);
	}

	return (
		<Container
			h="100%"
			overflowY="auto"
			bgColor="gray.100"
			borderRadius="lg"
			centerContent
			onDragOver={e => dragOver(e)}
			onDrop={e => drop(e)}
		>
			<Heading m="16px">{heading}</Heading>
			<VStack h="100%" spacing={5}>
				{children.map(project => (
					<DashboardCard
						key={project.id}
						col={heading}
						data={project}
						moveProjectInto={moveProjectInto}
						setDraggedProject={setDraggedProject}
					></DashboardCard>
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
	let [draggedProject, setDraggedProject] = useState<Project | null>(null);

	useEffect(() => {
		getProjects();
	}, []);

	async function getProjects() {
		// let defaultUser = await getDoc(DEFAULT_USER);

		// let matchedRefs = defaultUser.get("matched");
		// let matchedDocs = await Promise.all(
		// 	matchedRefs.map((ref: DocumentReference) => getDoc(ref)),
		// );
		// setMatched((matched = matchedDocs.map(doc => doc.data() as Project)));

		// let interestedRefs = defaultUser.get("interested");
		// let interestedDocs = await Promise.all(
		// 	interestedRefs.map((ref: DocumentReference) => getDoc(ref)),
		// );
		// setInterested((interested = interestedDocs.map(doc => doc.data() as Project)));

		// let rejectedRefs = defaultUser.get("rejected");
		// let rejectedDocs = await Promise.all(
		// 	rejectedRefs.map((ref: DocumentReference) => getDoc(ref)),
		// );
		// setRejected((rejected = rejectedDocs.map(doc => doc.data() as Project)));

		setInterested(
			(interested = [
				{
					id: "ajslfkjdvlakjdvc",
					collections: { boxes: [], roles: [] },
					fields: {
						name: "Example Game",
						collaborators: [],
						contactInfo: "example@gmail.com",
						overview:
							"This is a description of the example game. The example game is very good. You will enjoy working on the example game. You are going ot have a great time developing for it.",
						coverImage: null,
					},
				},
			]),
		);
	}

	function moveProjectInto(col: string, project?: Project | null) {
		if (project === undefined) project = null;
		if (draggedProject === null) draggedProject = project;
		if (draggedProject === null) return;

		setInterested((interested = interested.filter(p => p != draggedProject)));
		setRejected((rejected = rejected.filter(p => p != draggedProject)));

		if (col.toLowerCase() === "interested") {
			interested.push(draggedProject);
			setInterested(interested);
			setDraggedProject(null);
		} else if (col.toLowerCase() === "rejected") {
			rejected.push(draggedProject);
			setRejected(rejected);
			setDraggedProject(null);
		}
	}

	return (
		<Sidebar
			sideElem={<DashboardSidebar setShowMatched={setShowMatched}></DashboardSidebar>}
			mainElem={
				<Flex p="15" w="100%" h="100%" justifyContent="space-evenly">
					{showMatched ? (
						<DashboardList heading="Matched" children={matched}></DashboardList>
					) : (
						<>
							<DashboardColumn
								heading="Interested"
								children={interested}
								moveProjectInto={moveProjectInto}
								setDraggedProject={setDraggedProject}
							></DashboardColumn>
							<DashboardColumn
								heading="Rejected"
								children={rejected}
								moveProjectInto={moveProjectInto}
								setDraggedProject={setDraggedProject}
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
