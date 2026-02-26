import { useNavigate } from "react-router-dom";
import homescreenImg from "./assets/homescreen.jpg";
import playBtnImg from "./assets/play_button.png";
import settingsBtnImg from "./assets/settings_button.png";
import infoBtnImg from "./assets/info_blank.png";
import { supabase } from "./supabase";
import { isGuestMode, getGuestProfile, endGuestMode } from "./guestSession";

export default function StartMenu() {
  const navigate = useNavigate();

  const guest = getGuestProfile();
  const guestMode = isGuestMode();

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <h1>Start Menu</h1>

      {/* ✅ Show who is playing */}
      {guestMode ? (
        <p>Playing as Guest: <strong>{guest.display_name}</strong></p>
      ) : (
        <p>Logged in user</p>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={() => nav("/game")}>Play</button>

        <button
          onClick={async () => {
            if (guestMode) {
              endGuestMode();       // clear guest session
              nav("/auth");         // return to login
            } else {
              await supabase.auth.signOut();
            }
          }}
        >
          {guestMode ? "Exit Guest Mode" : "Log out"}
        </button>
      </div>
    <div>
      <img src={homescreenImg} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      <img src={playBtnImg} onClick={() => navigate("/game")}
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
    </div>
  );
}