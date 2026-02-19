import { useState } from "react";
import GameScreen from "./components/GameScreen";
import homescreenImg from "./assets/homescreen.jpg";
import playBtnImg from "./assets/play_button.png";
import settingsBtnImg from "./assets/settings_button.png";

export default function App() {
  const [screen, setScreen] = useState("home");

  if (screen === "game") return <GameScreen />;

  return (
  <div>
    <img
      src={homescreenImg}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
        background: "#fff8dc", 
      }}
    />
    <img
      src={playBtnImg}
      onClick={() => setScreen("game")}
      onMouseEnter={e => e.currentTarget.style.transform = "translateX(-50%) scale(1.05)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateX(-50%) scale(1)"}
      style={{
        position: "absolute",
        bottom: "10%",
        left: "51%",
        transform: "translateX(-50%)",
        width: "20vw", // this is so the button is responsive and scales with the screen size, but we can adjust as needed
        //minWidth: "300px", 
        //maxWidth: "600px",  
        cursor: "pointer",
        zIndex: 1,
        transition: "transform 0.15s ease",
      }}
    />
    <img 
      src={settingsBtnImg}
      onMouseEnter={e => e.currentTarget.style.transform = " scale(1.05)"}
      onMouseLeave={e => e.currentTarget.style.transform = " scale(1)"}
      style={{
        position: "absolute",
        bottom: "10%",
        left: "63%",
        width: "15vw",
        cursor: "pointer",
        zIndex: 1,
        transition: "transform 0.15s ease",
      }}
    />
  </div>
);
}


