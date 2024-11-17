import { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useParams,useNavigate } from 'react-router-dom';
import "./UserForm.css";

const MSG_NO_USER = "Ingrese el usuario";
const MSG_NO_FULLNAME = "Ingrese el nombre completo";
const MSG_NO_EMAIL = "Ingrese el correo electrónico";
const MSG_NO_PWD = "Ingrese la contraseña";

const UserForm = ({frontend,backend}) => {
    const isNew         = window.location.pathname.includes('users/new')  ? 1 : 0;
    const isReadOnly    = window.location.pathname.includes('/view/') ? "isReadOnly":"";
    const showTag       = window.location.pathname.includes('/view/') ? "none" : "flex";
    const showTag2      = window.location.pathname.includes('/view/') ? "none" : "block";

    const { username } = useParams();
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    const Notificacion = async (msg, icono) => {
        await Swal.fire({
            position: "top-end",
            icon: icono,
            title: msg,
            showConfirmButton: false,
            timer: 5000
          });
    }

    const [userName , setUserName] = useState("");
    const [fullName , setFullName] = useState("");
    const [email , setEmail] = useState("");
    const [estado, setEstado] = useState("")
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
        // console.log(data);        
        await setRoles(data);
        //await setRol_id(data[0]); // se toma el primer valor del combo box
    }

    const getUser = async (username) => {
        if( username ) {
            console.log(username)
            const response = await fetch(backend+"/api/qa/user/"+username);
            //console.log(response);
            const data = await response.json();
            console.log('getUser: ',data[0].Username);
            console.log('getUser: ',data[0].Fullname);
            //setEstados(data.filter(estado => estado.Etapa_Id === null)); etapa_id is null para todas las etapas         
            await setUserName(data[0].Username)
            await setFullName(data[0].Fullname)
            await setEmail(data[0].Email)
            await setPwd(data[0].Pwd)
            await setConfirma(data[0].Pwd)
            await setRol_id(data[0].Rol_Id); // se toma el primer valor del combo box        
        }
    }

    // Evento Page Load
    useEffect( ()=>{        
        inputName.current.focus();
        getRoles();
        getUser(username)
    },[])

    
    const onChangeUserName = (e)=>{
        if( isNew ) {
            setUserName(e.target.value);
        }
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
            console.log('isNew',isNew)
            console.log('username',username)
            if( isNew )
                createNewUser(true);
            else
                updateUser();
        }
    }
    const updateUser = async()=>{
    
        const datos = {            
            userName,
            fullName,
            email,
            estado: 'Activo',
            rol_id: rol_id,
            pwd,
        }
        
        await fetch(backend+'/api/qa/user', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            console.log('updateUser:', data);
            
            if( data == 1 ) {
                //console.info('Proyecto: API Success');                                         
                Notificacion("El usuario se guardó correctamente!","success");
                navigate('/users');
                return "OK";
            }
            else {
                console.error("MySQL:",data);
                //console.log(data);
                Notificacion("MySQL "+data,"error");
                return data;
            }
        })
        .catch(error => {
            console.error('URL Error',error);            
            Notificacion("URL"+error,"error");
            return error;
        });        
    };

    const createNewUser = async(valid)=>{
        if( valid ) {
            
            const datos = {            
                userName,
                fullName,
                email,
                estado: 'Activo',
                rol_id: rol_id,
                pwd,
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
                console.log('createNewUser:', data);
                
                if( data.affectedRows == 1 ) {
                    //console.info('Proyecto: API Success');                                         
                    Notificacion("El usuario se guardó correctamente!","success");
                    navigate('/users');
                    return "OK";
                }
                else {
                    console.error("MySQL createNewUser:",data);
                    //console.log(data);
                    Notificacion("MySQL "+data,"error");
                    return data;
                }
            })
            .catch(error => {
                console.error('API createNewUser',error);                
                Notificacion('API'+error,"error");
                return error;
            });
        }
    };
    
    return (
    <form onSubmit={onSubmit}  >        
        <h1>Formulario de Usuario </h1>
        <hr></hr>
        
        <div className="mt-3">

            <div className="row mt-3"  >
                <div className="col-md-6">
                    <label htmlFor="username" className="form-label">Usuario</label>
                    <input disabled={!isNew} readOnly={isReadOnly} type="text" value={userName||''} onChange={onChangeUserName} name="username" className="form-control" required={true}/>
                </div>
           
            </div>

            
            <div className="row mt-3">

                <div className="col-md-6">
                    <label htmlFor="fullname" className="form-label">Nombre Completo</label>
                    <input disabled={isReadOnly} readOnly={isReadOnly} type="text"value={fullName||''} onChange={onChangeFullName} name="fullname" className="form-control" required={true} ref={inputName} />
                </div>
                
                <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                    <input disabled={isReadOnly} readOnly={isReadOnly}  type="text" value={email||''} onChange={onChangeEmail} name="email" className="form-control" required={true}/>
                </div>
            </div>
            
            <div className="row mt-3">
                
                <div className="col-md-4">
                    <label htmlFor="rol" className="control-label">Rol</label>
                    <select disabled={isReadOnly} name="rol" value={rol_id} onChange={onChangeRol} onClick={onChangeRol} className="form-select" >
                        <option value=' '></option>
                        {roles.map((item, index)=>(
                            <option key={item.Rol_Id} value={item.Rol_Id}>{item.Rol_name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row mt-3" style={{display:showTag}} >
                
                <div className="col-md-6">
                    <label htmlFor="pwd" className="form-label">Contraseña</label>
                    <input type="password" value={pwd} onChange={onChangePwd} name="pwd" className="form-control" required={true}/>
                </div>

                <div className="col-md-6" style={{display:showTag2}} >
                    
                    <label htmlFor="confirma" className="form-label">Confirmacion de Contraseña</label>
                    <input type="password" value={confirma} onChange={onChangeConfirma} name="confirma" className="form-control" required={true}/>
                    
                </div>
            </div>
            
        </div>

        <div className="row mt-3">
            <div className="col-md-12 contenedor " > 
                <div className="table-responsivex ">
                <table className="table" >
                    <tbody>
                        <tr>
                            <td style={{border:'0px'}}>
                            <button disabled={isReadOnly} type="submit" className="btn btn-primary" style={{display:showTag2,width:150 +'px'}}>Guardar</button> 
                            </td>
                            <td style={{border:'0px'}}>
                            <button className="btn btn-warning" onClick={() => navigate('/users')} style={{width:150 +'px'}}>Cancelar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>

                <span style={{width:"50px"}}></span>

            </div>
        </div>
    </form>
    )
}

export default UserForm;
