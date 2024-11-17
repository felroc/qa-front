import React, { createContext, useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(
    ()=> {
      const storedUser = localStorage.getItem('user');      
      return storedUser
    }
  );

  const [user, setUser] = useState({
    username: null,
    fullname: null,
    rol_id: null,
  });

   // Recuperar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsAuthenticated(true)
    }
  }, []);
  
  // Recuperar
  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     console.log('storedUser: ',storedUser)
  //     setUser(JSON.parse(storedUser));      
  //   }
  // }, []);

  // // Guardar 
  // useEffect(() => {
  //   console.log('AUTH Guardar')
  //   localStorage.setItem('user', JSON.stringify(user));
  // }, [user]);

  const login = async (data) => {    
    setIsAuthenticated(true);

    // console.log('AUTH LOGIN: ', isAuthenticated)
    // console.log('data:', data.username, data.fullname, data.rol_id)    
    
    localStorage.setItem('user', JSON.stringify(data)); // se debe guardar el objeto como JSON
    
    await setUser(data);    
    // console.log('user:',user )
    
    //navigate("/"); // Redirige a la página protegida después de iniciar sesión
  };

  const logout = () => {    
    console.log('AUTH LOGOUT')

    setIsAuthenticated(false);    

    localStorage.removeItem('user');
   
    //setUser(null);

    //navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user,setUser , login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
