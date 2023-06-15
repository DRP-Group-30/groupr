import { TimeIcon } from "@chakra-ui/icons";
import {
	Grid,
	GridItem,
	VStack,
	Image,
	Box,
	Flex,
	Text,
	HStack,
	Container,
	Card,
	CardBody,
	CardHeader,
	Heading,
	StackDivider,
	Tag,
	Button,
	TagLeftIcon,
	TagLabel,
	Avatar,
} from "@chakra-ui/react";

import { MdAttachMoney } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";

const ProfileHeader = () => {
	const { currentUser, logout } = useAuth();
	const isLoggedIn = !!currentUser;

	return (
		<Container bgColor="ffffff00" p={4} w="100%" alignItems="center" justifyContent="center">
			<Flex
				width="100%"
				shadow="lg"
				rounded="lg"
				bg="#ffffff"
				_dark={{
					bg: "gray.800",
				}}
				mb={4}
				direction="column"
				alignItems="center"
				justifyContent="center"
			>
				<Box
					bg="#ffffff"
					_dark={{
						bg: "#3e3e3e",
					}}
					style={{
						backgroundImage: `url(https://picsum.photos/seed/${currentUser?.uid}/1200)`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
					height="100%"
					width="100%"
					roundedTop="lg"
					px={8}
					display="flex"
					alignItems="left"
				>
					<Avatar
						src={currentUser?.photoURL ?? ""}
						name={currentUser?.displayName ?? undefined}
						borderRadius="full"
						borderWidth="5px"
						size="2xl"
						shadow="lg"
						transform="translate(0, 50%)"
					/>
				</Box>
				<Box
					gridColumn="span 8"
					p={8}
					width="full"
					height="full"
					borderRadius="lg"
					textAlign="left"
					mt={10}
				>
					<Text
						fontSize="4xl"
						fontWeight="bold"
						color="gray.800"
						_dark={{
							color: "white",
						}}
					>
						{currentUser?.displayName}
					</Text>
					<HStack
						spacing={3}
						color="gray.800"
						_dark={{
							color: "gray.200",
						}}
					>
						<Text
							fontSize="2xl"
							fontWeight="bold"
							color="gray.800"
							_dark={{
								color: "gray.200",
							}}
						>
							He/Him
						</Text>
					</HStack>
				</Box>
			</Flex>
		</Container>
	);
};


const ProfileSide = () => {
	return (
		<VStack>
			<ProfileHeader></ProfileHeader>
			<Card rounded="lg" m="4" marginTop="-8" shadow="lg">
				<CardBody>
					Passionate game developer with a flair for immersive worlds and captivating
					storytelling. Crafting interactive experiences that blur the line between
					reality and imagination. Constantly pushing boundaries, fueled by creativity and
					a love for all things gaming. #GameDev #IndieDev
				</CardBody>
			</Card>
		</VStack>
	);
};

const tagList: string[] = ["C++", "Java", "Python", "Unity", "Unreal Engine", "C#", "JavaScript"];

const ProfileBody = () => {
	return (
		<VStack w="100%">
			<Card w="100%" bgColor="gray.100">
				<CardHeader mb="-15pt" fontSize="2xl" fontWeight="bold">
					Roles
				</CardHeader>
				<CardBody>
					<VStack minW="100%">
						<Card w="100%">
							<CardHeader>
								<HStack alignItems="center" mb="-20pt" spacing="8pt">
									<Heading size="md">Programmer</Heading>
									<Button
										leftIcon={<TimeIcon />}
										colorScheme="teal"
										variant="outline"
										size="sm"
									>
										Working Hours
									</Button>
									<Tag variant="outline" colorScheme="yellow" size="lg">
										<TagLeftIcon as={MdAttachMoney}></TagLeftIcon>
										<TagLabel>$10/Hour</TagLabel>
									</Tag>
								</HStack>
							</CardHeader>
							<CardBody>
								<HStack
									divider={
										<StackDivider
											borderLeftWidth="2pt"
											borderColor="gray.400"
										/>
									}
									spacing={4}
								>
									<Text w="75%" alignSelf="flex-start">
										Experienced game developer skilled in C++, Java, and Python.
										Specializing in game mechanics implementation, performance
										optimization, and efficient code architecture. Proficient in
										UI design and integration of cutting-edge technologies.
									</Text>
									<Flex
										wrap="wrap"
										direction="row"
										alignContent="flex-start"
										justifyContent="flex-start"
										alignItems="flex-start"
										alignSelf="flex-start"
										w="25%"
									>
										{tagList.map(tag => (
											<Tag variant="solid" colorScheme="teal" margin="2px">
												{tag}
											</Tag>
										))}
									</Flex>
								</HStack>
							</CardBody>
						</Card>
						<Card>Artist</Card>
						<Card>Designer</Card>
					</VStack>
				</CardBody>
			</Card>
		</VStack>
	);
};

const ProfilePage = () => {
	return (
		<Grid gridTemplateColumns={"30% 1fr"} h="100%">
			<GridItem bgColor="gray.100">
				<ProfileSide />
			</GridItem>
			<GridItem p="10pt">
				<ProfileBody />
			</GridItem>
		</Grid>
	);
};

export default ProfilePage;
