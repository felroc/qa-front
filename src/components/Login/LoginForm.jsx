//import './Login.css'; afecta todas las paginas
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const LoginForm = ({frontend,backend}) => {
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
    
    const [username, setUserName] = useState('');
    const [pwd, setPwd] = useState('');    

    useEffect(() => {        
        
        const data = localStorage.getItem('user');
        // console.log('LoginForm: ',data)

        if (data) {
            // console.log('LoginForm: ',JSON.parse(data))
            setUserName(JSON.parse(data).username); 
            // login(JSON.parse(data))
        }
    }, []);
    
    const onChangeUser = (event) => {
        setUserName(event.target.value);
    };

    const onChangePwd = (event) => {
        setPwd(event.target.value);
    };

    const onSubmit = async (event) => {

        event.preventDefault();  // Se cancela el PostBack
    }
        
    const onClick = async () => {
        console.log('url login',backend+'/api/qa/Login/'+username+'/'+pwd)
        await axios.get(backend+'/api/qa/Login/'+username+'/'+pwd)
        .then(response => {
            console.log('API LOGIN:',response.data); // Imprime los datos de la respuesta
            if( response.data == "NO RECORD!" )
                Notificacion('Login incorrecto, verifique su contraseña... ',"error"); 
            else {                
                Notificacion('Login OK... ',"success" ); 
                const data = {
                    username: username, 
                    fullname: response.data[0].Fullname, 
                    rol_id:response.data[0].Rol_Id
                }
                login(data);                
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

                <div className='row mt-3'>
                    <div className='col-md-6'>
                    <label>Usuario</label>
                    <input autoComplete="" type="text" value={username} onChange={onChangeUser} placeholder="Escriba el nombre de usuario" required className="form-control"></input>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className='col-md-6'>
                    <label>Contraseña</label>
                    <input autoComplete="" type="password" value={pwd} onChange={onChangePwd} placeholder="Escriba la contraseña" required className='form-control'></input>
                    </div>
                </div>

                <div className='row mt-3 '>
                    <div className='col-md-6 contenedor'>
                        <button onClick={()=>{onClick()}} type="submit" className='btn btn-success' style={{width:"150px"}}>Login</button>
                    </div>
                </div>

            </form>            
        </div>
    );
};

export default LoginForm;