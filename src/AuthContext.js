import React, { createContext, useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState( () =>{
    // Sirve para que al presionar F5 no se redireccione al Login
    const data = localStorage.getItem('user');
    return data ? true : false
  } );

  const [user, setUser] = useState({ 
      username: null,
      fullname: null,
      rol_id: null    
  });

  // Validar Sesion
  useEffect(() => {
    const data = localStorage.getItem('user');    
    if( data ) {
      // console.log('AUTH: ',JSON.parse(data))
      // setIsAuthenticated(true)
      setUser(JSON.parse(data)) // Sirve para manter el usuario y mostrar el username en el navbar
    }
  }, []);
  
  // Recuperar
  // useEffect(() => {
  //   const data = localStorage.getItem('user');
  //   if (data) {
  //     console.log('data: ',data)
  //     setUser(JSON.parse(data));      
  //   }
  // }, []);

  // // Guardar 
  // useEffect(() => {
  //   console.log('AUTH Guardar')
  //   localStorage.setItem('user', JSON.stringify(user));
  // }, [user]);

  const login = async (data) => {    
    setIsAuthenticated(true);

    //  console.log('AUTH LOGIN: ', isAuthenticated)
    //  console.log('data:', data) 
    //  console.log('data:', data.username, data.fullname, data.rol_id)    
    
    //localStorage.setItem('user', data); se debe guardar el objeto como JSON
    await localStorage.setItem('user', JSON.stringify(data)); // se debe guardar el objeto como JSON
    
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
