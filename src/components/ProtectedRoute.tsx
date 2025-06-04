import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string; // optional role required to access the route
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // Logged in but does not have the required role
    return <Navigate to="/" replace />;
  }

  // Authorized, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
