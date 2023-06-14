import { VStack, Card, Button } from "@chakra-ui/react";
import React from "react";
import { Dispatch, SetStateAction } from "react";

export type sidebarProps = {
	setShowMatched: Dispatch<SetStateAction<boolean>>;
};

const DBSidebar = ({ setShowMatched }: sidebarProps) => {
	return (
		<Card w="90%" p="2">
			<VStack>
				<Button size="md" width="90%" onClick={() => setShowMatched(true)}>
					Matched Projects
				</Button>
				<Button size="md" width="90%" onClick={() => setShowMatched(false)}>
					Pending Projects
				</Button>
			</VStack>
		</Card>
	);
};

export default DBSidebar;
