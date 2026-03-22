import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/transactions" element={
          <ProtectedRoute><Transactions /></ProtectedRoute>
        } />

        <Route path="*" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
