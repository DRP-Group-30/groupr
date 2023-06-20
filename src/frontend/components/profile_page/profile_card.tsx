import {
	VStack,
	Card,
	CardBody,
	Avatar,
	Box,
	Container,
	Flex,
	HStack,
	Text,
	Editable,
	EditablePreview,
	EditableTextarea,
	FormControl,
	Textarea,
	Button,
	Input,
	EditableInput,
	FormLabel,
	Tag,
} from "@chakra-ui/react";
import { nubWith, nub, inlineLog, or } from "../../../util";
import {
	AutoCompleteTag,
	AutoComplete,
	AutoCompleteInput,
	AutoCompleteList,
	AutoCompleteItem,
	AutoCompleteCreatable,
	ItemTag,
} from "@choc-ui/chakra-autocomplete";
import { useAuth } from "../../../context/AuthContext";
import { useFormik } from "formik";
import { User, addUser, emptyAvailability, updateUser } from "../../../backend";
import { Fields, getAllTags } from "../../../util/firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { emptyIRM } from "../../../backend/default_database";

const ProfileCard = ({ canEdit, profile }: { canEdit: boolean; profile: User | null }) => {
	const navigate = useNavigate();
	const { currentUser, logout } = useAuth();
	const isLoggedIn = !!currentUser;

	const [allTags, setAllTags] = useState<string[]>([]);
	const initTagTable = async () => setAllTags(await getAllTags());
	const [tempTags, setTempTags] = useState<ItemTag[]>([]);

	const formik = useFormik<User[Fields]>({
		initialValues: profile
			? profile.fields
			: {
					profileImage: null,
					firstName: "FirstName",
					lastName: "LastName",
					email: "email@email.com",
					bio: "Your bio - tell us a little bit about yourself!",
					pronouns: "(no pronouns provided)",
					skills: [],
					ownProjects: [],
					availability: emptyAvailability(),
					irm: emptyIRM(),
			  },
		onSubmit: async profileData => {
			if (canEdit) {
				if (profile) {
					await updateUser(profile.id, profileData);
				} else {
					await updateUser(currentUser?.uid ?? "oops", profileData);
				}
				navigate("/", { replace: false });
			}
		},
	});

	useEffect(() => {
		initTagTable();
		if (profile === null) return;
		formik.setValues(profile.fields);
	}, [profile]);

	function submitBio() {
		if (formik.values.bio.trim().length === 0)
			formik.setFieldValue("name", formik.initialValues.bio);
	}

	function submitPronouns() {
		if (formik.values.pronouns.trim().length === 0)
			formik.setFieldValue("pronouns", formik.initialValues.pronouns);
	}

	return (
		<form onSubmit={formik.handleSubmit}>
			<Box bgColor="ffffff00" p={4} w="100%" alignItems="center" justifyContent="center">
				<Flex
					width="100%"
					shadow="lg"
					rounded="lg"
					bg="#ffffff"
					_dark={{
						bg: "gray.800",
					}}
					mb={4}
					direction="column"
					alignItems="center"
					justifyContent="center"
				>
					<Box
						bg="#ffffff"
						_dark={{
							bg: "#3e3e3e",
						}}
						style={{
							backgroundImage: `url(https://picsum.photos/seed/${currentUser?.uid}/1200)`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
						}}
						height="100%"
						width="100%"
						roundedTop="lg"
						px={8}
						display="flex"
						alignItems="left"
					>
						<Avatar
							src={currentUser?.photoURL ?? ""}
							name={currentUser?.displayName ?? undefined}
							borderRadius="full"
							borderWidth="5px"
							size="2xl"
							shadow="lg"
							transform="translate(0, 50%)"
						/>
					</Box>
					<VStack
						gridColumn="span 8"
						p={8}
						width="full"
						height="full"
						borderRadius="lg"
						textAlign="left"
						mt={10}
						spacing={2}
						align="left"
					>
						<Text
							fontSize="4xl"
							fontWeight="bold"
							color="gray.800"
							_dark={{
								color: "white",
							}}
						>
							{currentUser?.displayName}
						</Text>
						<FormControl>
							<Editable
								value={formik.values.pronouns}
								onSubmit={submitPronouns}
								onCancel={submitPronouns}
								isDisabled={!canEdit}
							>
								<Flex width="600px" flexWrap="wrap">
									<EditablePreview
										className={canEdit ? "EditPreview" : ""}
										fontSize="2xl"
										fontWeight="bold"
										cursor={canEdit ? "pointer" : ""}
									/>
									<Input
										as={EditableInput}
										id="pronouns"
										name="pronouns"
										type="text"
										variant="flushed"
										onChange={formik.handleChange}
										fontSize="2xl"
										fontWeight="bold"
									/>
								</Flex>
							</Editable>
						</FormControl>
						<FormControl>
							<Editable
								value={formik.values.bio}
								onSubmit={submitBio}
								onCancel={submitBio}
								isDisabled={!canEdit}
							>
								<EditablePreview
									maxWidth="600px"
									className={canEdit ? "EditPreview" : ""}
									cursor={canEdit ? "pointer" : ""}
									lineHeight="5"
								/>
								<Textarea
									as={EditableTextarea}
									maxWidth="600px"
									id="bio"
									name="bio"
									variant="filled"
									onChange={formik.handleChange}
								/>
							</Editable>
						</FormControl>
						{canEdit && (
							<Box
								backgroundColor="gray.100"
								width="100%"
								borderRadius="md"
								padding="16px"
							>
								<FormControl>
									<FormLabel fontWeight="bold">Interests and skills</FormLabel>
									<Flex
										maxWidth="600px"
										flexWrap="wrap"
										marginBottom={
											canEdit ? (tempTags.length > 0 ? "3px" : "0px") : "-6px"
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
											canEdit ? (
												<AutoCompleteTag
													key={tid}
													label={label}
													onRemove={onRemove}
													variant="solid"
													colorScheme="teal"
													marginRight="3px"
													marginBottom="6px"
												/>
											) : (
												<Tag
													key={tid}
													variant="solid"
													colorScheme="teal"
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
										values={formik.values.skills}
									>
										{canEdit && (
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
						<Button type="submit" colorScheme="teal" width="full" alignSelf="flex-end">
							Save profile
						</Button>
					</VStack>
				</Flex>
			</Box>
		</form>
	);
};

export default ProfileCard;
