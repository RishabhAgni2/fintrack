import { createContext, useContext, useState } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  /**
   * Login User
   */
  const login = async (email, password) => {
    const { data } = await axios.post("/auth/login", {
      email,
      password,
    });

    // Store JWT
    localStorage.setItem("token", data.token);

    // Store user info
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  /**
   * Register User
   */
  const register = async (name, email, password) => {
    const { data } = await axios.post("/auth/register", {
      name,
      email,
      password,
    });

    localStorage.setItem("token", data.token);

    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  /**
   * Logout User
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};