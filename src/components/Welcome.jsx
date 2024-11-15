// Componente basado en clase
import React, { Component , useEffect, useState} from "react";
import myImage from './img/sqa.jpg';
import { useAuth } from "../AuthContext";

const Welcome = () => {
    const { login } = useAuth();
    const [user,setUser]=useState('')
  
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        console.log('storedUser: ',storedUser)
        if (storedUser===null) {          
        //   setUser(JSON.parse(storedUser));             
        }
        else {
            login()   
        }
      }, [user]);

    // render() {
        return (
        <>
            <h1>Bienvenido!</h1>
            <hr></hr>
            <p>
                Sistema para la gestión y control de calidad del Sofware
            </p>
            <img src={myImage} alt="Imagen SQA"></img>
        </>
        );
    // }
}

export default Welcome;