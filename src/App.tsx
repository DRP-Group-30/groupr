import { Routes, Route } from "react-router-dom";
import DashboardNew from "./DashboardNew";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";
import Finder from "./Finder";
import SignInScreen from "./Auth";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Finder />} />
        <Route path="/dashboard" element={<DashboardNew />} />
        {/* <Route path="/auth" element={<SignInScreen />} /> */}
      </Routes>
    </>
  );
}

export default App;
