import React, { useEffect, useState } from "react";
import { Project } from "../../../backend";
import { getCurrentUser } from "../auth";
import { useFormik } from "formik";
import { Box, Flex, VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Checkbox } from "@chakra-ui/checkbox";
import { Button } from "@chakra-ui/button";
import { Select } from "@chakra-ui/select";
import { Image } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { MdUploadFile } from "react-icons/md";
import { getAllTags } from "../../../util/firebase";
import {
	AutoComplete,
	AutoCompleteCreatable,
	AutoCompleteInput,
	AutoCompleteItem,
	AutoCompleteList,
	AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";
import { nubWith, upperFirst, upperWords } from "../../../util";

type Fields = "fields";

const MAX_TAG_SUGGESTIONS = 5;

const ProjectCreator = () => {
	const [tempCoverImage, setTempCoverImage] = useState<File | null>(null);
	const [imageInputElem, setImageInputElem] = useState<HTMLInputElement | null>(null);

	const formik = useFormik<Project[Fields]>({
		initialValues: {
			name: "",
			contactInfo: "Project Contact Info (Shown on Match)",
			overview: "...",
			coverImage: null,
			tags: [],
			// Should there be a type for only the document data fields that are
			// editable/shown?
			interested: [],
			// Should `collaborators` be initialised to include the project creator?
			collaborators: [],
		},
		onSubmit: projectData => {
			// Add project to database
		},
	});

	const [allTags, setAllTags] = useState<string[]>([]);
	const initTagTable = async () => setAllTags(await getAllTags());

	useEffect(() => {
		initTagTable();
	}, []);

	return (
		<Flex bg="gray.100" align="center" justify="center" h="100vh">
			<Box bg="white" minWidth="400px" p={6} rounded="md">
				<Box
					backgroundColor="teal.400"
					height="210px"
					mt={-6}
					mx={-6}
					position="relative"
					roundedTop="md"
					overflow="hidden"
				>
					{tempCoverImage !== null && (
						<Image
							src={URL.createObjectURL(tempCoverImage)}
							objectFit="fill"
							boxSize="100%"
						></Image>
					)}
				</Box>
				<form onSubmit={formik.handleSubmit}>
					<VStack spacing={4} align="flex-start">
						<FormControl transform="translate(0, -50%)">
							<Flex justifyContent="right" alignItems="center">
								<input
									id="cover_image"
									name="coverImage"
									type="file"
									accept="image/*"
									onChange={event => {
										let files = event.currentTarget.files;
										if (files != null && files.length > 0) {
											setTempCoverImage(files[0]);
											formik.setFieldValue("coverImage", files[0]);
										}
									}}
									ref={input => setImageInputElem(input)}
									hidden
								/>
								<Button
									fontWeight="400"
									leftIcon={<MdUploadFile />}
									onClick={() => imageInputElem?.click()}
									boxShadow="lg"
								>
									{tempCoverImage ? "Change cover image" : "Upload cover image"}
								</Button>
							</Flex>
						</FormControl>
						<FormControl>
							<FormLabel>Project Name</FormLabel>
							<Input
								id="project_name"
								name="name"
								type="project name"
								variant="filled"
								onChange={formik.handleChange}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Overview</FormLabel>
							<Input
								id="overview"
								name="overview"
								type="overview"
								variant="filled"
								onChange={formik.handleChange}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Tags</FormLabel>
							<AutoComplete
								openOnFocus
								multiple
								creatable={true}
								maxSuggestions={MAX_TAG_SUGGESTIONS}
								onChange={(ts, i) => {}}
							>
								<AutoCompleteInput variant="filled">
									{({ tags }) =>
										nubWith(
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
											/>
										))
									}
								</AutoCompleteInput>
								<AutoCompleteList>
									{allTags.map(t => (
										<AutoCompleteItem
											key={t}
											value={t}
											textTransform="capitalize"
											_selected={{ bg: "whiteAlpha.50" }}
											_focus={{ bg: "whiteAlpha.100" }}
										>
											{t}
										</AutoCompleteItem>
									))}
									<AutoCompleteCreatable>
										{({ value }) => <span>New Tag: {value.toUpperCase()}</span>}
									</AutoCompleteCreatable>
								</AutoCompleteList>
							</AutoComplete>
						</FormControl>
						<Button type="submit" colorScheme="purple" width="full">
							Create Project
						</Button>
					</VStack>
				</form>
			</Box>
		</Flex>
	);
};

export default ProjectCreator;
