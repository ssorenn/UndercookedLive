import { useNavigate } from "react-router-dom";

export default function Game() {
  const nav = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h1>Game Screen</h1>
      <button onClick={() => nav("/")}>Back to Menu</button>
      {}
    </div>
  );
}
