import { Formik, Field } from "formik";
import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	useColorModeValue,
	Heading,
	Link,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";

import { useAuth } from "../../../context/AuthContext";

interface FormValues {
	email: string;
	password: string;
	rememberMe: boolean;
}

const LoginPage = () => {
	const { loginWithEmailAndPassword } = useAuth();
	const toast = useToast();
	return (
		<Flex
			minH={"100%"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.50", "gray.800")}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} mt="-60pt" px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"}>Sign in to your account</Heading>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
				>
					<Formik
						initialValues={{
							email: "",
							password: "",
							rememberMe: false,
						}}
						onSubmit={(values, { resetForm }) => {
							loginWithEmailAndPassword(values.email, values.password).catch(err => {
								toast({
									title: "Could not login account",
									description: err.message,
									status: "error",
									isClosable: true,
								});
								resetForm();
							});

							alert(JSON.stringify(values, null, 2));
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
								<Stack spacing={4} align="flex-start" alignItems="center">
									<FormControl id="email" isRequired>
										<FormLabel htmlFor="email">Email Address</FormLabel>
										<Field
											as={Input}
											id="email"
											name="email"
											type="email"
											variant="filled"
										/>
									</FormControl>
									<FormControl
										isInvalid={!!errors.password && touched.password}
										isRequired
									>
										<FormLabel htmlFor="password">Password</FormLabel>
										<Field
											as={Input}
											id="password"
											name="password"
											type="password"
											variant="filled"
											validate={(value: string) => {
												let error;

												if (value.length < 6) {
													error =
														"Password must contain at least 6 characters";
												}

												return error;
											}}
										/>
										<FormErrorMessage>{errors.password}</FormErrorMessage>
									</FormControl>
									<Stack spacing={10} w="100%">
										<Stack
											direction="row"
											justifyContent={"space-between"}
											w="100%"
										>
											<Field
												as={Checkbox}
												id="rememberMe"
												name="rememberMe"
												colorScheme="purple"
											>
												Remember me?
											</Field>
											<Link color="blue.400" href="/forgot-password">
												{" "}
												Forgot password?{" "}
											</Link>
										</Stack>
										<Button
											bg={"blue.400"}
											color={"white"}
											type="submit"
											_hover={{
												bg: "blue.500",
											}}
										>
											Sign in
										</Button>
									</Stack>
									<Text fontSize="md">
										Don't have an account?{" "}
										<Link color="blue.400" href="/signup">
											Sign up
										</Link>
									</Text>
								</Stack>
							</form>
						)}
					</Formik>
				</Box>
			</Stack>
		</Flex>
	);
};

export default LoginPage;
