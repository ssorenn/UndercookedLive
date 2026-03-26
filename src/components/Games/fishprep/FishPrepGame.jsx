import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { saveLevelResult } from "../../../utils/levelProgress";
import "./styles.css";
import blankHoney from "../../../assets/sprites/fish-prep/blankhoney.png";
//import filledHoney from "../../../assets/sprites/fish-prep/honey2.png";

export default function FishPrepGame() {
  const navigate = useNavigate();
  const gameLoaded = useRef(false);

  useEffect(() => {
    if (gameLoaded.current) return;
    gameLoaded.current = true;

    // Load JS
    const script = document.createElement("script");
    script.src = new URL("./script.js", import.meta.url).href;
    script.defer = true;
    document.body.appendChild(script);

    const handleComplete = (e) => {
      const stars = e.detail?.stars ?? 0;
      saveLevelResult(2, stars);
      navigate("/levels");
    };

    window.addEventListener("fishPrepComplete", handleComplete);

    return () => {
      window.removeEventListener("fishPrepComplete", handleComplete);
      document.body.removeChild(script);
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
      </div>
    </div>
  );
}