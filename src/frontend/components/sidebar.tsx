import { Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { ReactNode, useState } from "react";

interface SidebarSlots {
	sideElem: ReactNode;
	mainElem: ReactNode;
}

const Sidebar = ({ sideElem, mainElem }: SidebarSlots) => {
	let [sideBarWidth, setSideBarWidth] = useState(25);

	function toggleSideBar() {
		setSideBarWidth((sideBarWidth = sideBarWidth === 4 ? 25 : 4));
	}

	return (
		<Grid
			templateAreas={`"nav main"`}
			gridTemplateRows={"100% 1fr"}
			gridTemplateColumns={`${sideBarWidth}% 1fr`}
			height="calc(100% - 64px)"
			color="blackAlpha.700"
			fontWeight="bold"
			style={{
				transition: "all 0.5s",
			}}
		>
			<GridItem pl="2" bg="gray.100" area={"nav"} zIndex="9999">
				<Flex
					h="100%"
					flexDirection="column"
					justifyContent="space-between"
					alignItems="center"
				>
					{sideElem}
					<Button
						onClick={toggleSideBar}
						alignSelf="flex-end"
						transform="translate(50%)"
						bg="white"
						boxShadow={"base"}
					>
						{">"}
					</Button>
					<div></div>
				</Flex>
			</GridItem>
			<GridItem pl="2" area={"main"}>
				{mainElem}
			</GridItem>
		</Grid>
	);
};

export default Sidebar;
