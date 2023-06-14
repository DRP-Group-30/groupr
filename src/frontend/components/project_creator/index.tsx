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

type Fields = "fields";

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

	return (
		<Flex bg="gray.100" align="center" justify="center" h="100vh">
			<Box bg="white" minWidth="400px" p={6} rounded="md" overflow="hidden">
				<Box backgroundColor="teal.400" height="210px" mt={-6} mx={-6} position="relative">
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
										setTempCoverImage((event.currentTarget.files ?? [null])[0]);
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
							<FormLabel htmlFor="project name">Project Name</FormLabel>
							<Input
								id="project name"
								name="name"
								type="project name"
								variant="filled"
								onChange={formik.handleChange}
								value={formik.values.name}
							/>
						</FormControl>
						<FormControl>
							<FormLabel htmlFor="overview">Overview</FormLabel>
							<Input
								id="overview"
								name="overview"
								type="overview"
								variant="filled"
								onChange={formik.handleChange}
								value={formik.values.overview}
							/>
						</FormControl>
						<Select placeholder="tags">
							<option value="option1">Option 1</option>
							<option value="option2">Option 2</option>
							<option value="option3">Option 3</option>
						</Select>

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
