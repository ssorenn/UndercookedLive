import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { isGuestMode, getGuestProfile, endGuestMode } from "./guestSession";

export default function StartMenu() {
  const nav = useNavigate();

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
    </div>
  );
}
