import { useNavigate } from "react-router-dom";
import { useState } from "react";
import storyImg from "../assets/storymode1.png";

const DIALOGUE = [
  { speaker: "Narrator", text: "Long ago, the bears lived in harmony, with clean rivers, tall pines, and fresh mountain air." },
  { speaker: "Narrator", text: "But slowly, trash began to pile up. Where there were once rocks and pebbles, now lay glass shards and crushed cans. Plastic bags floated down the river. The fish disappeared." },
  { speaker: "Narrator", text: "The bears never noticed... until the day the water turned green and nothing grew." },
  { speaker: "Bear Elder", text: "We took and took from this land. Now it is time we learn to give something back." },
  { speaker: "Narrator", text: "Can you help the bears restore their home before it's too late?" },
];

export default function Story1() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < DIALOGUE.length - 1) {
      setIndex(index + 1);
    } else {
      navigate("/level-selection");
    }
  };

  const handleBack = (e) => {
    e.stopPropagation();
    if (index > 0) setIndex(index - 1);
  };

  const current = DIALOGUE[index];
  const isLast = index === DIALOGUE.length - 1;

  return (
    <div>
      {/* Background */}
      <img
        src={storyImg}
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

      {/* Skip button */}
      <button
        onClick={() => navigate("/level-selection")}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        style={{
          position: "fixed",
          top: "3%",
          right: "3%",
          zIndex: 2,
          padding: "14px 38px",
          fontSize: "20px",
          borderRadius: "18px",
          border: "none",
          backgroundColor: "#e8e1cf",
          cursor: "pointer",
          boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
          fontFamily: "'Fredoka One', cursive",
          transition: "transform 0.1s ease",
        }}
      >
        Skip →
      </button>

      {/* Dialogue box area */}
      <div
        onClick={handleNext}
        style={{
          position: "fixed",
          bottom: "4%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vw",
          maxWidth: "900px",
          zIndex: 2,
          cursor: "pointer",
        }}
      >
        {/* Speaker tag */}
        <div
          style={{
            display: "inline-block",
            background: "#f5eedc",
            border: "3px solid #c8b89a",
            borderBottom: "none",
            borderRadius: "14px 14px 0 0",
            padding: "6px 22px",
            fontFamily: "'Fredoka One', cursive",
            fontSize: "18px",
            color: "#5a4a35",
            marginLeft: "24px",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {current.speaker}
        </div>

        {/* Text box */}
        <div
          style={{
            background: "#fdf6e3",
            border: "3px solid #c8b89a",
            borderRadius: "0 18px 18px 18px",
            padding: "24px 32px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
          }}
        >
          <p
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "clamp(16px, 2.2vw, 22px)",
              color: "#3d2e1e",
              margin: 0,
              lineHeight: 1.6,
              minHeight: "60px",
            }}
          >
            {current.text}
          </p>

          {/* Bottom row: back button + dots + continue */}
          <div style={{ display: "flex", alignItems: "center", marginTop: "16px", gap: "10px" }}>

            {/* Back arrow button */}
            <button
              onClick={handleBack}
              disabled={index === 0}
              onMouseEnter={(e) => { if (index > 0) e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              style={{
  background: "transparent",
  border: "none",
  padding: "4px 12px",
  fontFamily: "'Fredoka One', cursive",
  fontSize: "16px",
  color: index === 0 ? "#c8b89a" : "#a08c72",
  cursor: index === 0 ? "not-allowed" : "pointer",
  transition: "transform 0.1s ease",
  flexShrink: 0,
}}
            >
              ◀
            </button>

            {/* Progress dots */}
            {DIALOGUE.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === index ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: i === index ? "#c8b89a" : "#e0d5c0",
                  transition: "width 0.2s ease",
                  flexShrink: 0,
                }}
              />
            ))}

            {/* Continue text */}
            <span
              style={{
                marginLeft: "auto",
                fontFamily: "'Fredoka One', cursive",
                fontSize: "14px",
                color: "#a08c72",
                flexShrink: 0,
              }}
            >
              {isLast ? "Let's go! ▶" : "Click to continue ▶"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}