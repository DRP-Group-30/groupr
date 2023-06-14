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

type Fields = "fields";

const ProjectCreator = () => {
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
			<Box bg="white" p={6} rounded="md">
				<form onSubmit={formik.handleSubmit}>
					<VStack spacing={4} align="flex-start">
						<FormControl>
							<FormLabel htmlFor="project name">Project Name</FormLabel>
							<Input
								id="project name"
								name="project name"
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
