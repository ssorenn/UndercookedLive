{/* continue adding routes if necessary, like a login/auth page, etc */}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./components/Game.jsx";
import Settings from "./components/Settings.jsx";
import Info from "./components/Info.jsx";
import StartMenu from "./StartMenu.jsx";
import AuthPage from "./AuthPage.jsx";
import LevelSelection from "./components/LevelSelection.jsx";
import Story1 from "./components/Story1.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartMenu />} />
        <Route path="/game" element={<Game />} />
        <Route path="/story1" element={<Story1 />} />
        <Route path="/level-selection" element={<LevelSelection />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/info" element={<Info />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}