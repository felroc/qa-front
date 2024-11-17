import myImage from './img/sqa.jpg';
import React, { Component , useEffect, useState} from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
    const { login } = useAuth();    
    const navigate = useNavigate();
    const [name,setName]  = useState('')

    useEffect(() => {
        const data = localStorage.getItem('user');
        if (data) {
        // console.log('Welcome: ',JSON.parse(data))    
        setName(JSON.parse(data).fullname)    
        }
    }, []);

    // render() {
        return (
        <>
            <h1 className='mt-3'>Bienvenido!</h1>
            <hr></hr>
            <p>
                Sistema para la gestión y control de calidad del Sofware
            </p>
            <button type="button" onClick={()=>{navigate('/login')}} className='btn btn-primary'>Login</button>
            <hr></hr>
            <img src={myImage} alt="Imagen SQA" style={{width:"600px"}}></img>
        </>
        );
    // }
}

export default Welcome;