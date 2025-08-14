import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { ReactNode } from "react";

const PublicRoutes = ({ children }: { children?: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (children) return <>{children}</>;

  return <Outlet />;
};

export default PublicRoutes;
