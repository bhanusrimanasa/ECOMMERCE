import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";

const ProtectedRoute = ({ children, isAdmin }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  // Show a loading screen while user authentication status is verified
  if (loading) {
    return <Loader />;
  }

  // If not authenticated, redirect smoothly to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If it's an admin route, ensure the user has the 'admin' privilege role
  if (isAdmin === true && user && user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // If all validation passes, render the protected page content
  return children;
};

export default ProtectedRoute;