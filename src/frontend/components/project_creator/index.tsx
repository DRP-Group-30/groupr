import { Flex } from "@chakra-ui/layout";
import CreatorCard from "./creator_card";

const ProjectCreator = () => {
	return (
		<Flex bg="white" align="center" justify="center" h="100%" paddingTop="50px">
			<CreatorCard editMode project={null}></CreatorCard>
		</Flex>
	);
};

export default ProjectCreator;
