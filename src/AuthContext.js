import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState({
    username: null,
    fullname: null,
    rol_id: null,
  });

  const navigate = useNavigate();

  const login = (username, fullname, rol_id) => {
    setIsAuthenticated(true);
    setUser({ username, fullname, rol_id });
    navigate("/dashboard"); // Redirige a la página protegida después de iniciar sesión
  };

  const logout = () => {
    setUser({ username: null, fullname: null, rol_id: null });
    setIsAuthenticated(false);
    //navigate("/login"); // Redirige a la página de inicio de sesión después de cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
