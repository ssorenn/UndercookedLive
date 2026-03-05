import { useNavigate } from "react-router-dom";
import homescreenImg from "../assets/homescreen.jpg";

const LEVELS = [
  { id: 1, name: "Let's Fish!", stars: 3, unlocked: true },
  { id: 2, name: "Prepare Your Fish", stars: 2, unlocked: true },
  { id: 3, name: "Stack the Sushi", stars: 0, unlocked: false },
  { id: 4, name: "Trash Sorting", stars: 0, unlocked: false },
];

function StarRating({ stars, unlocked }) {
  return (
    <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginTop: "8px" }}>
      {[1, 2, 3].map((s) => (
        <span
          key={s}
          style={{
            fontSize: "1.4rem",
            color: unlocked && s <= stars ? "#FFD700" : "#ccc",
            textShadow: unlocked && s <= stars ? "0 0 6px rgba(255,215,0,0.6)" : "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function LevelSelection() {
  const navigate = useNavigate();

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

      {/* Main Panel */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "65vw",
          maxWidth: "860px",
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
            margin: "0 0 40px 0",
          }}
        >
          Select Level
        </h1>

        {/* Level Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {LEVELS.map((level) => (
            <div
              key={level.id}
              onClick={() => level.unlocked && navigate(`/level/${level.id}`)}
              onMouseEnter={(e) => {
                if (level.unlocked) e.currentTarget.style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              style={{
                background: level.unlocked ? "#e8e1cf" : "rgba(200,200,200,0.45)",
                borderRadius: "22px",
                padding: "24px 20px",
                textAlign: "center",
                cursor: level.unlocked ? "pointer" : "not-allowed",
                boxShadow: level.unlocked
                  ? "0 8px 15px rgba(0,0,0,0.15)"
                  : "0 4px 10px rgba(0,0,0,0.08)",
                transition: "transform 0.15s ease",
                filter: level.unlocked ? "none" : "grayscale(0.5) brightness(0.85)",
                opacity: level.unlocked ? 1 : 0.6,
              }}
            >
              <div style={{ fontSize: "42px", fontFamily: "'Fredoka One', cursive", lineHeight: 1 }}>
                {level.id}
              </div>
              <div style={{ fontSize: "20px", marginTop: "6px", fontFamily: "'Fredoka One', cursive" }}>
                {level.name}
              </div>
              <StarRating stars={level.stars} unlocked={level.unlocked} />
              {!level.unlocked && (
                <div style={{ fontSize: "1.4rem", marginTop: "8px", opacity: 0.5 }}>🔒</div>
              )}
            </div>
          ))}
        </div>

        {/* Back button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>
      </div>
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