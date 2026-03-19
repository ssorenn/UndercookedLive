import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import homescreenImg from "./assets/homescreen.jpg";
import playBtnImg from "./assets/play_button.png";
import settingsBtnImg from "./assets/settings_button.png";
import infoBtnImg from "./assets/info_button.png";

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
  const [playBusy, setPlayBusy] = useState(false);

  useEffect(() => {
    let stillMounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!stillMounted) return;

        setSession(data?.session ?? null);

        const hasLoginSession = !!data?.session;
        if (!hasLoginSession && !isGuestMode()) {
          startGuestMode();
        }
      } finally {
        if (stillMounted) setReady(true);
      }
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession ?? null);

        if (nextSession) {
          endGuestMode();
        }

        if (!nextSession && !isGuestMode()) {
          startGuestMode();
        }
      }
    );

    return () => {
      stillMounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  if (!ready) return null;

  const guestMode = isGuestMode();
  const guestProfile = getGuestProfile();

  const userLabel =
    session?.user?.user_metadata?.display_name ||
    session?.user?.email ||
    "Player";

  async function handlePlayClick() {
    if (playBusy) return;
    setPlayBusy(true);

    try {
      if (session?.user) {
        const currentUserId = session.user.id;

        /*
        // Uncomment when Supabase is working again
        const { data: storyProgressRow, error: storyProgressError } = await supabase
          .from("profiles")
          .select("has_seen_story1")
          .eq("id", currentUserId)
          .single();

        if (storyProgressError) {
          console.error("Could not read story progress:", storyProgressError);
          navigate("/story1");
          return;
        }

        const hasSeenStory1 = !!storyProgressRow?.has_seen_story1;

        if (hasSeenStory1) {
          navigate("/level-selection");
        } else {
          navigate("/story1");
        }
        return;
        */

        console.log("Supabase check is temporarily disabled. User id:", currentUserId);
        navigate("/story1");
        return;
      }

      if (!isGuestMode()) {
        startGuestMode();
      }

      const guestHasSeenStory1 =
        localStorage.getItem("guestHasSeenStory1") === "true";

      if (guestHasSeenStory1) {
        navigate("/level-selection");
      } else {
        navigate("/story1");
      }
    } finally {
      setPlayBusy(false);
    }
  }

  function handleClearCache() {
    const confirmed = window.confirm("Clear all local test data and reset progress?");
    if (!confirmed) return;

    localStorage.clear();
    endGuestMode();
    startGuestMode();
    navigate("/");
    window.location.reload();
  }

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

      <img
        src={playBtnImg}
        alt="Play"
        onClick={handlePlayClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateX(-50%) scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateX(-50%) scale(1)";
        }}
        style={{
          position: "fixed",
          bottom: "10%",
          left: "51%",
          transform: "translateX(-50%)",
          width: "20vw",
          cursor: playBusy ? "wait" : "pointer",
          zIndex: 1,
          transition: "transform 0.15s ease",
          opacity: playBusy ? 0.9 : 1,
        }}
      />

      <img
        src={settingsBtnImg}
        alt="Settings"
        onClick={() => navigate("/settings")}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
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

      <img
        src={infoBtnImg}
        alt="Info"
        onClick={() => navigate("/info")}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
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

      <button
        onClick={handleClearCache}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        style={{
          position: "fixed",
          bottom: "2%",
          left: "2%",
          zIndex: 3,
          padding: "8px 14px",
          fontSize: "12px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "rgba(232, 225, 207, 0.92)",
          cursor: "pointer",
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
          fontFamily: "'Fredoka One', cursive",
          transition: "transform 0.1s ease",
        }}
      >
        Clear Cache
      </button>

      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 2 }}>
        {session && (
          <>
            <p style={{ color: "black", margin: "0 0 8px 0" }}>
              Logged in as User: <strong>{userLabel}</strong>
            </p>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/auth");
              }}
              style={{ cursor: "pointer" }}
            >
              Log out
            </button>
          </>
        )}

        {!session && guestMode && guestProfile && (
          <>
            <p style={{ color: "black", margin: "0 0 8px 0" }}>
              Playing as Guest: <strong>{guestProfile.display_name}</strong>
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