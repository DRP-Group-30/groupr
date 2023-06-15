import {
	Box,
	Flex,
	Avatar,
	HStack,
	IconButton,
	Button,
	Image,
	Link,
	useDisclosure,
	useColorModeValue,
	Stack,
	LinkBox,
	LinkOverlay,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { Link as RouteLink } from "react-router-dom";
import logo from "../../assets/LogoWName.svg";

const Links = ["Dashboard", "Find Projects", "Sign In", "Sign Up"];
const LinksRoutes: { [key: string]: string } = {
	Dashboard: "/Dashboard",
	"Find Projects": "/finder",
	"Sign In": "/login",
	"Sign Up": "/signup",
};

const NavLink = ({ children }: { children: string }) => (
	<Link
		px={2}
		py={1}
		rounded={"md"}
		_hover={{
			textDecoration: "none",
			bg: useColorModeValue("gray.200", "gray.700"),
		}}
		as={RouteLink}
		to={LinksRoutes[children]}
	>
		{children}
	</Link>
);

const Navbar = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Box
				bg={useColorModeValue("gray.100", "gray.900")}
				px={4}
				outlineColor="gray.100"
				outline="1px solid"
			>
				<Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
					<HStack spacing={8} alignItems={"center"} w="80%">
						<LinkBox minH="100%" minW="80pt">
							<LinkOverlay as={RouteLink} to="/">
								<Image
									src={logo}
									h="100%"
									objectFit="scale-down"
									mt="-3pt"
									mr="-4pt"
								/>
							</LinkOverlay>
						</LinkBox>

						<HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
							{Links.map(link => (
								<NavLink key={link}>{link}</NavLink>
							))}
						</HStack>
					</HStack>
					<Flex alignItems={"center"}>
						<Button
							variant={"solid"}
							colorScheme={"teal"}
							size={"sm"}
							mr={4}
							leftIcon={<AddIcon />}
						>
							Action
						</Button>
						<LinkBox>
							<LinkOverlay href="/profile">
								<Avatar
									size={"sm"}
									src={
										"https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
									}
								/>
							</LinkOverlay>
						</LinkBox>
					</Flex>
				</Flex>

				{isOpen ? (
					<Box pb={4} display={{ md: "none" }}>
						<Stack as={"nav"} spacing={4}>
							{Links.map(link => (
								<NavLink key={link}>{link}</NavLink>
							))}
						</Stack>
					</Box>
				) : null}
			</Box>
		</>
	);
};

export default Navbar;
