import { useNavigate } from "react-router-dom";
import { useState } from "react";
import homescreenImg from "../assets/homescreen.jpg";

import sushiSalmon from "../assets/sprites/sushi_salmon.png";
import sushiShrimp from "../assets/sprites/sushi_shrimp.png";
import sushiTamago from "../assets/sprites/sushi_tamago.png";

export default function Settings() {
  const navigate = useNavigate();
  const savedSettings = JSON.parse(localStorage.getItem("gameSettings"));

  const [masterVolume, setMasterVolume] = useState(savedSettings?.masterVolume ?? 50);
  const [musicVolume, setMusicVolume] = useState(savedSettings?.musicVolume ?? 50);
  const [soundEffects, setSoundEffects] = useState(savedSettings?.soundEffects ?? 50);
  const [hardMode, setHardMode] = useState(savedSettings?.hardMode ?? false);
  const [hints, setHints] = useState(savedSettings?.hints ?? true);

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

  const handleReset = () => {
    const defaults = {
      masterVolume: 50,
      musicVolume: 50,
      soundEffects: 50,
      hardMode: false,
      hints: true,
    };

    setMasterVolume(defaults.masterVolume);
    setMusicVolume(defaults.musicVolume);
    setSoundEffects(defaults.soundEffects);
    setHardMode(defaults.hardMode);
    setHints(defaults.hints);

    localStorage.setItem("gameSettings", JSON.stringify(defaults));
  };

  const sliderRows = [
    { label: "Master Volume", value: masterVolume, setter: setMasterVolume, img: sushiSalmon },
    { label: "Music Volume", value: musicVolume, setter: setMusicVolume, img: sushiShrimp },
    { label: "Sound Effects", value: soundEffects, setter: setSoundEffects, img: sushiTamago },
  ];

  const toggleRows = [
    { label: "Hard Mode", value: hardMode, setter: setHardMode },
    { label: "Hints", value: hints, setter: setHints },
  ];

  return (
    <div>
      <img
        src={homescreenImg}
        alt=""
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

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
        <h1 style={{ textAlign: "center", fontSize: "52px", marginBottom: "40px" }}>
          SETTINGS
        </h1>

        {sliderRows.map((row) => (
          <div key={row.label} style={{ marginBottom: "40px" }}>
            <div style={{ fontSize: "26px", marginBottom: "12px" }}>{row.label}</div>

            <div className="sliderWrap" style={{ ["--val"]: row.value / 100 }}>
              <input
                type="range"
                min="0"
                max="100"
                value={row.value}
                className="sushiRange"
                onChange={(e) => row.setter(Number(e.target.value))}
                style={{
                  background: `linear-gradient(
                    to right,
                    #7FBF3F 0%,
                    #7FBF3F ${row.value}%,
                    #dfe8d1 ${row.value}%,
                    #dfe8d1 100%
                  )`,
                }}
              />
              <img className="sushiKnob" src={row.img} alt="" draggable={false} />
            </div>
          </div>
        ))}

        {toggleRows.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "25px",
              fontSize: "26px",
            }}
          >
            {row.label}
            <label className="switch">
              <input type="checkbox" checked={row.value} onChange={() => row.setter(!row.value)} />
              <span className="slider" />
            </label>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
          <button style={buttonStyle} onClick={handleSave}>Save</button>
          <button style={buttonStyle} onClick={handleReset}>Reset</button>
          <button style={buttonStyle} onClick={() => navigate("/")}>Exit</button>
        </div>
      </div>

      <style>
        {`
        .sliderWrap{
          position: relative;
          width: 100%;
          height: 64px;
          --thumbSize: 56px;
          --trackH: 14px;
          --pad: calc(var(--thumbSize) / 2);
          padding-left: var(--pad);
          padding-right: var(--pad);
          box-sizing: border-box;
        }

        .sushiRange{
          position: absolute;
          left: var(--pad);
          width: calc(100% - (var(--pad) * 2));
          top: 50%;
          transform: translateY(-50%);
          height: var(--trackH);
          appearance: none;
          border-radius: 10px;
          outline: none;
        }

        .sushiRange::-webkit-slider-runnable-track{
          height: var(--trackH);
          border-radius: 10px;
        }

        .sushiRange::-webkit-slider-thumb{
          appearance: none;
          width: var(--thumbSize);
          height: var(--thumbSize);
          background: transparent;
          border: none;
          margin-top: calc((var(--trackH) - var(--thumbSize)) / 2);
          cursor: pointer;
        }

        .sushiKnob{
          position: absolute;
          top: 50%;
          left: calc(var(--pad) + (100% - (2 * var(--pad))) * var(--val));
          transform: translate(-50%, -50%);
          width: var(--thumbSize);
          height: var(--thumbSize);
          object-fit: contain;
          pointer-events: none;
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
          user-select: none;
        }

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
          inset: 0;
          background-color: #ccc;
          border-radius: 34px;
        }

        .slider:before {
          content: "";
          position: absolute;
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          border-radius: 50%;
          transition: .3s;
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
};
