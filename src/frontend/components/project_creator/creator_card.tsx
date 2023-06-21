import {
	Box,
	VStack,
	FormControl,
	Flex,
	Button,
	Editable,
	EditablePreview,
	Image,
	Input,
	EditableInput,
	Textarea,
	EditableTextarea,
	FormLabel,
	RadioGroup,
	Stack,
	Radio,
	Icon,
	Link,
	LinkBox,
	Text,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	SliderMark,
	Tag,
	HStack,
} from "@chakra-ui/react";
import {
	AutoCompleteTag,
	AutoComplete,
	AutoCompleteInput,
	AutoCompleteList,
	AutoCompleteItem,
	AutoCompleteCreatable,
	ItemTag,
} from "@choc-ui/chakra-autocomplete";
import { MdUploadFile, MdEmail, MdLink } from "react-icons/md";
import { nubWith, nub, inlineLog, or, inlineLogPre } from "../../../util";
import { ContactMethod } from "./types";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import {
	Project,
	Skill,
	Skillset,
	User,
	addProject,
	getDefaultRole,
	updateProject,
} from "../../../backend";
import { Fields, getImg, storeImg, getAllTags } from "../../../util/firebase";

import discord from "../../static/discord.png";
import slack from "../../static/slack.png";
import whatsapp from "../../static/whatsapp.png";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { Firebase } from "../../../backend/firebase";
import { getCurrentUser, getCurrentUserRef } from "../auth";
import { emptyIRM } from "../../../backend/default_database";

const contactIcons = {
	discord: discord,
	slack: slack,
	whatsapp: whatsapp,
};

const CreatorCard = ({ editMode, project }: { editMode: boolean; project: Project | null }) => {
	const [tempCoverImage, setTempCoverImage] = useState<File | null>(null);
	const [imageInputElem, setImageInputElem] = useState<HTMLInputElement | null>(null);
	const [contactMethod, setContactMethod] = useState<ContactMethod>(ContactMethod.EMAIL);
	let [coverImageURL, setCoverImageURL] = useState<string>("");

	const navigate = useNavigate();
	const formik = useFormik<Project[Fields]>({
		initialValues: project
			? project.fields
			: {
					name: "Your Project Name",
					contactInfo: "Project Contact Details",
					overview:
						"Your project's overview - a short sales pitch to explain what your project is and why users should join.",
					coverImage: null,
					tags: [],
					// Should there be a type for only the document data fields that are
					// editable/shown?
					irm: emptyIRM(),
					// Should `collaborators` be initialised to include the project creator?
					creator: getCurrentUserRef(),
					roles: [],
			  },
		onSubmit: async projectData => {
			// DATA VALIDATION
			if (
				projectData.name === "" ||
				projectData.overview === "" ||
				projectData.contactInfo === "" ||
				or(projectData.roles.map(r => r.skillset.length === 0))
			)
				return;

			if (editMode) {
				if (tempCoverImage !== null) {
					const file = await storeImg(tempCoverImage);
					projectData.coverImage = file;
				}

				if (project === null) {
					let currentUser = await getCurrentUser();
					let userData = currentUser.data() as User[Fields];

					let id = await addProject(projectData);
					let projects = userData.ownProjects;
					projects.push(doc(Firebase.db, "projects", id));

					await updateDoc(getCurrentUserRef(), {
						ownProjects: projects,
					});
				} else {
					await updateProject(project.id, projectData);
				}
				navigate("/projects", { replace: false });
			} else {
				navigate(`/projects/edit/${project?.id}`, { replace: false });
			}
		},
	});

	useEffect(() => {
		initTagTable();
		if (project === null) return;
		formik.setValues(project.fields).then(() => {
			if (project.fields.coverImage !== null) {
				getImg(project.fields.coverImage).then(url => {
					setCoverImageURL((coverImageURL = url));
				});
			}
		});
		if (project.fields.contactInfo.startsWith("http")) {
			setContactMethod(ContactMethod.URL);
		}
	}, [project]);

	function submitName() {
		if (formik.values.name.trim().length === 0)
			formik.setFieldValue("name", formik.initialValues.name);
	}

	function submitOverview() {
		if (formik.values.overview.trim().length === 0)
			formik.setFieldValue("overview", formik.initialValues.overview);
	}

	function submitContactInfo() {
		if (formik.values.contactInfo.trim().length === 0)
			formik.setFieldValue("contactInfo", formik.initialValues.contactInfo);
	}

	const [allTags, setAllTags] = useState<string[]>([]);
	const initTagTable = async () => setAllTags(inlineLog(await getAllTags()));
	const [tempTags, setTempTags] = useState<ItemTag[]>([]);
	const [tempSkills, setTempSkills] = useState<ItemTag[][]>([]);

	HTMLElement.prototype.scrollIntoView = function () {};

	return (
		<Box
			color="groupr.700"
			maxWidth="600px"
			bg="white"
			minWidth="400px"
			p={6}
			rounded="md"
			boxShadow="2xl"
		>
			<Box
				backgroundColor="gray.200"
				height="210px"
				mt={-6}
				mx={-6}
				position="relative"
				roundedTop="md"
				overflow="hidden"
			>
				{coverImageURL !== "" && (
					<Image src={coverImageURL} objectFit="fill" boxSize="100%"></Image>
				)}
			</Box>
			<form style={{ height: "calc(100% - 210px + 1.5rem)" }} onSubmit={formik.handleSubmit}>
				<Flex
					height="100%"
					flexDirection="column"
					justifyContent="space-between"
					alignItems="center"
				>
					<VStack width="100%" spacing={4} marginBottom={4}>
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
											setCoverImageURL(
												(coverImageURL = URL.createObjectURL(files[0])),
											);
										}
									}}
									ref={input => setImageInputElem(input)}
									hidden
								/>
								{editMode && (
									<Button
										colorScheme="groupr"
										fontWeight="400"
										leftIcon={<MdUploadFile />}
										onClick={() => imageInputElem?.click()}
										boxShadow="lg"
									>
										{tempCoverImage ? "Change image" : "Upload cover image"}
									</Button>
								)}
							</Flex>
						</FormControl>
						<FormControl marginTop={editMode ? "-24px" : "0px"}>
							<Editable
								value={formik.values.name}
								onSubmit={submitName}
								onCancel={submitName}
								isDisabled={!editMode}
							>
								<Flex
									maxWidth="600px"
									flexWrap="wrap"
									marginBottom={tempTags.length > 0 ? "3px" : "0px"}
								>
									<EditablePreview
										className={editMode ? "EditPreview" : ""}
										fontSize="2xl"
										fontWeight="bold"
										cursor={editMode ? "pointer" : ""}
									/>
									<Input
										as={EditableInput}
										id="project_name"
										name="name"
										type="text"
										variant="flushed"
										onChange={formik.handleChange}
										fontSize="2xl"
										fontWeight="bold"
									/>
								</Flex>
							</Editable>
						</FormControl>
						<FormControl marginTop={editMode ? "0px" : "-12px"}>
							<Editable
								value={formik.values.overview}
								onSubmit={submitOverview}
								onCancel={submitOverview}
								isDisabled={!editMode}
							>
								<EditablePreview
									maxWidth="600px"
									className={editMode ? "EditPreview" : ""}
									cursor={editMode ? "pointer" : ""}
									lineHeight="5"
								/>
								<Textarea
									as={EditableTextarea}
									maxWidth="600px"
									id="overview"
									name="overview"
									variant="filled"
									onChange={formik.handleChange}
								/>
							</Editable>
						</FormControl>
						{/* <VStack marginBottom="6px">
							{formik.values.roles.map((x, i) => (
								<Box bg="gray.100" minWidth="600px" rounded="md" key={i}>
									<Editable value={x.name}>
										<EditablePreview
											className={editMode ? "EditPreview" : ""}
											fontSize="2xl"
											fontWeight="bold"
											cursor={editMode ? "pointer" : ""}
										/>
										<Input
											as={EditableInput}
											id="role_name"
											name={`roles[${i}].name`}
											type="text"
											variant="flushed"
											onChange={formik.handleChange}
											fontSize="2xl"
											fontWeight="bold"
										/>
									</Editable>
									<Slider
										defaultValue={0}
										min={0}
										max={100}
										step={1}
										height="30px"
										onChange={v => {
											formik.setFieldValue(`roles[${i}].approxPay`, v);
										}}
									>
										<SliderTrack bg="gold.100" mt="5">
											<Box position="relative" right={10}></Box>
											<SliderFilledTrack bg="tomato" />
										</SliderTrack>
										<SliderMark
											value={x.approxPay}
											textAlign="center"
											bg="orange.500"
											color="white"
											mt="-5"
											ml="-5"
											w="15"
										>
											{x.approxPay} $/hr
										</SliderMark>
										<SliderThumb boxSize={6} mt="5" />
									</Slider>
									<Flex
										maxWidth="600px"
										flexWrap="wrap"
										marginBottom={
											(tempSkills[i]?.length ?? 0) > 0 ? "3px" : "0px"
										}
									>
										{(tempSkills[i] ?? []).map(({ label, onRemove }, i) => (
											<AutoCompleteTag
												key={i}
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
										creatable={false}
										onReady={({ tags }) => {
											tempSkills[i] = tags;
											setTempSkills(tempSkills);
										}}
										onChange={(ts: string[]) => {
											const curRoles = formik.values.roles;
											curRoles[i].skillset = ts as Skillset;
											formik.setFieldValue("roles", curRoles);
										}}
									>
										<AutoCompleteInput
											placeholder="Search for skills that this role requires..."
											backgroundColor="white"
										></AutoCompleteInput>
										<AutoCompleteList height="200px" overflow="scroll">
											{inlineLog(Object.values(Skill)).map(t => (
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
										</AutoCompleteList>
									</AutoComplete>
								</Box>
							))}
							{editMode && (
								<LinkBox
									bgColor="gray.100"
									border="dashed"
									width="100%"
									rounded="md"
									onClick={() =>
										formik.setFieldValue(
											"roles",
											formik.values.roles.concat([
												getDefaultRole(formik.values.roles.length),
											]),
										)
									}
									cursor="pointer"
									marginBottom="6px"
								>
									<VStack padding="6px">
										<Icon as={AddIcon} w="24px" h="24px" />
										<Text>Add a role to tell us who you're looking for...</Text>
									</VStack>
								</LinkBox>
							)}
						</VStack> */}

						{(editMode || formik.values.tags.length !== 0) && (
							<Box
								backgroundColor="gray.100"
								width="100%"
								borderRadius="md"
								padding="16px"
							>
								<FormControl>
									<FormLabel fontWeight="bold">
										Tags{" "}
										{editMode && "- use these to describe your project's theme"}
									</FormLabel>
									<Flex
										maxWidth="600px"
										flexWrap="wrap"
										marginBottom={
											editMode
												? tempTags.length > 0
													? "3px"
													: "0px"
												: "-6px"
										}
									>
										{nubWith(
											tempTags.map((tag, tid) => ({
												tid: tid,
												onRemove: tag.onRemove,
												label: (tag.label as string).toUpperCase(),
											})),
											t => t.label,
										).map(({ label, tid, onRemove }) =>
											editMode ? (
												<AutoCompleteTag
													key={tid}
													label={label}
													onRemove={onRemove}
													variant="solid"
													colorScheme="groupr"
													marginRight="3px"
													marginBottom="6px"
												/>
											) : (
												<Tag
													key={tid}
													variant="solid"
													colorScheme="groupr"
													marginRight="3px"
													marginBottom="6px"
												>
													{label}
												</Tag>
											),
										)}
									</Flex>
									<AutoComplete
										openOnFocus
										multiple
										creatable={true}
										onReady={({ tags }) => {
											setTempTags(tags);
										}}
										onChange={(ts: string[]) => {
											formik.setFieldValue(
												"tags",
												nub(ts.map(t => t.toUpperCase())),
												false,
											);
										}}
										values={formik.values.tags}
									>
										{editMode && (
											<>
												<AutoCompleteInput
													placeholder="Search for tags..."
													backgroundColor="white"
												></AutoCompleteInput>
												<AutoCompleteList height="200px" overflow="scroll">
													{allTags
														.filter(
															t =>
																!tempTags
																	.map(tt => tt.label)
																	.includes(t),
														)
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
													<AutoCompleteCreatable>
														{({ value }) => (
															<span>
																New Tag: {value.toUpperCase()}
															</span>
														)}
													</AutoCompleteCreatable>
												</AutoCompleteList>
											</>
										)}
									</AutoComplete>
								</FormControl>
							</Box>
						)}
					</VStack>
					<VStack width="100%" spacing={2}>
						{editMode && (
							<FormControl>
								<FormLabel>Contact Method</FormLabel>
								<RadioGroup
									colorScheme="groupr"
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
						)}
						<FormControl>
							<Stack direction="row" alignItems="center">
								{contactMethod === ContactMethod.EMAIL ? (
									<MdEmail fontSize="24px"></MdEmail>
								) : (
									<>
										{Object.entries(contactIcons)
											.map(([k, v]) =>
												formik.values.contactInfo.includes(k) ? (
													<Image key="k" maxHeight="24px" src={v}></Image>
												) : null,
											)
											.reduce((l, r) => l ?? r) ?? (
											<MdLink fontSize="24px"></MdLink>
										)}
									</>
								)}
								<Editable
									value={formik.values.contactInfo}
									onSubmit={submitContactInfo}
									onCancel={submitContactInfo}
									isDisabled={!editMode}
									width="100%"
								>
									<EditablePreview
										as={Link}
										href={
											editMode
												? undefined
												: (contactMethod === ContactMethod.EMAIL
														? "mailto:"
														: "") + formik.values.contactInfo
										}
										className={editMode ? "EditPreview" : ""}
										cursor={editMode ? "pointer" : ""}
									/>
									<Input
										as={EditableInput}
										name="contactInfo"
										type={contactMethod}
										variant="flushed"
										onChange={formik.handleChange}
									></Input>
								</Editable>
							</Stack>
						</FormControl>
						{editMode ? (
							<Button
								type="submit"
								colorScheme="groupr"
								width="full"
								alignSelf="flex-end"
							>
								{" "}
								{"Save Project"}
							</Button>
						) : (
							<VStack width="100%">
								<HStack width="100%">
									<Button
										colorScheme="groupr"
										width="full"
										alignSelf="flex-end"
										onClick={() => {
											navigate("/projects/dashboard/" + project?.id);
										}}
									>
										{" "}
										{"Dashboard"}
									</Button>
									<Button
										colorScheme="groupr"
										width="full"
										alignSelf="flex-end"
										onClick={() => {
											navigate("/projects/finder/" + project?.id);
										}}
									>
										{" "}
										{"Find Collaborators"}
									</Button>
								</HStack>
								<Button
									type="submit"
									colorScheme="groupr"
									width="full"
									alignSelf="flex-end"
									leftIcon={<EditIcon></EditIcon>}
								>
									{" "}
									{"Edit"}
								</Button>
							</VStack>
						)}
					</VStack>
				</Flex>
			</form>
		</Box>
	);
};

export default CreatorCard;
