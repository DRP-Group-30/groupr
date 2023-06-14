import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Navbar from "./components/navbar";
import Finder from "./components/finder";
import ProjectPage from "./components/projectsPage";

/**
 * The main app component.
 */
function App() {
	return (
		<>
			<Navbar></Navbar>
			<Routes>
				{/**
					 * A list of routes, each with a path and an element.
					 * 
					 * Follow the format: <Route path="/path" element={<Component />} />
					 * Hidden: <Route path="/auth" element={<SignInScreen />} />
				*/}
				<Route path="/" element={<Finder />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/projects" element={<ProjectPage />} />
			</Routes>
		</>
	)
}

export default App;