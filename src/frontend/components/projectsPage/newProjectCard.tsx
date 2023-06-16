import { AddIcon } from "@chakra-ui/icons";
import { Card, Icon, VStack, Text, LinkBox, LinkOverlay } from "@chakra-ui/react";

const NewProjectCard = () => {
	return (
		<LinkBox>
			<Card
				align="center"
				direction="row"
				justify="center"
				h="100%"
				w="100%"
				boxShadow="none"
				backgroundColor="gray.100"
				_hover={{ backgroundColor: "gray.300" }}
				transition="all 0.1s"
				border="dashed"
				borderColor={"gray.400"}
			>
				<LinkOverlay href="projects/edit">
					<VStack>
						<Icon as={AddIcon} w="24px" h="24px" />
						<Text>Make New Project</Text>
					</VStack>
				</LinkOverlay>
			</Card>
		</LinkBox>
	);
};

export default NewProjectCard;
