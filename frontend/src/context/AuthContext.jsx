import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api, { setAccessToken } from "./api";

export const AuthContext = createContext();

const safeDecode = (token) => {
  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Invalid token found → removing it.", err);
    localStorage.removeItem("token");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");

  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(storedToken ? safeDecode(storedToken) : null);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(safeDecode(newToken)); 
    setAccessToken(newToken); 
  };

  const logout = async () => {
    try {
      await api.post("/api/logout");
    } catch {}
    setAccessToken(null);
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
      setUser(newToken ? safeDecode(newToken) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
