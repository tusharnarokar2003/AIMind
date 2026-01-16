import { Routes, Route } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import HomePage from "./pages/HomePage";
import NotesPage from "./pages/NotesPage/NotesPage";
import GoalPage from "./pages/GoalPage";
import ChatPage from "./pages/ChatPage";
import CommunityPage from "./pages/CommunityPage";

export default function App() {
  return (
    
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/journaling" element={<NotesPage />} />
      <Route path="/goal" element={<GoalPage />} /> 
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/community" element={<CommunityPage />} />
       
    </Routes>
  );
}
