import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";

import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Pages/Home";
import StandardsPage from "./Pages/StandardsPage";
import AiAssistant from "./Pages/AiAssistant";
import Certification from "./Pages/Certification";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <AiAssistant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/standards"
            element={
              <ProtectedRoute>
                <StandardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certification/:productId?"
            element={
              <ProtectedRoute>
                <Certification />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;