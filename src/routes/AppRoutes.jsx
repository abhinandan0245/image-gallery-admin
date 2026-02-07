import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import UploadImage from "../pages/UploadImage";
import ImageManagement from "../pages/ImageManagement";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

const AppRoutes = () => (
  <Routes>
    {/* Public Routes (Only for NOT logged-in users) */}
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Protected Routes + Layout */}
    <Route
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route path="/" element={<Dashboard />} />
      <Route path="/upload" element={<UploadImage />} />
      <Route path="/images" element={<ImageManagement />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
  </Routes>
);

export default AppRoutes;
