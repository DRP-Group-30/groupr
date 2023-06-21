import { HStack, Box, Button } from "@chakra-ui/react";
import React from "react";
import { Dispatch, SetStateAction } from "react";

export type sidebarProps = {
	showMatched: boolean;
	setShowMatched: Dispatch<SetStateAction<boolean>>;
};

const DBSidebar = ({ showMatched, setShowMatched }: sidebarProps) => {
	return (
		<HStack width="100%" padding={2}>
			<Button
				variant={showMatched ? "outline" : "solid"}
				colorScheme="groupr"
				size="md"
				width="90%"
				onClick={() => setShowMatched(true)}
			>
				Matched Collaborators
			</Button>
			<Button
				variant={!showMatched ? "outline" : "solid"}
				colorScheme="groupr"
				size="md"
				width="90%"
				onClick={() => setShowMatched(false)}
			>
				Pending
			</Button>
		</HStack>
	);
};

export default DBSidebar;
