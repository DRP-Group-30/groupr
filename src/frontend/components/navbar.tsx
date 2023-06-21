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
	MenuButton,
	MenuList,
	MenuItem,
	Menu,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import logo from "../../assets/LogoWName.svg";
import { useAuth } from "../../context/AuthContext";

const Links = ["Dashboard", "Find Projects", "Your Projects"];
const LinksRoutes: { [key: string]: string } = {
	Dashboard: "/Dashboard",
	"Find Projects": "/finder",
	"Your Projects": "/projects",
};

const NavLink = ({ children }: { children: string }) => (
	<Link
		px={2}
		py={1}
		rounded={"md"}
		color="groupr.100"
		_hover={{
			textDecoration: "none",
		}}
		as={RouteLink}
		to={LinksRoutes[children]}
	>
		{children}
	</Link>
);

const Navbar = () => {
	const { isOpen } = useDisclosure();
	const { currentUser, logout } = useAuth();
	const isLoggedIn = !!currentUser;
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Box backgroundColor="groupr.700" px={4}>
				<Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
					<HStack spacing={8} alignItems={"center"} w="80%">
						<LinkBox minH="100%" minW="80pt">
							<LinkOverlay as={RouteLink} to="/">
								<Image
									src={logo}
									maxH="36pt"
									objectFit="scale-down"
									mt="-3pt"
									mr="-4pt"
								/>
							</LinkOverlay>
						</LinkBox>
						{isLoggedIn ? (
							<HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
								{Links.map(link => (
									<NavLink key={link}>{link}</NavLink>
								))}
							</HStack>
						) : null}
					</HStack>
					{isLoggedIn ? (
						<Menu>
							<MenuButton
								as={Button}
								rounded={"full"}
								variant={"link"}
								cursor={"pointer"}
								minW={0}
							>
								<Avatar
									size={"md"}
									colorScheme="groupr"
									showBorder
									src={
										"https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
									}
								/>
							</MenuButton>
							<MenuList>
								<MenuItem as="a" href={`/profile/${currentUser.uid}`}>
									Your Profile
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleLogout();
									}}
								>
									Log Out
								</MenuItem>
							</MenuList>
						</Menu>
					) : (
						<Flex alignItems={"center"}>
							<LinkBox>
								<LinkOverlay href="/login">
									<Button
										variant="outline"
										borderColor="groupr.400"
										color="groupr.400"
										_hover={{
											backgroundColor: "none",
										}}
										size="sm"
										mr={4}
										cursor="pointer"
									>
										Sign In
									</Button>
								</LinkOverlay>
							</LinkBox>
							<LinkBox>
								<LinkOverlay href="/signup">
									<Button
										variant="solid"
										colorScheme="groupr"
										size="sm"
										cursor="pointer"
									>
										Sign Up
									</Button>
								</LinkOverlay>
							</LinkBox>
						</Flex>
					)}
				</Flex>
			</Box>
		</>
	);
};

export default Navbar;
