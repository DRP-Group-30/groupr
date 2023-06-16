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
import { emptyAvailability } from "../../../backend";

const SignupPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { signupWithEmailAndPassword, currentUser } = useAuth();
	const toast = useToast();

	return (
		<Flex
			minH={"100vh"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.50", "gray.800")}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} mt="-60pt">
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign up
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
									addFireDoc("users", {
										id: user.user?.uid ?? "",
										fields: {
											bio: "",
											pronouns: "",
											availability: emptyAvailability(),
											tags: [],
											projects: [],
											rejected: [],
											interested: [],
											matched: [],
										},
									});
									console.log(currentUser);
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
											loadingText="Submitting"
											type="submit"
											id="submit"
											size="lg"
											bg={"blue.400"}
											color={"white"}
											_hover={{
												bg: "blue.500",
											}}
										>
											Sign up
										</Button>
									</Stack>
									<Stack pt={6}>
										<Text align={"center"}>
											Already a user?{" "}
											<Link href="/login" color={"blue.400"}>
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
