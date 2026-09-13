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
import ProfileSettings from "./Pages/ProfileSettings";
import TestingLabs from "./Pages/TestingLabs";
import Verification from "./Pages/Verification";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>

          <Routes>

            {/* -----------------------------------------
                LOGIN
            ----------------------------------------- */}
            <Route
              path="/"
              element={<Login />}
            />

            <Route
              path="/login"
              element={<Navigate to="/" replace />}
            />

            {/* -----------------------------------------
                SIGNUP
            ----------------------------------------- */}
            <Route
              path="/signup"
              element={<Signup />}
            />

            {/* -----------------------------------------
                HOME
            ----------------------------------------- */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* -----------------------------------------
                AI ASSISTANT
            ----------------------------------------- */}
            <Route
              path="/assistant"
              element={
                <ProtectedRoute>
                  <AiAssistant />
                </ProtectedRoute>
              }
            />

            {/* -----------------------------------------
                STANDARDS
            ----------------------------------------- */}
            <Route
              path="/standards"
              element={
                <ProtectedRoute>
                  <StandardsPage />
                </ProtectedRoute>
              }
            />

            {/* -----------------------------------------
                CERTIFICATION
            ----------------------------------------- */}
            <Route
              path="/certification/:productId?"
              element={
                <ProtectedRoute>
                  <Certification />
                </ProtectedRoute>
              }
            />

            {/* -----------------------------------------
                TESTING LABS
            ----------------------------------------- */}
            <Route
              path="/labs"
              element={
                <ProtectedRoute>
                  <TestingLabs />
                </ProtectedRoute>
              }
            />

            {/* -----------------------------------------
                HALLMARKING / VERIFICATION
            ----------------------------------------- */}
            <Route
              path="/hallmarking"
              element={
                <ProtectedRoute>
                  <Verification />
                </ProtectedRoute>
              }
            />

            {/* -----------------------------------------
                PROFILE
            ----------------------------------------- */}
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