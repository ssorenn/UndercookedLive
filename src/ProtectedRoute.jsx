import { Navigate } from "react-router-dom";
import { useSession } from "./useSession";
import { isGuestMode } from "./guestSession";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useSession();

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  // Allow access if logged in OR guest profile exists
  if (!session && !isGuestMode()) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
