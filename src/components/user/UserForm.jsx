import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MSG_NO_USER = "Ingrese el usuario";
const MSG_NO_FULLNAME = "Ingrese el nombre completo";
const MSG_NO_EMAIL = "Ingrese el correo electrónico";
const MSG_NO_PWD = "Ingrese la contraseña";

const UserForm = ({backend}) => {

    const showMessage = (msg) => {
        toast.success(msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
    
    const [userName , setUserName] = useState("");
    const [fullName , setFullName] = useState("");
    const [email , setEmail] = useState("");
    const [pwd , setPwd] = useState("");
    const [confirma, setConfirma] = useState('');

    // OnFocus
    const inputName = useRef(null);

    // Evento Page Load
    useEffect( ()=>{
        inputName.current.focus();
    },[])

    
    const onChangeUserName = (e)=>{        
        setUserName(e.target.value);
    }
    const onChangeFullName = (e)=>{        
        setFullName(e.target.value);
    }
    const onChangeEmail = (e)=>{        
        setEmail(e.target.value);
    }
    const onChangePwd = (e)=>{        
        setPwd(e.target.value);
    }
    const onChangeConfirma = (e)=>{        
        setConfirma(e.target.value);
    }
    
    const onSubmit = (e)=>{
        e.preventDefault();
        
        // Validaciones
        if( userName.length === 0 ) {
            return showMessage(MSG_NO_USER);
        }
        else if( fullName.length === 0 ){
            return showMessage(MSG_NO_FULLNAME);
        }
        else if( email.length === 0 ){
            return showMessage(MSG_NO_EMAIL);
        }
        else if( pwd.length === 0 ){
            return showMessage(MSG_NO_PWD);
        }
        else {
            createNewTask(true);
        }
    }

    const createNewTask = async(valid)=>{
        if( valid ) {
            const datos = {
                userName,
                fullName,
                email,
                pwd,
                estado: 'Activo',
                rol_id: 1,                
            }
            
            await fetch(backend+'/api/qa/user', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);
                //if( data.affectedRows === 1 ) {}
                if( data.msg === userName ) {
                    console.info('Proyecto: API Success'); 
                    //console.log(data);
                    showMessage("El usuario se guardó correctamente!")
                    return "OK";
                }
                else {
                    console.error("MySQL Error");
                    //console.log(data);
                    showMessage(data);
                    return data;
                }
            })
            .catch(error => {
                console.error('API Error');
                console.log(error);
                return error;
            });
        }
    };
    
    return (
    <form onSubmit={onSubmit}>
        <ToastContainer></ToastContainer>
        <div className="mb-3">

            <div className="row">

                <div className="col-md-4">
                    <label htmlFor="fullname" className="form-label">Nombre Completo</label>
                    <input type="text"value={fullName} onChange={onChangeFullName} name="fullname" className="form-control" required={true} ref={inputName} />
                </div>

                <div className="col-md-4">
                    <label htmlFor="username" className="form-label">Usuario</label>
                    <input type="text" value={userName} onChange={onChangeUserName} name="username" className="form-control" required={true}/>
                </div>
            </div>

            <div className="row">
                <div className="col-md-4">
                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                    <input type="text" value={email} onChange={onChangeEmail} name="email" className="form-control" required={true}/>
                </div>

                <div className="col-md-4">
                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                    <input type="text" value={email} onChange={onChangeEmail} name="email" className="form-control" required={true}/>
                </div>
                
                <div className="col-md-4">
                    <label htmlFor="pwd" className="form-label">Contraseña</label>
                    <input type="password" value={pwd} onChange={onChangePwd} name="pwd" className="form-control" required={true}/>
                </div>

                <div className="col-md-4">
                    <label htmlFor="confirma" className="form-label">Confirmacion de Contraseña</label>
                    <input type="password" value={confirma} onChange={onChangeConfirma} name="confirma" className="form-control" required={true}/>
                </div>
            </div>
            
        </div>

        <button type="submit" className="btn btn-primary" >Guardar</button> 

    </form>
    )
}

export default UserForm;