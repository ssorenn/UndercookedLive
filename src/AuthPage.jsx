import { useState } from "react";
import { supabase } from "./supabase";
import { Navigate, useNavigate } from "react-router-dom";
import { useSession } from "./useSession";
import { startGuestMode } from "./guestSession";

import homescreenImg from "./assets/homescreen.jpg";

export default function AuthPage() {
  const { session, loading } = useSession();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  if (!loading && session) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setBusy(false);
      setMsg("Please enter a valid email (example: name@gmail.com).");
      return;
    }

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
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

        setMsg(
          "Signed up! If email confirmation is enabled, check your inbox."
        );
      }
    } catch (err) {
      setMsg(err?.message ?? "Auth failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {/* Background */}
      <img
        src={homescreenImg}
        alt="background"
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

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60vw",
          maxWidth: "800px",
          background: "rgba(255,255,255,0.75)",
          borderRadius: "35px",
          padding: "50px",
          backdropFilter: "blur(18px)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          zIndex: 1,
          fontFamily: "'Fredoka One', cursive",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "52px",
            letterSpacing: "2px",
            marginBottom: "20px",
          }}
        >
          {mode === "login" ? "LOGIN" : "SIGN UP"}
        </h1>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          style={{
            display: "grid",
            gap: "22px",
          }}
        >
          {mode === "signup" && (
            <div>
              <div style={{ fontSize: "26px", marginBottom: "8px" }}>
                Display Name
              </div>

              <input
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <div style={{ fontSize: "26px", marginBottom: "8px" }}>
              Email
            </div>

            <input
              type="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <div style={{ fontSize: "26px", marginBottom: "8px" }}>
              Password
            </div>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "25px",
              gap: "15px",
            }}
          >
            <button
              disabled={busy}
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {busy ? "..." : mode === "login" ? "Login" : "Sign Up"}
            </button>

            <button
              type="button"
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={() => {
                startGuestMode();
                navigate("/");
              }}
            >
              Play as Guest
            </button>
          </div>
        </form>

        {msg && (
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              fontSize: "18px",
            }}
          >
            {msg}
          </p>
        )}

        {/* Toggle Login/Signup */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            type="button"
            onClick={() => {
              const nextMode = mode === "login" ? "signup" : "login";
              setMode(nextMode);
              setMsg("");

              if (nextMode === "login") setDisplayName("");
            }}
            style={{
              background: "none",
              border: "none",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "20px",
              fontFamily: "'Fredoka One', cursive",
            }}
          >
            {mode === "login" ? "OR Sign up" : "OR Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  fontSize: "18px",
  borderRadius: "14px",
  border: "1px solid rgba(0,0,0,0.15)",
  outline: "none",
  background: "rgba(255,255,255,0.85)",
  fontFamily: "'Fredoka One', cursive",
};

const buttonStyle = {
  padding: "14px 38px",
  fontSize: "20px",
  borderRadius: "18px",
  border: "none",
  backgroundColor: "#e8e1cf",
  cursor: "pointer",
  boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
  fontFamily: "'Fredoka One', cursive",
  transition: "transform 0.1s ease",
};