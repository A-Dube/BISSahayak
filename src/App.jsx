import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import StandardsPage from "./Pages/StandardsPage"
import Signup from "./Components/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/standards" element={<StandardsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;