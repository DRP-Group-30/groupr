import { AddIcon } from "@chakra-ui/icons";
import { Card, Icon, VStack, Text, LinkBox, LinkOverlay, Flex } from "@chakra-ui/react";

const NewProjectCard = () => {
	return (
		<LinkBox>
			<Flex
				alignItems="center"
				flexDirection="row"
				justifyContent="center"
				minH="400px"
				h="100%"
				w="100%"
				_hover={{
					background: "#fffaf377",
					boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
					backdropFilter: "blur(5px)",
					WebkitBackdropFilter: "blur(5px)",
					border: "2px solid rgba(255, 255, 255, 0.5)",
				}}
				transition="all 0.1s"
				rounded="lg"
			>
				<LinkOverlay href="projects/edit">
					<VStack>
						<Icon as={AddIcon} w="24px" h="24px" />
						<Text>Make New Project</Text>
					</VStack>
				</LinkOverlay>
			</Flex>
		</LinkBox>
	);
};

export default NewProjectCard;
