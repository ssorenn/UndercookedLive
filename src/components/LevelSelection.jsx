import { useNavigate } from "react-router-dom";
import homescreenImg from "../assets/homescreen.jpg";

const LEVELS = [
  { id: 1, name: "Let's Fish!", stars: 3, unlocked: true },
  { id: 2, name: "Prepare Your Fish", stars: 2, unlocked: true },
  { id: 3, name: "Stack the Sushi", stars: 0, unlocked: false },
  { id: 4, name: "Trash Sorting", stars: 0, unlocked: false },
  { id: 5, name: "River Rescue", stars: 0, unlocked: false },
  { id: 6, name: "Forest Cleanup", stars: 0, unlocked: false },
  { id: 7, name: "Sorting Sprint", stars: 0, unlocked: false },
  { id: 8, name: "Bear Builder", stars: 0, unlocked: false },
  { id: 9, name: "Clean Air Quest", stars: 0, unlocked: false },
];

function StarRating({ stars, unlocked }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        justifyContent: "center",
        marginTop: "10px",
      }}
    >
      {[1, 2, 3].map((s) => (
        <span
          key={s}
          style={{
            fontSize: "1.2rem",
            color: unlocked && s <= stars ? "#FFD700" : "#cfcfcf",
            textShadow: unlocked && s <= stars ? "0 0 6px rgba(255,215,0,0.55)" : "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function LevelCard({ level, navigate }) {
  return (
    <div
      onClick={() => level.unlocked && navigate(`/level/${level.id}`)}
      onMouseEnter={(e) => {
        if (level.unlocked) {
          e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 14px 26px rgba(0,0,0,0.18)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = level.unlocked
          ? "0 8px 16px rgba(0,0,0,0.12)"
          : "0 5px 12px rgba(0,0,0,0.08)";
      }}
      style={{
        position: "relative",
        background: level.unlocked
          ? "linear-gradient(180deg, rgba(243,236,217,0.98) 0%, rgba(232,225,207,0.98) 100%)"
          : "linear-gradient(180deg, rgba(220,220,220,0.45) 0%, rgba(198,198,198,0.35) 100%)",
        borderRadius: "24px",
        padding: "22px 18px",
        minHeight: "160px",
        textAlign: "center",
        cursor: level.unlocked ? "pointer" : "not-allowed",
        boxShadow: level.unlocked
          ? "0 8px 16px rgba(0,0,0,0.12)"
          : "0 5px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        filter: level.unlocked ? "none" : "grayscale(0.45) brightness(0.92)",
        opacity: level.unlocked ? 1 : 0.72,
        border: level.unlocked
          ? "2px solid rgba(255,255,255,0.45)"
          : "2px solid rgba(255,255,255,0.25)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-18px",
          right: "-10px",
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: level.unlocked
            ? "rgba(255,255,255,0.18)"
            : "rgba(255,255,255,0.12)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontSize: "38px",
          lineHeight: 1,
          color: level.unlocked ? "#1f1f1f" : "#666",
          textShadow: "0 2px 0 rgba(255,255,255,0.25)",
        }}
      >
        {level.id}
      </div>

      <div
        style={{
          fontSize: "20px",
          marginTop: "8px",
          lineHeight: 1.2,
          color: level.unlocked ? "#2f2b25" : "#666",
          minHeight: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 6px",
        }}
      >
        {level.name}
      </div>

      <StarRating stars={level.stars} unlocked={level.unlocked} />

      {!level.unlocked && (
        <div
          style={{
            fontSize: "1.2rem",
            marginTop: "10px",
            opacity: 0.55,
          }}
        >
          🔒
        </div>
      )}
    </div>
  );
}

export default function LevelSelection() {
  const navigate = useNavigate();

  return (
    <div>
      <img
        src={homescreenImg}
        alt="Level Selection Background"
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

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "74vw",
          maxWidth: "1100px",
          height: "74vh",
          background: "linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(239,245,248,0.72) 100%)",
          borderRadius: "36px",
          padding: "34px 34px 28px 34px",
          backdropFilter: "blur(18px)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.16)",
          zIndex: 1,
          fontFamily: "'Fredoka One', cursive",
          border: "2px solid rgba(255,255,255,0.35)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px", flexShrink: 0 }}>
          <h1
            style={{
              fontSize: "52px",
              letterSpacing: "1px",
              margin: 0,
              color: "#111",
              textShadow: "0 2px 0 rgba(255,255,255,0.35)",
            }}
          >
            Select Level
          </h1>
          <div
            style={{
              marginTop: "10px",
              fontSize: "16px",
              color: "#5f5a52",
              opacity: 0.85,
            }}
          >
            Choose your next adventure
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "8px",
          }}
          className="levelSelectionScroll"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "20px",
              alignItems: "stretch",
            }}
          >
            {LEVELS.map((level) => (
              <LevelCard key={level.id} level={level} navigate={navigate} />
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "24px",
            flexShrink: 0,
          }}
        >
          <button
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 12px 18px rgba(0,0,0,0.16)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.15)";
            }}
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>
      </div>

      <style>
        {`
          .levelSelectionScroll::-webkit-scrollbar {
            width: 10px;
          }

          .levelSelectionScroll::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.28);
            border-radius: 999px;
          }

          .levelSelectionScroll::-webkit-scrollbar-thumb {
            background: rgba(153, 165, 133, 0.7);
            border-radius: 999px;
          }

          .levelSelectionScroll::-webkit-scrollbar-thumb:hover {
            background: rgba(124, 138, 102, 0.85);
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
  transition: "transform 0.1s ease, box-shadow 0.1s ease",
};