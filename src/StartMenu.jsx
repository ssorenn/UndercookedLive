import { useNavigate } from "react-router-dom";
import homescreenImg from "./assets/homescreen.jpg";
import playBtnImg from "./assets/play_button.png";
import settingsBtnImg from "./assets/settings_button.png";
import infoBtnImg from "./assets/info_blank.png";
//import { supabase } from "./supabase";
import { isGuestMode, getGuestProfile, endGuestMode, startGuestMode } from "./guestSession";

export default function StartMenu() {
  const navigate = useNavigate();

  const guest = getGuestProfile();
  const guestMode = isGuestMode();

  return (
    <div>
      <img src={homescreenImg} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      <img src={playBtnImg} onClick={() => { 
        startGuestMode();
        navigate("/story1");
      }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateX(-50%) scale(1.05)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateX(-50%) scale(1)"}
        style={{ position: "fixed", bottom: "10%", left: "51%", transform: "translateX(-50%)", width: "20vw", cursor: "pointer", zIndex: 1, transition: "transform 0.15s ease" }}
      />
      <img src={settingsBtnImg}
        onClick={() => navigate("/settings")}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        style={{ position: "fixed", bottom: "10%", left: "63%", width: "15vw", cursor: "pointer", zIndex: 1, transition: "transform 0.15s ease" }}
      />
      <img src={infoBtnImg}
        onClick={() => navigate("/info")}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        style={{ position: "fixed", bottom: "10%", left: "22%", width: "17vw", cursor: "pointer", zIndex: 1, transition: "transform 0.15s ease" }}
      />

      {/* Only show if user is in guest mode or logged in */}
      {guestMode && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 2 }}>
          <p style={{ color: "black", margin: "0 0 8px 0" }}>
            Playing as Guest: <strong>{guest.display_name}</strong>
          </p>
          <button
            onClick={() => {
              endGuestMode();
              navigate("/auth");
            }}
            style={{ cursor: "pointer" }}
          >
            Exit Guest Mode
          </button>
        </div>
      )}
    </div>
  );
}