import "./UserList.css"
import { useState, useEffect } from "react";
import moment from 'moment'; 
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useAuth } from "../../AuthContext";

const UserList = ({frontend,backend}) =>{
    const { user } = useAuth();
    const navigate = useNavigate();

    const Notificacion = (msg, icono="success") => {
        Swal.fire({
            position: "top-end",
            icon: icono,
            title: msg,
            showConfirmButton: false,
            timer: 3000
          });
    }
 
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);

    const getAllUsers = async () =>{
        console.log(backend);
        const response = await fetch(backend+"/api/qa/users");
        //console.log(response);
        const data = await response.json();

        //  console.log("getAllUsers",data);        
        await setUsers(data);
    }

    const getRoles = async () =>{        
        const response = await fetch(backend+"/api/qa/roles");
        //console.log(response);
        const data = await response.json();
        //  console.log("getRoles:",data);        
        await setRoles(data);     
        
        await getAllUsers();
    }

    useEffect( ()=>{
        if( user.rol_id == 1 || user.rol_id==3){            
            getRoles();
        } else {
            Notificacion("No tiene autorización para este contenido",'error')
        }      
    },[])

    const onView = (username)=>{
        navigate('/users/view/'+username); 
    }
    const onEdit = (username)=>{
        navigate('/users/edit/'+username); 
    }

    const onDelete = async (username) => {
        Swal.fire({
            title: "¿Desea eliminar el usuario "+username+" ?", 
            timerProgressBar: true, icon:'question',
            showDenyButton: true,
            showConfirmButton: false,
            showCancelButton: true,
            confirmButtonColor: "danger",
            //confirmButtonText: "Eliminar",
            denyButtonText: `Eliminar`
            }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire("Saved!", "", "success");                
            } else if (result.isDenied) {
                var res = deleteUser(username);
                //Swal.fire("El usuario fue eliminado del sistema", "", "info");
            }
        });       
    }
    
    const deleteUser = async(username) => {
        console.log( 'username: ',username );
        const datos = { userName: username } 
                
        const response = await fetch(backend+'/api/qa/user/'+username, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            
            if( data.affectedRows == 1 ) {
                setUsers(users.filter(user => user.Username !== username));            
                Notificacion("El usuario se eliminó correctamente!","success")
                return "OK";
            }
            else {
                console.error("MySQL Error",data);                
                Notificacion("No fue posible eliminar el usuario...","error");
                return data;
            }
        })
        .catch(error => {
            console.error('API Error',error);            
            Notificacion('API Error',"error");
            return error;
        }); 
    }
    
    const addNewUser = (datos) =>{

        setUsers([...users,{
            Username:datos.userName,
            Fullname:datos.fullName,
            Email:datos.email,
        }]);        
    } 

    const getRol = async(rol_id) =>{
         const res = roles.filter( rol=> rol.Rol_Id === rol_id ).Rol_name
         console.log(res)
         return res;
    }

    const headers = ["Usuario", "Nombre Completo","Correo Electrónico", "Estado","Rol", "Fecha de Creación"];
    const headerStyle = {textAlign:"center", fontWeight:"bold"};
    return (
    <div >
        {/* <UserForm frontend={frontend} backend={backend} addNewUser={addNewUser}></UserForm>
        <hr></hr> */}
        
        <h1>Listado de Usuarios</h1>
        <hr></hr>
        <button className="btn btn-success" onClick={()=>{navigate('/users/new')}} style={{display: user.rol_id == 2 ?'none': 'flex' }}>Crear Usuario</button>
        <br></br>
        <div className="table-responsive mt-3" style={{display: user.rol_id == 2 ?'none': 'flex' }}>
            <table className="table table-striped table-borderedx table-hover table-dark1">
                <thead>
                    <tr>
                        {headers.map((header, index)=>(
                            <th style={headerStyle} key={index}>{header}</th>
                        ))}
                        <th colSpan={3}></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index)=>(
                        //<UserRow key={index} user={user} onView={onView} onEdit={onEdit} onDelete={onDelete}></UserRow>
                        <tr key={index}>
                            <td>{user.Username}</td>                            
                            <td>{user.Fullname}</td>
                            <td>{user.Email}</td>
                            <td>{user.Estado}</td>
                            <td>{roles[user.Rol_Id-1].Rol_name}</td>
                            <td>{moment(user.Created).format('DD MMMM YYYY')}</td>
                            <td><button onClick={()=>{onView(user.Username)}} className="btn btn-info btn-dark1">Consultar</button></td>
                            <td><button onClick={()=>{onEdit(user.Username)}} className="btn btn-warning btn-dark1">Editar</button></td>
                            <td><button onClick={()=>{onDelete(user.Username)}} className="btn btn-danger btn-dark1">Eliminar</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>            
        <div style={{display: user.rol_id == 2 ?'flex': 'none' }}>
            <h1>NO TIENE AUTORIZACIÓN PARA ESTE CONTENIDO...</h1>
        </div>
    </div>
    )    
}

export default UserList;
