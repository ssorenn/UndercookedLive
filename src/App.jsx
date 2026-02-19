import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";  // Add ProtectedRoute file
import AuthPage from "./AuthPage";  // Add AuthPage file
import StartMenu from "./StartMenu";  // Add StartMenu file
import Game from "./Game";  // Game file remains unchanged

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} /> {/* Login/Signup page */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <StartMenu />
            </ProtectedRoute>
          }
        /> {/* Start Menu (visible only if logged in) */}

        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          }
        /> {/* The actual game (visible only if logged in) */}

        <Route path="*" element={<Navigate to="/" replace />} /> {/* Catch-all redirect */}
      </Routes>
    </BrowserRouter>
  );
}
