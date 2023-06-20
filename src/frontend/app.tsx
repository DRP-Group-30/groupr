import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Navbar from "./components/navbar";
import Finder from "./components/finder";
import React from "react";
import ProjectEditor from "./components/project_creator";
import ProjectPage from "./components/projectsPage";
import ProfilePage from "./components/profile_page";
import LoginPage from "./components/login";
import { AuthProvider, useAuth } from "../context/AuthContext";
import SignupPage from "./components/signup";
import Landing from "./components/landing";
import ProtectedRoute from "../protectedRoute";
import Finder2 from "./components/finder2/finder2";

/**
 * The main app component.
 */
function App() {
	return (
		<>
			<AuthProvider>
				<Navbar></Navbar>
				<Routes>
					{/**
					 * A list of routes, each with a path and an element.
					 *
					 * Follow the format: <Route path="/path" element={<Component />} />
					 * Hidden: <Route path="/auth" element={<SignInScreen />} />
					 */}
					<Route
						path="/"
						element={
							<ProtectedRoute redirectPath="/finder" path={<Landing />} reverse />
						}
					/>
					<Route
						path="/finder"
						element={
							<ProtectedRoute redirectPath="/" path={<Finder />} reverse={false} />
						}
					/>
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute redirectPath="/" path={<Dashboard />} reverse={false} />
						}
					/>
					<Route
						path="/profile/:userID"
						element={
							<ProtectedRoute
								redirectPath="/"
								path={<ProfilePage />}
								reverse={false}
							/>
						}
					/>
					<Route
						path="/login"
						element={<ProtectedRoute redirectPath="/" path={<LoginPage />} reverse />}
					/>
					<Route
						path="/signup"
						element={<ProtectedRoute redirectPath="/" path={<SignupPage />} reverse />}
					/>
					<Route
						path="/projects/edit/:projectID"
						element={<ProjectEditor isNew={false} />}
					/>
					<Route path="/projects/edit" element={<ProjectEditor isNew />} />
					<Route path="/projects" element={<ProjectPage />} />
					<Route path="/projects/finder/:projectID" element={<Finder2></Finder2>}></Route>
				</Routes>
			</AuthProvider>
		</>
	);
}

export default App;
