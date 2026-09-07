import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import ProtectedRoute from "./Components/ProtectedRoute";

import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Pages/Home";
import StandardsPage from "./Pages/StandardsPage";
import AiAssistant from "./Pages/AiAssistant";
import Certification from "./Pages/Certification";
import ProfileSettings from "./Pages/Profilesettings";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
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
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;