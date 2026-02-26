import { useNavigate } from "react-router-dom";
import { useState } from "react";
import homescreenImg from "../assets/homescreen.jpg";

export default function Settings() {
  const navigate = useNavigate();

  // Load saved settings if they exist
  const savedSettings = JSON.parse(localStorage.getItem("gameSettings"));

  const [masterVolume, setMasterVolume] = useState(
    savedSettings?.masterVolume ?? 50
  );
  const [musicVolume, setMusicVolume] = useState(
    savedSettings?.musicVolume ?? 50
  );
  const [soundEffects, setSoundEffects] = useState(
    savedSettings?.soundEffects ?? 50
  );
  const [hardMode, setHardMode] = useState(
    savedSettings?.hardMode ?? false
  );
  const [hints, setHints] = useState(
    savedSettings?.hints ?? true
  );

  // Save function
  const handleSave = () => {
    const settings = {
      masterVolume,
      musicVolume,
      soundEffects,
      hardMode,
      hints,
    };

    localStorage.setItem("gameSettings", JSON.stringify(settings));
    alert("Settings Saved!");
  };

  return (
    <div>
      {/* Background */}
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
        }}
      />

      {/* Settings Panel */}
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
            marginBottom: "40px",
          }}
        >
          SETTINGS
        </h1>

        {/* Sliders */}
        {[
          ["Master Volume", masterVolume, setMasterVolume],
          ["Music Volume", musicVolume, setMusicVolume],
          ["Sound Effects", soundEffects, setSoundEffects],
        ].map(([label, value, setter]) => (
          <div key={label} style={{ marginBottom: "30px" }}>
            <div style={{ fontSize: "26px", marginBottom: "10px" }}>
              {label}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setter(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#8BC34A",
              }}
            />
          </div>
        ))}

        {/* Toggles */}
        {[
          ["Hard Mode", hardMode, setHardMode],
          ["Hints", hints, setHints],
        ].map(([label, value, setter]) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "25px",
              fontSize: "26px",
            }}
          >
            {label}
            <label className="switch">
              <input
                type="checkbox"
                checked={value}
                onChange={() => setter(!value)}
              />
              <span className="slider" />
            </label>
          </div>
        ))}

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "40px",
          }}
        >
          <button
            style={buttonStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
            onClick={handleSave}
          >
            Save
          </button>

          <button
            style={buttonStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
            onClick={() => navigate("/")}
          >
            Exit
          </button>
        </div>
      </div>

      {/* Toggle Styles */}
      <style>
        {`
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #4CAF50;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }
      `}
      </style>
    </div>
  );
}

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