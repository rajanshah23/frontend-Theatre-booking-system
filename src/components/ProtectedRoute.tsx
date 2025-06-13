import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;  
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
     
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    
    return <Navigate to="/" replace />;
  }

 
  return <>{children}</>;
};

export default ProtectedRoute;