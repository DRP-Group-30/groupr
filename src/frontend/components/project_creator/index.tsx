import { Flex } from "@chakra-ui/layout";
import CreatorCard from "./creator_card";

const ProjectCreator = () => {
	return (
		<Flex bg="white" align="center" justify="center" h="100%">
			<CreatorCard editMode></CreatorCard>
		</Flex>
	);
};

export default ProjectCreator;
