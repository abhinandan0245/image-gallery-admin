import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  // Agar already logged in ho → login/register allow hi nahi
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
