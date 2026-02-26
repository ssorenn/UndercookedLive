import { useNavigate } from "react-router-dom";

export default function Settings() {
  const nav = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h1>Settings screen</h1>
      <button onClick={() => nav("/")}>Back to Menu</button>
      {}
    </div>
  );
}
