import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import homescreenImg from "./assets/homescreen.jpg";
import playBtnImg from "./assets/play_button.png";
import settingsBtnImg from "./assets/settings_button.png";
import infoBtnImg from "./assets/info_btn.png";

import { supabase } from "./supabase";
import {
  isGuestMode,
  getGuestProfile,
  endGuestMode,
  startGuestMode,
} from "./guestSession";

export default function StartMenu() {
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!alive) return;

        setSession(data?.session ?? null);

        const hasSession = !!data?.session;
        if (!hasSession && !isGuestMode()) {
          startGuestMode();
        }
      } finally {
        if (alive) setReady(true);
      }
    })();

    // keep UI in sync if user logs in/out 
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);

      // If user logs in, end guest mode
      if (newSession) endGuestMode();
      // If user logs out, re-enable guest mode default
      if (!newSession && !isGuestMode()) startGuestMode();
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  if (!ready) return null;

  const guestMode = isGuestMode();
  const guest = getGuestProfile();

  const userLabel =
    session?.user?.user_metadata?.display_name ||
    session?.user?.email ||
    "Player";

  return (
    <div>
      <img
        src={homescreenImg}
        alt="Home"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* PLAY */}
      <img
        src={playBtnImg}
        alt="Play"
        onClick={() => {
          // If logged in,  play
          if (session) {
            navigate("/story1");
            return;
          }
          // Otherwise ensure guest exists,  play
          if (!isGuestMode()) startGuestMode();
          navigate("/story1");
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateX(-50%) scale(1.05)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateX(-50%) scale(1)")
        }
        style={{
          position: "fixed",
          bottom: "10%",
          left: "51%",
          transform: "translateX(-50%)",
          width: "20vw",
          cursor: "pointer",
          zIndex: 1,
          transition: "transform 0.15s ease",
        }}
      />

      {/* SETTINGS */}
      <img
        src={settingsBtnImg}
        alt="Settings"
        onClick={() => navigate("/settings")}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        style={{
          position: "fixed",
          bottom: "10%",
          left: "63%",
          width: "15vw",
          cursor: "pointer",
          zIndex: 1,
          transition: "transform 0.15s ease",
        }}
      />

      {/* INFO */}
      <img
        src={infoBtnImg}
        alt="Info"
        onClick={() => navigate("/info")}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        style={{
          position: "fixed",
          bottom: "10%",
          left: "23%",
          width: "15vw",
          cursor: "pointer",
          zIndex: 1,
          transition: "transform 0.15s ease",
        }}
      />

      {/* TOP-RIGHT STATUS */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 2 }}>
        {/* If logged in, show user + logout */}
        {session && (
          <>
            <p style={{ color: "black", margin: "0 0 8px 0" }}>
              Logged in as User: <strong>{userLabel}</strong>
            </p>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                // onAuthStateChange will kick in, start guest mode, etc.
                navigate("/auth"); 
              }}
              style={{ cursor: "pointer" }}
            >
              Log out
            </button>
          </>
        )}

        {/* Otherwise if guest mode, show guest + exit */}
        {!session && guestMode && guest && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}