import { useState } from "react";
import { supabase } from "./supabase";
import { Navigate } from "react-router-dom";
import { useSession } from "./useSession"; 
import { useNavigate } from "react-router-dom";
import { startGuestMode } from "./guestSession";

export default function AuthPage() {
  const { session, loading } = useSession();  
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  if (!loading && session) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    // ✅ minimal: enforce something@something.tld
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setBusy(false);
      setMsg("Please enter a valid email (example: name@gmail.com).");
      return;
    }

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { display_name: displayName },
          },
        });
        if (error) throw error;
        setMsg("Signed up! If email confirmation is enabled, check your inbox.");
      }
    } catch (err) {
      setMsg(err?.message ?? "Auth failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>
        {mode === "login" ? "Sign in" : "Create account"}
      </h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button disabled={busy} type="submit">
          {busy ? "..." : mode === "login" ? "Sign in" : "Sign up"}
        </button>
      </form>

      {/* ✅ Play as Guest */}
      <button
        type="button"
        onClick={() => {
          startGuestMode();     // creates guest_profile in sessionStorage
          navigate("/");        // go to Start Menu
        }}
        style={{
          marginTop: 12,
          width: "100%",
          border: "1px solid #999",
          padding: "8px 12px",
          cursor: "pointer",
          background: "transparent",
        }}
      >
        Play as Guest
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      <button
        type="button"
        onClick={() => {
          const nextMode = mode === "login" ? "signup" : "login";
          setMode(nextMode);
          setMsg("");
          if (nextMode === "login") setDisplayName("");
        }}
        style={{
          marginTop: 16,
          background: "none",
          border: "none",
          padding: 0,
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        {mode === "login" ? "OR Sign up" : "OR Sign in"}
      </button>
    </div>
  );
}
