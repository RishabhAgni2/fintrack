import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./app/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);