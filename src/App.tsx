import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Finder from "./Finder";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Finder />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
