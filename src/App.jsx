// we're just going to use this as backbone
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./components/Game.jsx";
import Settings from "./components/Settings.jsx";
import Info from "./components/Info.jsx";
import StartMenu from "./StartMenu.jsx";
import AuthPage from "./AuthPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartMenu />} />
        <Route path="/game" element={<Game />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/info" element={<Info />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}