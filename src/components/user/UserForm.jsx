import { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useParams,useNavigate } from 'react-router-dom';
import "./UserForm.css";

const MSG_NO_USER = "Ingrese el usuario";
const MSG_NO_FULLNAME = "Ingrese el nombre completo";
const MSG_NO_EMAIL = "Ingrese el correo electrónico";
const MSG_NO_PWD = "Ingrese la contraseña";

const UserForm = ({frontend,backend,addNewUser}) => {
    const isReadOnly = window.location.pathname.includes('/view/') ? "isReadOnly":"";
    const showTag = window.location.pathname.includes('/view/') ? "none" : "block";
    const { username } = useParams();
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

    const [userName , setUserName] = useState("");
    const [fullName , setFullName] = useState("");
    const [email , setEmail] = useState("");
    const [pwd , setPwd] = useState("");
    const [confirma, setConfirma] = useState('');
    const [roles, setRoles] = useState([]);
    const [rol_id, setRol_id] = useState(0);

    // OnFocus
    const inputName = useRef(null);

    const getRoles = async () => {
        const response = await fetch(backend+"/api/qa/roles");
        //console.log(response);
        const data = await response.json();
        console.log(data);
        //setEstados(data.filter(estado => estado.Etapa_Id === null)); etapa_id is null para todas las etapas 
        setRoles(data);       
        setRol_id(data[0].Rol_Id); // se toma el primer valor del combo box
    }

    // Evento Page Load
    useEffect( ()=>{
        inputName.current.focus();
        getRoles();

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
    const onChangeRol = (e)=>{
        setRol_id(e.target.value);
    }

    const onSubmit = (e)=>{
        e.preventDefault();
        
        // Validaciones
        if( userName.length === 0 ) {
            Notificacion(MSG_NO_USER,"error");
            return 
        }
        else if( fullName.length === 0 ){
            Notificacion(MSG_NO_FULLNAME,"error");
            return 
        }
        else if( email.length === 0 ){
            Notificacion(MSG_NO_EMAIL,"error");
            return 
        }
        else if( pwd.length === 0 ){
            Notificacion(MSG_NO_PWD,"error");
            return 
        }
        else {
            createNewUser(true);
        }
    }

    const createNewUser = async(valid)=>{
        if( valid ) {
            alert(rol_id)
            const datos = {            
                userName,
                fullName,
                email,
                pwd,
                estado: 'Activo',
                rol_id: rol_id,
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
                    if( addNewUser!=undefined) addNewUser(datos);
                    Notificacion("El usuario se guardó correctamente!","success");
                    navigate('/users');
                    return "OK";
                }
                else {
                    console.error("MySQL Error");
                    //console.log(data);
                    Notificacion(data.msg,"error");
                    return data;
                }
            })
            .catch(error => {
                console.error('API Error',"error");
                console.log(error);
                Notificacion('API Error',"error");
                return error;
            });
        }
    };
    
    return (
    <form onSubmit={onSubmit}  >        
        <h1>Formulario de Usuario </h1>
        <hr></hr>
        
        <div className="mb-3">

            <div className="row">

                <div className="col-md-4">
                    <label htmlFor="fullname" className="form-label">Nombre Completo</label>
                    <input readOnly={isReadOnly} type="text"value={fullName} onChange={onChangeFullName} name="fullname" className="form-control" required={true} ref={inputName} />
                </div>
            </div>

            <div className="row"  >
                <div className="col-md-4">
                    <label htmlFor="username" className="form-label">Usuario</label>
                    <input readOnly={isReadOnly}  type="text" value={userName} onChange={onChangeUserName} name="username" className="form-control" required={true}/>
                </div>
            </div>

            <div className="row"  >
                <div className="col-md-4">
                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                    <input readOnly={isReadOnly}  type="text" value={email} onChange={onChangeEmail} name="email" className="form-control" required={true}/>
                </div>
            </div>
            
            <div className="row">
                <div className="col-lg-4 col-md-3 col-sm-6 col-xs-12">
                    <label htmlFor="rol" className="control-label">Rol</label>
                    <select disabled={isReadOnly} name="rol" value={rol_id} onChange={onChangeRol} onClick={onChangeRol} className="form-select" >
                        {roles.map((item, index)=>(
                            <option key={index} value={item.Rol_Id}>{item.Rolname}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row" style={{display:showTag}} >
                <div className="col-md-4">
                    <label htmlFor="pwd" className="form-label">Contraseña</label>
                    <input type="password" value={pwd} onChange={onChangePwd} name="pwd" className="form-control" required={true}/>
                </div>

                <div className="col-md-4" style={{display:showTag}} >
                    <label htmlFor="confirma" className="form-label">Confirmacion de Contraseña</label>
                    <input type="password" value={confirma} onChange={onChangeConfirma} name="confirma" className="form-control" required={true}/>
                </div>
            </div>
            
        </div>
        <div className="row mt-3">
            <div className="col-md-4 contenedor"> 
                <button type="submit" className="btn btn-primary" style={{width:150 +'px'}}>Guardar</button> 
                <span style={{width:50+"px"}}></span>
                <button className="btn btn-warning" onClick={() => navigate('/users')} style={{width:150 +'px'}}>Cancelar</button>
            </div>
        </div>
    </form>
    )
}

export default UserForm;