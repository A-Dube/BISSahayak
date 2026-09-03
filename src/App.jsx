import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import StandardsPage from "./Pages/StandardsPage"
import Signup from "./Components/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/standards" element={<StandardsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;