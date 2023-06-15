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
	LinkBox,
	Text,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	SliderMark,
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
import { nubWith, nub, inlineLog, or } from "../../../util";
import { ContactMethod } from "./types";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { Project, Skill, Skillset, addProject, getDefaultRole } from "../../../backend";
import { Fields, storeImg, getAllTags } from "../../../util/firebase";

import discord from "../../static/discord.png";
import slack from "../../static/slack.png";
import whatsapp from "../../static/whatsapp.png";
import { AddIcon } from "@chakra-ui/icons";

const contactIcons = {
	discord: discord,
	slack: slack,
	whatsapp: whatsapp,
};

const CreatorCard = ({ editMode }: { editMode: boolean }) => {
	const [tempCoverImage, setTempCoverImage] = useState<File | null>(null);
	const [imageInputElem, setImageInputElem] = useState<HTMLInputElement | null>(null);
	const [contactMethod, setContactMethod] = useState<ContactMethod>(ContactMethod.EMAIL);

	const formik = useFormik<Project[Fields]>({
		initialValues: {
			name: "Your Project Name",
			contactInfo: "Project Contact Details",
			overview:
				"Your project's overview - a short sales pitch to explain what your project is and why users should join.",
			coverImage: null,
			tags: [],
			// Should there be a type for only the document data fields that are
			// editable/shown?
			interested: [],
			// Should `collaborators` be initialised to include the project creator?
			collaborators: [],
			roles: [],
		},
		onSubmit: async projectData => {
			console.log(projectData.name);
			console.log(formik.values.name);
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
				await addProject(projectData);
				window.location.assign("projects");
			}
		},
	});

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

	useEffect(() => {
		initTagTable();
	}, []);

	return (
		<Box
			bg="white"
			minWidth="400px"
			p={6}
			rounded="md"
			boxShadow="2xl"
			marginTop="50px"
			marginBottom="25px"
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
							{editMode && (
								<Button
									colorScheme="teal"
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
							<FormControl>
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
							</FormControl>
							<FormControl marginTop={editMode ? "0px" : "-12px"}>
								<Editable
									value={formik.values.overview}
									onSubmit={submitOverview}
									onCancel={submitOverview}
									isDisabled={!editMode}
								>
									<EditablePreview
										width="600px"
										className={editMode ? "EditPreview" : ""}
										cursor={editMode ? "pointer" : ""}
										lineHeight="5"
									/>
									<Textarea
										as={EditableTextarea}
										width="600px"
										id="overview"
										name="overview"
										variant="filled"
										onChange={formik.handleChange}
									/>
								</Editable>
							</FormControl>
							<VStack>
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
													colorScheme="teal"
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
												variant="filled"
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
								<LinkBox
									bgColor="gray.100"
									border="dashed"
									minWidth="600px"
									rounded="md"
									onClick={() =>
										formik.setFieldValue(
											"roles",
											formik.values.roles.concat([
												getDefaultRole(formik.values.roles.length),
											]),
										)
									}
									//style={{ cursor: "pointer" }}
									cursor="pointer"
								>
									<VStack>
										<Icon as={AddIcon} w="24px" h="24px" />
										<Text>Add Role</Text>
									</VStack>
								</LinkBox>
							</VStack>

							{(editMode || tempTags.length !== 0) && (
								<Box
									backgroundColor="gray.100"
									width="100%"
									borderRadius="md"
									padding="16px"
								>
									<FormControl>
										<FormLabel fontWeight="bold">Tags</FormLabel>
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
										{editMode && (
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
											>
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
											</AutoComplete>
										)}
									</FormControl>
								</Box>
							)}
							{editMode && (
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
							)}
						</Editable>
					</FormControl>
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
					<Button type="submit" colorScheme="teal" width="full">
						{" "}
						Create Project
					</Button>
				</VStack>
			</form>
		</Box>
	);
};

export default CreatorCard;
