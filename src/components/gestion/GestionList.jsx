import "./GestionList.css";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import moment from 'moment'; 
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useAuth } from "../../AuthContext";

const GestionList = ({backend}) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [proys, setProys] = useState([]);
    const [etapas, setEtapas] = useState([]) 

    const Notificacion = (msg, icono="success") => {
        Swal.fire({
            position: "top-end",
            icon: icono,
            title: msg,
            showConfirmButton: false,
            timer: 3000
          });
    }

    const getProys = async () =>{
        const response = await fetch(backend+"/api/qa/proyectos");
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        setProys(data);
    }

    const getEtapas = async (proyId) => {
        const response = await fetch(backend+"/api/qa/etapas/");
        //console.log(response);
        const data = await response.json();
        console.log('Etapas: ',data);
        await setEtapas(data); // all        
        return data; // all
    }

    // Evento Load
    useEffect(()=>{
        getEtapas()
        getProys(); 
    },[])

    const onRevision = (Proyecto_Id) => {
        navigate("/revision/"+Proyecto_Id)
    }
    const onDelete = (Proyecto_Id,) => {
        Swal.fire({
            timerProgressBar: true, icon:'question',
            title: "¿Desea eliminar el proyecto "+ Proyecto_Id+" ?",
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
                var res = deleteProy(Proyecto_Id);
                //Swal.fire("El usuario fue eliminado del sistema", "", "info");
            }
        });   
    }
    const deleteProy = async(id) => {
        console.log( 'Proyecto_Id: ',id );
        const datos = { id } 
                
        const response = await fetch(backend+'/api/qa/proyecto', {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            console.log('deleteProy:', data);
            
            if( data.affectedRows == 1 ) {
                setProys(proys.filter(p => p.Proyecto_Id !== id));            
                Notificacion("El proyecto se eliminó correctamente!","success")
                return "OK";
            }
            else {
                console.error("MySQL Error",data);                
                //Notificacion("No fue posible eliminar el proyecto...","error");
                return data;
            }
        })
        .catch(error => {
            console.error('API Error',error);            
            Notificacion('API Error',"error");
            return error;
        }); 
    }

    const onView = (Proyecto_Id) => {
        navigate("/proyecto/"+Proyecto_Id)
    }
    return (
        <div>            

            <div className="row mt-3">
                <div className="col-md-8">
                    <h1>Gestión de proyectos</h1>                
                </div>
                <div className="col-md-3 mt-2" style={{textAlign:"right"}}>
                    <button onClick={()=>{navigate('/proyecto')}} type="button" style={{float:"right"}} className="btn btn-success">Crear Proyecto</button>
                </div>
            </div>
            
            <hr></hr>        

            <div className="table-responsive mt-3">
                <table className="table table-striped table-borderedx table-hover table-dark1">
                    <thead>
                        <tr>                                                  
                            <th>Proyecto Id</th>
                            <th>Nombre proyecto</th>
                            <th>Producto Owner</th>
                            <th>Estado</th>
                            <th>Etapa</th>
                            <th>Revisión</th>
                            <th>Fecha Creación</th>
                            {/* {headers.map((header, index)=>(
                                <th style={headerStyle} key={index}>{header}</th>
                            ))} */}
                            <th colSpan={3}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {proys.map((proy, index)=>(                            
                            <tr key={index}>
                                <td>{proy.Proyecto_Id}</td>
                                <td>{proy.Nombre}</td>
                                <td>{proy.User_Create}</td>
                                <td>{proy.Estado}</td>
                                <td>{etapas.filter(e=>e.Etapa_Id===proy.Etapa_Id)[0].Etapa}</td>
                                <td>{proy.Revision_Id}</td>                                
                                <td>{moment(proy.Created).format('DD MMMM YYYY')}</td>
                                <td><button onClick={()=>{onView(proy.Proyecto_Id)}}  className="btn btn-primary">Abrir</button></td>
                                <td><button onClick={()=>{onRevision(proy.Proyecto_Id)}} className="btn btn-warning">Revision</button></td>
                                <td><button onClick={()=>{onDelete(proy.Proyecto_Id)}} style={{display: user.rol_id == 2 ?'none': 'flex' }} className="btn btn-danger">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

                        
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-8"></div>                
            </div>

        </div>
    )    
}

export default GestionList