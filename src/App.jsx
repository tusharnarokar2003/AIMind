import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import NotesPage from "./pages/NotesPage/NotesPage";
import GoalPage from "./pages/GoalPage";
import ChatPage from "./pages/ChatPage";
import CommunityPage from "./pages/CommunityPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/journaling" element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        } />
        <Route path="/goal" element={
          <ProtectedRoute>
            <GoalPage />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute>
            <CommunityPage />
          </ProtectedRoute>
        } />

        {/* Redirect any unknown routes to auth */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}