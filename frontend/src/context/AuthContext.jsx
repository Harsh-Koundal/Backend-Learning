import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(token ? jwtDecode(token) : null);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(jwtDecode(newToken));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };


  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = (localStorage.getItem("token"));
        setToken(newToken);
        setUser(newToken ? jwtDecode(newToken) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
