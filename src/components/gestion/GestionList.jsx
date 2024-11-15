//import { getSuggestedQuery } from "@testing-library/react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import moment from 'moment'; 
import "./GestionList.css";

const GestionList = () => {
    const navigate = useNavigate();
    const [proys, setProys] = useState([]);

    const getProys = async () =>{
        const response = await fetch("http://localhost:8081/api/qa/proyectos");
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        setProys(data);
    }

    // Evento Load
    useEffect(()=>{
        getProys(); 
    },[])

    const onRevision = (Proyecto_Id) => {
        navigate("/revision/"+Proyecto_Id)
    }
    const onDelete = (Proyecto_Id) => {
        alert(Proyecto_Id)
    }

    return (
        <div>
            <h1>Gestión de proyectos</h1>
            <hr></hr>        

            <div className="table-responsive">
                <table border="1" cellPadding="10" cellSpacing="0" 
                className="table1 table-striped table-borderedx table-hover table-dark1">
                    <thead>
                        <tr>                                                  
                            <th>Proyecto Id</th>
                            <th>Nombre proyecto</th>
                            <th>Producto Owner</th>
                            <th>Estado</th>
                            <th>Fecha Creación</th>
                            {/* {headers.map((header, index)=>(
                                <th style={headerStyle} key={index}>{header}</th>
                            ))} */}
                            <th colSpan={2}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {proys.map((proy, index)=>(                            
                            <tr key={index}>
                                <td>{proy.Proyecto_Id}</td>
                                <td>{proy.Nombre}</td>
                                <td>{proy.User_Create}</td>
                                <td>{proy.Estado}</td>
                                <td>{moment(proy.Created).format('DD MMMM YYYY')}</td>                                    
                                <td><button onClick={()=>{onRevision(proy.Proyecto_Id)}} className="btn btn-info">Revision</button></td>
                                <td><button onClick={()=>{onDelete(proy.Proyecto_Id)}} className="btn btn-danger">Delete</button></td>
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