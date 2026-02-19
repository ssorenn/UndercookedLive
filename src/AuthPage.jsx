import { useState } from "react";
import { supabase } from "./supabase";
import { Navigate } from "react-router-dom";
import { useSession } from "./useSession"; 

export default function AuthPage() {
  const { session, loading } = useSession();  
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [displayName, setDisplayName] = useState("");

  if (!loading && session) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
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
      <h1 style={{ marginBottom: 12 }}>{mode === "login" ? "Sign in" : "Create account"}</h1>

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
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
