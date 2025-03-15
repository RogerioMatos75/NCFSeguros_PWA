import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { auth, type AuthUser } from "@/lib/firebase";
import type { User } from "@shared/schema";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const currentUser = auth.currentUser as AuthUser | null;
  
  const { data: user } = useQuery<User | null>({
    queryKey: [`/api/users/${currentUser?.uid}`],
    enabled: !!currentUser?.uid,
  });

  useEffect(() => {
    if (!currentUser) {
      setLocation("/auth");
      return;
    }

    if (adminOnly && !user?.isAdmin) {
      setLocation("/dashboard");
    }
  }, [currentUser, user, setLocation, adminOnly]);

  if (!currentUser || (adminOnly && !user?.isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
