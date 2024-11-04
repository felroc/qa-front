//import { getSuggestedQuery } from "@testing-library/react";
import { useState, useEffect } from "react";
import GestionForm from "./GestionForm";

const ProyList = () =>{
    const [proys, setProys] = useState([]);

    const getProys = async () =>{
        const response = await fetch("http://localhost:8081/api/qa/proys");
        //console.log(response);
        const data = await response.json();
        console.log(data);
        setProys(data);
    }

    useEffect(()=>{
        getProys(); 
    },[])

    return (
        <div>
            <h1>Gestión de proyectos</h1>
            <hr></hr>        
            <GestionForm></GestionForm>
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-8"></div>
                <div className="table-responsive">
                    <table className="table">
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
                            </tr>
                        </thead>
                        <tbody>
                            {proys.map((proy, index)=>(                            
                                <tr key={index}>
                                    <td>{proy.Proyecto_Id}</td>
                                    <td>{proy.Nombre}</td>
                                    <td>{proy.User_Create}</td>
                                    <td>{proy.Estado}</td>
                                    <td>{proy.Create}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
    
}

export default ProyList