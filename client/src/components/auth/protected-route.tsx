import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setLocation("/auth");
        return;
      }

      if (adminOnly && role !== 'admin') {
        setLocation("/dashboard");
      }
    }
  }, [user, role, loading, setLocation, adminOnly]);

  if (loading || !user || (adminOnly && role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
}
