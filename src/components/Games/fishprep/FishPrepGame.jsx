import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveLevelResult } from "../../../utils/levelProgress";
import Settings from "../../Settings";
import "./styles.css";
import blankHoney from "../../../assets/sprites/fish-prep/blankhoney.png";
import settingsCogImg from "../../../assets/settings_cog.png";

export default function FishPrepGame() {
  const navigate = useNavigate();
  //const gameLoaded = useRef(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const oldScript = document.getElementById("fish-prep-script");
    if (oldScript) oldScript.remove();
    window.fishPrepDestroy?.();              // clean old run

    const timer = setTimeout(() => {
      const script = document.createElement("script");
      script.id = "fish-prep-script";
      script.src = new URL("./script.js", import.meta.url).href + "?t=" + Date.now();
      document.body.appendChild(script);
    }, 100);

    const handleComplete = (e) => {
      const stars = e.detail?.stars ?? 0;
      saveLevelResult(2, stars);
      navigate("/level-selection");
    };

    window.addEventListener("fishPrepComplete", handleComplete);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("fishPrepComplete", handleComplete);

      window.fishPrepDestroy?.();            // tear down listeners / overlays from script
      const s = document.getElementById("fish-prep-script");
      if (s) s.remove();
    };
  }, []);

  return (
    <div className="page">
      <div id="scene" className="scene">
        <div id="hint" className="hint">Grab a fish from the tray!</div>
        <div id="zone-fishtray" className="fishTrayZone"></div>

        <img id="deadfish" className="sprite" src="/src/assets/sprites/fish-prep/deadfish.png" draggable="false" />
        <div id="cut-line" className="cut-line"></div>
        <img id="fillet" className="sprite fillet" src="/src/assets/sprites/fish-prep/fillet.png" draggable="false" />
        <img id="bonefish" className="sprite bonefish" src="/src/assets/sprites/fish-prep/fishbone2.png" draggable="false" />
        <img id="fishtail" className="sprite fishtail" src="/src/assets/sprites/fish-prep/fishtail.png" draggable="false" />
        <img id="knife" className="sprite knife" src="/src/assets/sprites/fish-prep/knife.png" draggable="false" />

        <img id="compostbin" className="bin" src="/src/assets/sprites/fish-prep/compostbin.png" />
        <img id="recyclebin" className="bin" src="/src/assets/sprites/fish-prep/recyclebin.png" />
        <img id="trashbin" className="bin" src="/src/assets/sprites/fish-prep/trashbin.png" />

        <div id="zone-compost" className="binZone"></div>
        <div id="zone-recycle" className="binZone"></div>
        <div id="zone-trash" className="binZone"></div>

        <div className="dots">
          <div className="dot" data-stage="grab_fish"></div>
          <div className="dot" data-stage="initial"></div>
          <div className="dot" data-stage="fish_cut"></div>
          <div className="dot" data-stage="fillet_done"></div>
        </div>

        <div id="results-overlay" className="results-overlay hidden">
          <div className="results-card">
            <h2 className="results-title">Fish Prep Complete!</h2>
            <div className="results-subtitle" id="results-subtitle">Sustainability Rating</div>
            <div className="results-stars" id="results-stars">
              <div className="honey" data-i="0"><img src={blankHoney} /></div>
              <div className="honey" data-i="1"><img src={blankHoney} /></div>
              <div className="honey" data-i="2"><img src={blankHoney} /></div>
            </div>
            <div className="results-message" id="results-message"></div>
            <button className="results-btn" id="results-continue">Continue</button>
          </div>
        </div>

        {/* Settings button — top right, same as RiverGame */}
        <button
          onClick={() => setShowSettings(true)}
          title="Settings"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            zIndex: 30,
            width: "46px",
            height: "46px",
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(14px) saturate(1.6)",
            WebkitBackdropFilter: "blur(14px) saturate(1.6)",
            border: "1px solid rgba(255,255,255,0.45)",
            borderRadius: "14px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1) rotate(22deg)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
          }}
        >
          <img src={settingsCogImg} alt="settings" style={{ width: "26px", height: "26px", objectFit: "contain" }} />
        </button>
      </div>

      {/* Settings overlay — renders outside the scene so it covers everything */}
      {showSettings && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60 }}>
          <Settings
            onClose={() => setShowSettings(false)}
            extraButtons={
              <button
                onClick={() => navigate("/level-selection")}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                style={{
                  padding: "14px 38px",
                  fontSize: "20px",
                  borderRadius: "18px",
                  border: "none",
                  backgroundColor: "#c0392b",
                  color: "white",
                  cursor: "pointer",
                  boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
                  fontFamily: "'Fredoka One', cursive",
                  transition: "transform 0.1s ease",
                }}
              >
                Main Menu
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}