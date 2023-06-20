import { StarIcon } from "@chakra-ui/icons";
import { HStack, Text } from "@chakra-ui/react";

const StarRating = ({ stars, ratings }: { stars: number; ratings: number }) => {
	return (
		<HStack color="groupr.500" justify="center" align="center">
			{[...Array(stars)].map(k => (
				<StarIcon key={k}></StarIcon>
			))}
			<Text color="groupr.700" fontSize="sm" textAlign="center">
				({ratings})
			</Text>
		</HStack>
	);
};

export default StarRating;
