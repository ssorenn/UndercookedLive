import { Navigate } from "react-router-dom";
import { useSession } from "./useSession";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useSession();

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  if (!session) return <Navigate to="/auth" replace />;

  return children;  // Allow access if logged in
}
