import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { ReactNode } from "react";

const ProtectedRoutes = ({ children }: { children?: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  if (children) return <>{children}</>;

  return <Outlet />;
};

export default ProtectedRoutes;
