import {
	Box,
	Card,
	Container,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	SimpleGrid,
	Tag,
	Text,
} from "@chakra-ui/react";
import NewProjectCard from "./newProjectCard";
import { DocumentReference, getDocs, collection, getDoc } from "firebase/firestore";
import { Firebase } from "../../../backend/firebase";
import { useEffect, useState } from "react";
import { Project, User } from "../../../backend";
import CreatorCard from "../project_creator/creator_card";
import { getCurrentUser } from "../auth";
import Sidebar from "../sidebar";
import {
	AutoCompleteTag,
	AutoComplete,
	AutoCompleteInput,
	AutoCompleteList,
	AutoCompleteItem,
	AutoCompleteCreatable,
	ItemTag,
} from "@choc-ui/chakra-autocomplete";
import { nubWith, nub, or, inlineLog } from "../../../util";
import { getAllTags } from "../../../util/firebase";

const ProjectSelector = ({ filterTags }: { filterTags: String[] }) => {
	let [projectRefs, setProjectRefs] = useState<DocumentReference[]>([]);
	let [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		pollProjects().then(getProjects);
	}, []);

	async function pollProjects() {
		const userSnapshot = await getCurrentUser();

		const user: User["fields"] = userSnapshot.data() as User["fields"];
		const projects = user.ownProjects;
		setProjectRefs((projectRefs = projects));
	}

	async function getProjects() {
		const snaps = await Promise.all(projectRefs.map((ref: DocumentReference) => getDoc(ref)));
		setProjects((projects = snaps.map(doc => ({ id: doc.id, fields: doc.data() } as Project))));
	}

	function filterMatches(tags: String[]): number {
		return inlineLog(tags.filter(t => filterTags.includes(t)).length);
	}

	return (
		<Container
			className="GlassMorphic"
			maxW="100%"
			w="98%"
			height="calc(100% - 32px)"
			overflowY="scroll"
			marginTop="10pt"
			marginBottom="10pt"
			centerContent
			borderRadius="xl"
			color="groupr.700"
		>
			<Heading mt="32px" mb="16px">
				{"Your Projects"}
			</Heading>
			<SimpleGrid width="100%" columns={3} spacing={8} p="10pt">
				<NewProjectCard />
				{projects
					.sort((p1, p2) => filterMatches(p2.fields.tags) - filterMatches(p1.fields.tags))
					.map(p => (
						<Box
							style={{
								opacity: `${
									filterTags.length > 0 && filterMatches(p.fields.tags) === 0
										? "0.5"
										: "1"
								}`,
								transition: "all 0.1s",
							}}
							_hover={{
								opacity: "1 !important",
							}}
						>
							<CreatorCard key={p.id} editMode={false} project={p}></CreatorCard>
						</Box>
					))}
			</SimpleGrid>
		</Container>
	);
};

const ProjectPage = () => {
	const [tags, setTags] = useState<ItemTag[]>([]);
	const [allTags, setAllTags] = useState<string[]>([]);
	const initTagTable = async () => setAllTags(inlineLog(await getAllTags()));

	useEffect(() => {
		initTagTable();
	}, []);

	return (
		<Sidebar
			sideElem={
				<Card p={4} width="100%" mr={2} backgroundColor="gray.100" boxShadow="lg">
					<Box width="100%" pr={2}>
						<FormControl>
							<FormLabel color="groupr.700" fontWeight="bold">
								Filter by tags
							</FormLabel>
							<Flex maxWidth="600px" flexWrap="wrap">
								{nubWith(
									tags.map((tag, tid) => ({
										tid: tid,
										onRemove: tag.onRemove,
										label: (tag.label as string).toUpperCase(),
									})),
									t => t.label,
								).map(({ label, tid, onRemove }) => (
									<AutoCompleteTag
										key={tid}
										label={label}
										onRemove={onRemove}
										variant="solid"
										colorScheme="groupr"
										marginRight="3px"
										marginBottom="6px"
									/>
								))}
							</Flex>
							<AutoComplete
								openOnFocus
								multiple
								onReady={({ tags }) => {
									setTags(tags);
								}}
							>
								<AutoCompleteInput
									placeholder="Search for tags..."
									backgroundColor="white"
									colorScheme="groupr"
									borderColor="groupr.500"
								></AutoCompleteInput>
								<AutoCompleteList height="200px" width="100%" overflow="scroll">
									{allTags
										.filter(t => !tags.map(tt => tt.label).includes(t))
										.map(t => (
											<AutoCompleteItem
												key={t}
												value={t}
												textTransform="capitalize"
												_selected={{
													bg: "whiteAlpha.50",
												}}
												_focus={{
													bg: "whiteAlpha.100",
												}}
											>
												{t}
											</AutoCompleteItem>
										))}
								</AutoCompleteList>
							</AutoComplete>
						</FormControl>
					</Box>
				</Card>
			}
			mainElem={<ProjectSelector filterTags={tags.map(t => t.label)}></ProjectSelector>}
		/>
	);
};

export default ProjectPage;
