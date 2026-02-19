import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

export default function StartMenu() {
  const nav = useNavigate();

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <h1>Start Menu</h1>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={() => nav("/game")}>Play</button>
        <button onClick={() => supabase.auth.signOut()}>Log out</button>
      </div>
    </div>
  );
}
