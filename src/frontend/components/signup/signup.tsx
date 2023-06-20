import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	FormErrorMessage,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useAuth } from "../../../context/AuthContext";
import { Field, Formik } from "formik";
import { addFireDoc } from "../../../util/firebase";
import { User, emptyAvailability } from "../../../backend";
import { emptyIRM } from "../../../backend/default_database";

const SignupPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { signupWithEmailAndPassword, currentUser } = useAuth();
	const toast = useToast();

	return (
		<Flex
			backgroundColor="groupr.100"
			color="groupr.700"
			minH={"100vh"}
			align={"center"}
			justify={"center"}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} mt="-60pt">
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign Up
					</Heading>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
				>
					<Formik
						initialValues={{
							firstName: "",
							lastName: "",
							email: "",
							password: "",
						}}
						onSubmit={(values, { resetForm }) => {
							signupWithEmailAndPassword(values.email, values.password)
								.then(user => {
									user.user?.updateProfile({
										displayName: values.firstName + " " + values.lastName,
									});
									const u: User = {
										id: user.user?.uid ?? "",
										fields: {
											bio: "",
											pronouns: "",
											availability: emptyAvailability(),
											skills: [],
											irm: emptyIRM(),
											profileImage: null,
											firstName: values.firstName,
											lastName: values.lastName,
											email: values.email,
											ownProjects: [],
										},
									};
									addFireDoc("users", u).then(() => console.group(currentUser));
								})
								.catch(err => {
									toast({
										title: "Could not make account",
										description: err.message,
										status: "error",
										isClosable: true,
									});
									resetForm();
								});
						}}
					>
						{({
							handleSubmit,
							errors,
							touched,
						}: {
							handleSubmit: any;
							errors: any;
							touched: any;
						}) => (
							<form onSubmit={handleSubmit}>
								<Stack spacing={4}>
									<HStack>
										<Box>
											<FormControl id="firstName" isRequired>
												<FormLabel>First Name</FormLabel>
												<Field
													as={Input}
													id="firstName"
													name="firstName"
													type="text"
												/>
											</FormControl>
										</Box>
										<Box>
											<FormControl id="lastName">
												<FormLabel>Last Name</FormLabel>
												<Field
													as={Input}
													id="lastName"
													name="lastName"
													type="text"
												/>
											</FormControl>
										</Box>
									</HStack>
									<FormControl id="email" isRequired>
										<FormLabel>Email address</FormLabel>
										<Field as={Input} type="email" id="email" name="email" />
									</FormControl>
									<FormControl
										isInvalid={!!errors.password && touched.password}
										id="password"
										isRequired
									>
										<FormLabel>Password</FormLabel>
										<InputGroup>
											<Field
												as={Input}
												id="password"
												name="password"
												validate={(value: string) => {
													let error;

													if (value.length < 6) {
														error =
															"Password must contain at least 6 characters";
													}

													return error;
												}}
												type={showPassword ? "text" : "password"}
											/>
											<InputRightElement h={"full"}>
												<Button
													variant={"ghost"}
													onClick={() =>
														setShowPassword(
															showPassword => !showPassword,
														)
													}
												>
													{showPassword ? <ViewIcon /> : <ViewOffIcon />}
												</Button>
											</InputRightElement>
										</InputGroup>
										<FormErrorMessage>{errors.password}</FormErrorMessage>
									</FormControl>
									<Stack spacing={10} pt={2}>
										<Button
											colorScheme="groupr"
											loadingText="Submitting"
											type="submit"
											id="submit"
											size="lg"
											color={"white"}
										>
											Sign Up
										</Button>
									</Stack>
									<Stack pt={6}>
										<Text align={"center"}>
											Already a user?{" "}
											<Link href="/login" color={"groupr.500"}>
												Login
											</Link>
										</Text>
									</Stack>
								</Stack>
							</form>
						)}
					</Formik>{" "}
				</Box>
			</Stack>
		</Flex>
	);
};

export default SignupPage;
