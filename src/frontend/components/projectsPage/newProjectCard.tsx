import { AddIcon } from "@chakra-ui/icons";
import { Card, Icon, VStack, Text, LinkBox, LinkOverlay } from "@chakra-ui/react";

const NewProjectCard = () => {
	return (
		<LinkBox>
			<Card
				align="center"
				direction="row"
				justify="center"
				h="150pt"
				w="90%"
				bgColor="gray.300"
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
