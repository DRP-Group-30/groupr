import { CheckCircleIcon } from "@chakra-ui/icons";
import {
	Container,
	Heading,
	VStack,
	Card,
	Flex,
	Text,
	Link,
	Image,
	Button,
	Center,
	Stack,
	CardBody,
	CardFooter,
	SimpleGrid,
	useToast,
	Tag,
	TagLeftIcon,
	TagLabel,
	LinkBox,
	LinkOverlay,
	Box,
} from "@chakra-ui/react";
import Sidebar from "./sidebar";
import { Dispatch, DragEvent, SetStateAction, useEffect, useState } from "react";
import { Project } from "../../backend";
import {
	DocumentReference,
	doc,
	getDoc,
	updateDoc,
} from "firebase/firestore";
import { MdClose, MdDone } from "react-icons/md";
import { DEFAULT_USER } from "./finder";
import { Firebase } from "../../backend/firebase";

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
			boxShadow={"xl"}
			draggable={col !== "Matched"}
			onDragStart={dragStart}
			width="100%"
		>
			<Image
				objectFit="cover"
				maxW={{ base: "100%", sm: "200px" }}
				src={`https://picsum.photos/seed/${data.fields.name}/800`}
				alt="Caffe Latte"
			/>

			<Stack width="100%">
				<CardBody>
					<Heading size="md">{data.fields.name}</Heading>

					<Text py="2">{data.fields.overview}</Text>

					{col === "Matched" && (
						<Box backgroundColor="gray.100" borderRadius="md" padding="8px">
							<Text>Because you're interested in</Text>
							<Flex flexWrap="wrap">
								{data.fields.tags.map(tag => (
									<Tag variant="solid" colorScheme="teal" margin="2px">
										{tag}
									</Tag>
								))}
							</Flex>
						</Box>
					)}
				</CardBody>

				<CardFooter>
					<Flex width="100%" justifyContent="space-between" alignItems="center">
						{col === "Matched" && (
							<Link
								href={`mailto:${data.fields.contactInfo}`}
								textDecoration="underline"
							>
								{data.fields.contactInfo}
							</Link>
						)}
						<Button
							colorScheme="blue"
							rightIcon={col === "Rejected" ? <MdDone /> : <MdClose />}
							size="sm"
							aria-label={""}
							onClick={moveProjectOut}
						>
							{col === "Rejected"
								? "Accept"
								: col === "Matched"
								? "Unmatch"
								: "Reject"}
						</Button>
					</Flex>
				</CardFooter>
			</Stack>
		</Card>
	);
};

const DashboardList = ({
	heading,
	children,
	moveProjectInto,
}: {
	heading: string;
	children: Project[];
	moveProjectInto: (col: string, project?: Project) => void;
}) => {
	return (
		<Container
			maxW="100%"
			maxH=""
			overflowY="auto"
			centerContent
			backgroundColor="gray.100"
			borderRadius="xl"
			margin="16px"
		>
			<Heading margin="16px">{heading}</Heading>
			<SimpleGrid width="100%" columns={children.length > 0 ? 2 : 1} spacing={8}>
				{children.length > 0 ? (
					children.map(project => (
						<DashboardCard
							key={project.id}
							data={project}
							col="Matched"
							moveProjectInto={moveProjectInto}
							setDraggedProject={() => {}}
						></DashboardCard>
					))
				) : (
					<Center>
						<Text fontSize="lg">Nothing here for now!</Text>
					</Center>
				)}
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
			onDragOver={dragOver}
			onDrop={drop}
		>
			<Heading m="16px">{heading}</Heading>
			<VStack h="100%" spacing={5}>
				{children.length > 0 ? (
					children.map(project => (
						<DashboardCard
							key={project.id}
							col={heading}
							data={project}
							moveProjectInto={moveProjectInto}
							setDraggedProject={setDraggedProject}
						></DashboardCard>
					))
				) : (
					<Text fontSize="lg">
						Nothing yet! Projects you {heading === "Rejected" ? "reject" : "accept"}{" "}
						will show up here.
					</Text>
				)}
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

const Dashboard = () => {
	const toast = useToast();
	const [showMatched, setShowMatched] = useState(true);
	let [matched, setMatched] = useState<Project[]>([]);
	let [interested, setInterested] = useState<Project[]>([]);
	let [rejected, setRejected] = useState<Project[]>([]);
	let [draggedProject, setDraggedProject] = useState<Project | null>(null);

	useEffect(() => {
		getProjects();
	}, []);

	async function getProjects() {
		let defaultUser = await getDoc(DEFAULT_USER);
		let matchedRefs = defaultUser.get("matched");
		let matchedDocs = await Promise.all(
			matchedRefs.map((ref: DocumentReference) => getDoc(ref)),
		);
		setMatched(
			(matched = matchedDocs.map(
				doc => ({ id: doc.id, collections: {}, fields: doc.data() } as Project),
			)),
		);

		let interestedRefs = defaultUser.get("interested");
		let interestedDocs = await Promise.all(
			interestedRefs.map((ref: DocumentReference) => getDoc(ref)),
		);
		setInterested(
			(interested = interestedDocs.map(
				doc =>
					({
						id: doc.id,
						collections: {},
						fields: doc.data(),
					} as Project),
			)),
		);

		let rejectedRefs = defaultUser.get("rejected");
		let rejectedDocs = await Promise.all(
			rejectedRefs.map((ref: DocumentReference) => getDoc(ref)),
		);
		setRejected(
			(rejected = rejectedDocs.map(
				doc =>
					({
						id: doc.id,
						collections: {},
						fields: doc.data(),
					} as Project),
			)),
		);
	}

	function moveProjectInto(col: string, project?: Project | null) {
		if (project === undefined) project = null;
		if (draggedProject === null) draggedProject = project;
		if (draggedProject === null) return;

		setMatched((matched = matched.filter(p => p !== draggedProject)));
		setInterested((interested = interested.filter(p => p !== draggedProject)));
		setRejected((rejected = rejected.filter(p => p !== draggedProject)));

		if (col.toLowerCase() === "interested") {
			if (draggedProject.fields.interested.map(ref => ref.id).includes(DEFAULT_USER.id)) {
				matched.push(draggedProject);
				setMatched(matched);
				toast({
					render: () => (
						<Center>
							<LinkBox>
								<LinkOverlay href="dashboard"></LinkOverlay>
								<Tag colorScheme="green" size="lg" variant="solid">
									<TagLeftIcon as={CheckCircleIcon}></TagLeftIcon>
									<TagLabel padding="12px">
										<Stack spacing="0">
											<Text as="b">Matched project!</Text>
											<Text>See your matches in the Dashboard.</Text>
										</Stack>
									</TagLabel>
								</Tag>
							</LinkBox>
						</Center>
					),
					duration: 2000,
					isClosable: true,
				});
			} else {
				interested.push(draggedProject);
				setInterested(interested);
			}
			setDraggedProject(null);
		} else if (col.toLowerCase() === "rejected") {
			rejected.push(draggedProject);
			setRejected(rejected);
			setDraggedProject(null);
		}

		updateDoc(DEFAULT_USER, {
			matched: matched.map(p => doc(Firebase.db, "projects", p.id)),
			interested: interested.map(p => doc(Firebase.db, "projects", p.id)),
			rejected: rejected.map(p => doc(Firebase.db, "projects", p.id)),
		});
	}

	return (
		<Sidebar
			sideElem={<DashboardSidebar setShowMatched={setShowMatched}></DashboardSidebar>}
			mainElem={
				<Flex p="15" w="100%" h="100%" justifyContent="space-evenly">
					{showMatched ? (
						<DashboardList
							heading="Matched"
							children={matched}
							moveProjectInto={moveProjectInto}
						></DashboardList>
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

export default Dashboard;
