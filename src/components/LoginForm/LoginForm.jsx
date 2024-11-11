import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

//import './LoginForm.css';

const LoginForm = ({frontend}) =>{
    const navigate = useNavigate();

    const [inputValueUser, setInputValueUser] = useState('');
    const [inputValuePwd, setInputValuePwd] = useState('');

    const handleChangeUser = (event) => {
        setInputValueUser(event.target.value);
    };

    const handleChangePwd = (event) => {
        setInputValuePwd(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();  
        
        console.log('El valor del input es:', inputValueUser);
        console.log('El valor del input es:', inputValuePwd);
        // Aquí puedes enviar los datos a un servidor o realizar otras acciones
        
        // const  url = 'http://localhost:8081/api/qa/Login/'+inputValueUser+'/'+inputValuePwd ;
        // alert(url);

        await axios.get('http://localhost:8081/api/qa/Login/'+inputValueUser+'/'+inputValuePwd)
        .then(response => {
            console.log(response.data); // Imprime los datos de la respuesta
            if( response.data == "NO RECORD!" )
                alert('Login Failed: ' + inputValueUser ); 
            else {
                //alert('Login OK: ' + inputValueUser );  
                navigate('/proyecto');
            }
                
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
            alert('Login Failed: '+error.message);
        });        
    };

    return (
        <div className='wrapper'>
            <form action='' onSubmit={handleSubmit}> 
                <h1>Login</h1>
                <div className='input-box'>
                    <input id="txtUsername" type="text" value={inputValueUser} onChange={handleChangeUser} placeholder="Escriba el nombre de usuario" required></input>
                </div>
                <div className="input-box">
                    <input id="txtPwd" type="password" value={inputValuePwd} onChange={handleChangePwd} placeholder="Escriba la contraseña" required></input>
                </div>
                <div className='input-box'>
                    <input id="btnLogin" type="submit" value={'Login'} className='btn btn-success'></input>
                    {/* onClick={GetLogin}  */}
                </div>                
            </form>            
        </div>
    );
};

export default LoginForm;