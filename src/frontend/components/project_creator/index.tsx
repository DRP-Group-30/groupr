import React, { useEffect, useState } from "react";
import { Project, addProject } from "../../../backend";
import { getCurrentUser } from "../auth";
import { useFormik } from "formik";
import { Box, Flex, VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Checkbox } from "@chakra-ui/checkbox";
import { Button } from "@chakra-ui/button";
import { Select } from "@chakra-ui/select";
import {
	Image,
	InputGroup,
	InputLeftElement,
	Radio,
	RadioGroup,
	Stack,
	Textarea,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { MdEmail, MdLink, MdUploadFile } from "react-icons/md";
import { Fields, getAllTags, storeImg } from "../../../util/firebase";
import {
	AutoComplete,
	AutoCompleteCreatable,
	AutoCompleteInput,
	AutoCompleteItem,
	AutoCompleteList,
	AutoCompleteTag,
	ItemTag,
} from "@choc-ui/chakra-autocomplete";
import { inlineLog, nubWith, upperFirst, upperWords } from "../../../util";
import { ContactMethod } from "./types";
import discord from "../../static/discord.png";
import slack from "../../static/slack.png";
import whatsapp from "../../static/whatsapp.png";

const contactIcons = {
	discord: discord,
	slack: slack,
	whatsapp: whatsapp,
};
const MAX_TAG_SUGGESTIONS = 3;

const ProjectCreator = () => {
	const [tempCoverImage, setTempCoverImage] = useState<File | null>(null);
	const [imageInputElem, setImageInputElem] = useState<HTMLInputElement | null>(null);
	const [contactMethod, setContactMethod] = useState<ContactMethod>(ContactMethod.EMAIL);

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
		onSubmit: async projectData => {
			if (tempCoverImage !== null) {
				const file = await storeImg(tempCoverImage);
				projectData.coverImage = file;
			}
			addProject(projectData);
		},
	});

	const [allTags, setAllTags] = useState<string[]>([]);
	const initTagTable = async () => setAllTags(inlineLog(await getAllTags()));
	const [tempTags, setTempTags] = useState<ItemTag[]>([]);

	HTMLElement.prototype.scrollIntoView = function () {};

	useEffect(() => {
		initTagTable();
	}, []);

	return (
		<Flex bg="gray.100" align="center" justify="center" h="100%">
			<Box bg="white" minWidth="400px" p={6} rounded="md">
				<Box
					backgroundColor="gray.200"
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
									colorScheme="teal"
									fontWeight="400"
									leftIcon={<MdUploadFile />}
									onClick={() => imageInputElem?.click()}
									boxShadow="lg"
								>
									{tempCoverImage ? "Change image" : "Upload cover image"}
								</Button>
							</Flex>
						</FormControl>
						<FormControl marginTop="-36px">
							<FormLabel>Project Name</FormLabel>
							<Input
								id="project_name"
								name="name"
								type="text"
								variant="filled"
								onChange={formik.handleChange}
								placeholder="Give your project a catchy name..."
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Overview</FormLabel>
							<Textarea
								id="overview"
								name="overview"
								variant="filled"
								onChange={formik.handleChange}
								placeholder="A short pitch for your project..."
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Tags</FormLabel>
							<Flex
								maxWidth="600px"
								flexWrap="wrap"
								marginBottom={tempTags.length > 0 ? "3px" : "0px"}
							>
								{nubWith(
									tempTags.map((tag, tid) => ({
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
										colorScheme="teal"
										marginRight="3px"
										marginBottom="6px"
									/>
								))}
							</Flex>
							<AutoComplete
								openOnFocus
								multiple
								creatable={true}
								onReady={({ tags }) => {
									setTempTags(tags);
								}}
							>
								<AutoCompleteInput
									placeholder="Search for tags that describe it..."
									variant="filled"
								></AutoCompleteInput>
								<AutoCompleteList height="200px" overflow="scroll">
									{allTags
										.filter(t => !tempTags.map(tt => tt.label).includes(t))
										.map(t => (
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
						<FormControl>
							<FormLabel>Contact Method</FormLabel>
							<RadioGroup
								value={contactMethod}
								onChange={s => setContactMethod(s as ContactMethod)}
							>
								<Stack direction="row" spacing={4}>
									<Radio
										id="contactMethodEmail"
										name="contactMethod"
										value={ContactMethod.EMAIL}
									>
										Email
									</Radio>
									<Radio
										id="contactMethodURL"
										name="contactMethod"
										value={ContactMethod.URL}
									>
										Invite Link
									</Radio>
								</Stack>
							</RadioGroup>
						</FormControl>
						{contactMethod === ContactMethod.EMAIL ? (
							<FormControl>
								<FormLabel>Email Address</FormLabel>
								<InputGroup>
									<InputLeftElement>
										<MdEmail fontSize="24px"></MdEmail>
									</InputLeftElement>
									<Input
										id="contactEmail"
										name="contactInfo"
										type="email"
										variant="filled"
										onChange={formik.handleChange}
										placeholder="Email address for matched users to use..."
									/>
								</InputGroup>
							</FormControl>
						) : (
							<FormControl>
								<FormLabel>Contact URL</FormLabel>
								<InputGroup>
									<InputLeftElement>
										{Object.entries(contactIcons)
											.map(([k, v]) =>
												formik.values.contactInfo.includes(k) ? (
													<Image
														key="k"
														maxWidth="24px"
														maxHeight="24px"
														src={v}
													></Image>
												) : null,
											)
											.reduce((l, r) => l ?? r) ?? (
											<MdLink fontSize="24px"></MdLink>
										)}
									</InputLeftElement>
									<Input
										id="contactURL"
										name="contactInfo"
										type="url"
										variant="filled"
										onChange={formik.handleChange}
										placeholder="E.g. Discord/Slack/WhatsApp Invite..."
									/>
								</InputGroup>
							</FormControl>
						)}
						<Button type="submit" colorScheme="teal" width="full">
							{" "}
							Create Project
						</Button>
					</VStack>
				</form>
			</Box>
		</Flex>
	);
};

export default ProjectCreator;
