//import { getSuggestedQuery } from "@testing-library/react";
import { useState, useEffect } from "react";
import UserRow from "./UserRow";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserForm from "./UserForm";

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

const UserList = ({frontend,backend}) =>{

    const [users, setUsers] = useState([]);

    const getUsers = async () =>{
        console.log(backend);
        const response = await fetch(backend+"/api/qa/users");
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        setUsers(data);
    }

    useEffect(()=>{
        getUsers();
    },[])

    const onView = (e)=>{
        showMessage('View');
    }
    const onEdit = (e)=>{
        showMessage('Edit');
    }
    const onDelete = (e)=>{
        showMessage('Delete');
    }

    const headers = ["Usuario", "Nombre Completo","Correo Electrónico", "Fecha de Creación", "Estado"];
    const headerStyle = {textAlign:"center", fontWeight:"bold"};
    return (
    <div>
        <ToastContainer />
        <h1>Mantenimiento de Usuarios</h1>
        <hr></hr>
        
        <UserForm frontend={frontend} backend={backend}></UserForm>

        <hr></hr>

        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        {headers.map((header, index)=>(
                            <th style={headerStyle} key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index)=>(
                        //<UserRow key={index} user={user} onView={onView} onEdit={onEdit} onDelete={onDelete}></UserRow>
                        <tr key={index}>
                            <td>{user.Username}</td>                            
                            <td>{user.Fullname}</td>
                            <td>{user.Email}</td>
                            <td>{user.Created}</td>
                            <td><button onClick={onView} className="btn btn-info1">Consultar</button></td>
                            <td><button onClick={onEdit} className="btn btn-warning1">Editar</button></td>
                            <td><button onClick={onDelete} className="btn btn-danger1">Eliminar</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>            
    </div>
    )    
}

export default UserList