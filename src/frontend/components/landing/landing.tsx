import { Icon } from "@chakra-ui/icons";
import { chakra, Stack, Button, Box, Image, Text } from "@chakra-ui/react";
import { MdExitToApp } from "react-icons/md";
import screenshot from "../../../assets/Screenshot from 2023-06-21 02-51-43.png";

export const Landing = () => {
	return (
		<Box backgroundColor="groupr.100" px={8} py={24} mx="auto" h="100%" overflow="scroll">
			<Box
				w={{
					base: "full",
					md: 11 / 12,
					xl: 9 / 12,
				}}
				mx="auto"
				textAlign={{
					base: "left",
					md: "center",
				}}
			>
				<chakra.h1
					mb={6}
					fontSize={{
						base: "4xl",
						md: "6xl",
					}}
					fontWeight="bold"
					lineHeight="none"
					letterSpacing={{
						base: "normal",
						md: "tight",
					}}
					color="groupr.700"
				>
					Unlock Creative Synergy.{" "}
					<Text
						display={"inline"}
						w="full"
						bgClip="text"
						padding="1px"
						bgGradient="linear(to-r, red.300, groupr.500, green.300)"
						filter="drop-shadow(0px 5px 20px #bfc5f8)"
						fontWeight="extrabold"
					>
						<br></br>Connect. Collaborate. Create.
					</Text>{" "}
				</chakra.h1>
				<chakra.p px={24} mb={6} fontSize="xl" color="groupr.700">
					Group'r: Your Gateway to Creative Collaboration. Explore, Connect, and Forge
					Meaningful Partnerships with Game Developers and Artists. Discover a Thriving
					Community to Bring Your Projects to Life.
				</chakra.p>
				<Stack
					direction={{
						base: "column",
						sm: "row",
					}}
					mb={{
						base: 4,
						md: 8,
					}}
					spacing={2}
					justifyContent={{
						sm: "left",
						md: "center",
					}}
				>
					<Button
						as="a"
						variant="outline"
						colorScheme="groupr"
						display="inline-flex"
						alignItems="center"
						justifyContent="center"
						href="/login"
						w={{
							base: "full",
							sm: "auto",
						}}
						mb={{
							base: 2,
							sm: 0,
						}}
						size="lg"
						cursor="pointer"
					>
						Sign In
						<Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
							<path
								fillRule="evenodd"
								d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</Icon>
					</Button>
					<Button
						as="a"
						colorScheme="groupr"
						display="inline-flex"
						alignItems="center"
						justifyContent="center"
						href="/signup"
						w={{
							base: "full",
							sm: "auto",
						}}
						mb={{
							base: 2,
							sm: 0,
						}}
						size="lg"
						cursor="pointer"
						rightIcon={<MdExitToApp />}
					>
						Sign Up
					</Button>
				</Stack>
			</Box>
			<Box w="auto" mx="auto" mt={20} textAlign="center">
				<Image w="full" rounded="lg" shadow="2xl" src={screenshot} />
			</Box>
		</Box>
	);
};
