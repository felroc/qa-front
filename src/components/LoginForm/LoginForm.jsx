import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { useAuth } from "../../AuthContext";


//import './LoginForm.css';

const LoginForm = ({frontend}) => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const MySwal = withReactContent(Swal);

    const Notificacion = async (msg, icono) => {
        await Swal.fire({
            position: "top-end",
            icon: icono,
            title: msg,
            showConfirmButton: false,
            timer: 3000
          });
    }

    
    const [user, setInputValueUser] = useState('');
    const [pwd, setInputValuePwd] = useState('');

    const onChangeUser = (event) => {
        setInputValueUser(event.target.value);
    };

    const onChangePwd = (event) => {
        setInputValuePwd(event.target.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();  
        
        console.log('El valor del input es:', user);
        console.log('El valor del input es:', pwd);
        // Aquí puedes enviar los datos a un servidor o realizar otras acciones
        
        // const  url = 'http://localhost:8081/api/qa/Login/'+user+'/'+pwd ;
        // alert(url);

        await axios.get('http://localhost:8081/api/qa/Login/'+user+'/'+pwd)
        .then(response => {
            console.log(response.data); // Imprime los datos de la respuesta
            if( response.data == "NO RECORD!" )
                Notificacion('Login incorrecto, verifique su contraseña... ' + user,"error"); 
            else {
                login();
                Notificacion('Login OK... ' + user,"success" ); 
                navigate('/dashboard');
            }
        })
        .catch(error => {
            Notificacion(error,'error')
            console.error(`Error: ${error.message}`);            
        });        
    };

    return (
        <div className='wrapper mt-3'>
            {/* action='' */}
            <form onSubmit={onSubmit}> 

                <h1>Login</h1>

                <hr></hr>

                <div className='input-box mt-3'>
                    <input id="txtUsername" type="text" value={user} onChange={onChangeUser} placeholder="Escriba el nombre de usuario" required></input>
                </div>

                <div className="input-box mt-3">
                    <input id="txtPwd" type="password" value={pwd} onChange={onChangePwd} placeholder="Escriba la contraseña" required></input>
                </div>

                <div className='input-box mt-3'>
                    <button type="submit" className='btn btn-success'>Login</button>
                    {/* <input type="submit" value={'Login'} className='btn btn-success'></input> */}
                    {/* onClick={GetLogin}  */}
                </div>

            </form>            
        </div>
    );
};

export default LoginForm;