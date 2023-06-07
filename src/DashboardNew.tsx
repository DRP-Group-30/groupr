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
import { Dispatch, SetStateAction, useState } from "react";

const DashboardCard = ({ content }: { content: any }) => {
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
					<Heading size="md">{content}</Heading>

					<Text py="2">
						Caffè latte is a coffee beverage of Italian origin made with espresso and
						steamed milk.
					</Text>
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

const DashboardList = ({ heading, children }: { heading: string; children: any[] }) => {
	return (
		<Container maxW="100%" maxH="" overflowY="auto" centerContent>
			<Heading>{heading}</Heading>
			<SimpleGrid columns={2} spacing={8}>
				{children.map(link => (
					<DashboardCard content={link}></DashboardCard>
				))}
			</SimpleGrid>
		</Container>
	);
};

const DashboardColumn = ({ heading, children }: { heading: string; children: any[] }) => {
	return (
		<Container maxW="80%" maxH="" overflowY="auto" centerContent>
			<Heading>{heading}</Heading>
			<VStack spacing={5}>
				{children.map(link => (
					<DashboardCard content={link}></DashboardCard>
				))}
			</VStack>
		</Container>
	);
};

const DashboardSidebar = ({ setMatched }: { setMatched: Dispatch<SetStateAction<boolean>> }) => {
	return (
		<Card w="90%" p="2">
			<VStack>
				<Button size="md" width="90%" onClick={() => setMatched(true)}>
					Matched Projects
				</Button>
				<Button size="md" width="90%" onClick={() => setMatched(false)}>
					Pending Projects
				</Button>
			</VStack>
		</Card>
	);
};

const DashboardNew = () => {
	const [matched, setMatched] = useState(true);

	return (
		<Sidebar
			sideElem={<DashboardSidebar setMatched={setMatched}></DashboardSidebar>}
			mainElem={
				<Flex p="15" w="100%">
					{" "}
					{matched ? (
						<DashboardList
							heading="Matched"
							children={["Test", "Test", "Test", "Test"]}
						></DashboardList>
					) : (
						<>
							<DashboardColumn
								heading="Interested"
								children={["Test", "Test2"]}
							></DashboardColumn>
							<DashboardColumn
								heading="Rejected"
								children={["Test"]}
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
