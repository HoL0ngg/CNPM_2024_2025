// src/routes/AppRoutes.js
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import FoodMenu from "../components/FoodMenu";
import UserManagement from "../components/pages/admin/UserManagement";
// import FoodManagement from "../pages/staff/FoodManagement";

const AppRoutes = ({ user, onLoginSuccess }) => {
  if (!user)
    return (
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={onLoginSuccess} />} />
        <Route
          path="/login"
          element={<Login onLoginSuccess={onLoginSuccess} />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );

  return (
    <Routes>
      {user.role === "admin" && (
        <Route path="/admin" element={<UserManagement />} />
      )}
      {/* {user.role === "staff" && (
        <Route path="/staff" element={<FoodManagement />} />
      )} */}
      {user.role === "user" && <Route path="/user" element={<FoodMenu />} />}
      {/* Chuyển hướng nếu không khớp */}
      <Route path="*" element={<Navigate to={`/${user.role}`} />} />
    </Routes>
  );
};

export default AppRoutes;
