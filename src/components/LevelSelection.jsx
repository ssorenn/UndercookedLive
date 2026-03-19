import { useNavigate } from "react-router-dom";
import homescreenImg from "../assets/trees_background1.png";

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
            fontSize: "1.1rem",
            color: unlocked && s <= stars ? "#FFD700" : "rgba(220,220,220,0.75)",
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
          e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 16px 28px rgba(0,0,0,0.22)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = level.unlocked
          ? "0 10px 18px rgba(0,0,0,0.16)"
          : "0 8px 14px rgba(0,0,0,0.12)";
        e.currentTarget.style.borderColor = level.unlocked
          ? "rgba(255,255,255,0.35)"
          : "rgba(255,255,255,0.18)";
      }}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "220px",
        height: "148px",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: "18px 14px",
        borderRadius: "24px",
        textAlign: "center",
        cursor: level.unlocked ? "pointer" : "not-allowed",
        background: level.unlocked
          ? "linear-gradient(180deg, rgba(250,244,225,0.95) 0%, rgba(232,225,207,0.92) 100%)"
          : "linear-gradient(180deg, rgba(130,140,132,0.28) 0%, rgba(92,101,93,0.22) 100%)",
        backdropFilter: "blur(8px)",
        border: level.unlocked
          ? "2px solid rgba(255,255,255,0.35)"
          : "2px solid rgba(255,255,255,0.18)",
        boxShadow: level.unlocked
          ? "0 10px 18px rgba(0,0,0,0.16)"
          : "0 8px 14px rgba(0,0,0,0.12)",
        transition: "transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease",
        filter: level.unlocked ? "none" : "grayscale(0.3)",
        opacity: level.unlocked ? 1 : 0.82,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        alignSelf: "start",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-14px",
          right: "-10px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: level.unlocked
            ? "rgba(255,255,255,0.16)"
            : "rgba(255,255,255,0.08)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontSize: "34px",
          lineHeight: 1,
          color: level.unlocked ? "#1f1f1f" : "rgba(255,255,255,0.75)",
          textShadow: level.unlocked ? "0 2px 0 rgba(255,255,255,0.22)" : "none",
        }}
      >
        {level.id}
      </div>

      <div
        style={{
          fontSize: "18px",
          marginTop: "8px",
          lineHeight: 1.2,
          color: level.unlocked ? "#2f2b25" : "rgba(255,255,255,0.8)",
          minHeight: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 4px",
        }}
      >
        {level.name}
      </div>

      <StarRating stars={level.stars} unlocked={level.unlocked} />

      {!level.unlocked && (
        <div
          style={{
            fontSize: "1rem",
            marginTop: "8px",
            opacity: 0.75,
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
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(180deg, rgba(16,28,20,0.28) 0%, rgba(12,20,14,0.42) 100%)",
        }}
      />

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "76vw",
          maxWidth: "1120px",
          height: "76vh",
          background: "linear-gradient(180deg, rgba(242,246,242,0.14) 0%, rgba(226,236,229,0.1) 100%)",
          borderRadius: "38px",
          padding: "30px 30px 24px 30px",
          backdropFilter: "blur(16px)",
          boxShadow: "0 28px 55px rgba(0,0,0,0.28)",
          zIndex: 1,
          fontFamily: "'Fredoka One', cursive",
          border: "1.8px solid rgba(255,255,255,0.2)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              fontSize: "50px",
              letterSpacing: "1px",
              margin: 0,
              color: "#f7f2df",
              textShadow: "0 4px 18px rgba(0,0,0,0.28)",
            }}
          >
            Select Level
          </h1>

          <div
            style={{
              marginTop: "8px",
              fontSize: "16px",
              color: "rgba(247,242,223,0.88)",
              textShadow: "0 2px 10px rgba(0,0,0,0.18)",
            }}
          >
            Choose your next adventure
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "14px",
            paddingLeft: "6px",
          }}
          className="levelSelectionScroll"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "26px 30px",
              justifyItems: "center",
              alignItems: "start",
              padding: "8px 4px 12px 4px",
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
            marginTop: "20px",
            flexShrink: 0,
          }}
        >
          <button
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 14px 20px rgba(0,0,0,0.2)";
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
            background: rgba(255,255,255,0.12);
            border-radius: 999px;
          }

          .levelSelectionScroll::-webkit-scrollbar-thumb {
            background: rgba(203, 214, 180, 0.6);
            border-radius: 999px;
          }

          .levelSelectionScroll::-webkit-scrollbar-thumb:hover {
            background: rgba(214, 226, 189, 0.82);
          }
        `}
      </style>
    </div>
  );
}

const buttonStyle = {
  padding: "14px 40px",
  fontSize: "20px",
  borderRadius: "18px",
  border: "none",
  background: "linear-gradient(180deg, rgba(243,236,217,0.98) 0%, rgba(232,225,207,0.96) 100%)",
  cursor: "pointer",
  boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
  fontFamily: "'Fredoka One', cursive",
  color: "#2f2b25",
  transition: "transform 0.1s ease, box-shadow 0.1s ease",
};