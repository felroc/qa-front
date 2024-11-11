import { useEffect, useState } from "react";
import "./Revision.css"

const Revision = ({frontend,backend}) => { 

    const [checkList, setCheckList] = useState([]);

    const getCheckList = async () => {
        const response = await fetch("http://localhost:8081/api/qa/checkList");
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        setCheckList(data);
    }

    // Evento Page Load
    useEffect( () => {
        getCheckList(); 
    },[])

    const handlerSubmit = (e) =>{
        e.preventDefault(); // evitar recargar la página web (postback)
        alert('Buscando proyecto...');
    }

    return (
        
	<div class="container" >

        <h1 class="label-form form-group ">
            <centerx>
                <h1>Revisión del Desarrollo</h1>
            </centerx>
        </h1>

        <hr></hr>
        <div class="row form-group">
            <form className="d-flex" role="search" onSubmit={handlerSubmit}>
                <input className="form-control me-2" type="search" placeholder="Gestion ID" aria-label="Search"/>
                <button className="btn btn-info btn-outline-successx btn-darkx " type="submit">Buscar</button>
            </form>
        </div>

        <hr></hr>

        <div class="row form-group">

            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                <label class="control-label">Nombre de Proyecto</label>
                <input type="text" name="revisor" class="form-control" readonly="readonly" value="Sistema de Ventas" />
            </div>

            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                <label class="control-label">Etapa</label>
                <input type="text" name="revisor" class="form-control" readonly="readonly" value="Desarrollo-QA" />
            </div>

            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                <label class="control-label">QA Tester</label>
                <input type="text" name="revisor" class="form-control" readonly="readonly" value="April Smith" />
            </div>

            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                <label class="control-label">Estado</label>
                <input type="text" name="estado" class="form-control" value='En proceso' readonly="readonly" />
            </div>
        </div>

        <hr></hr>
   
        <div className="contenedorx">        
            <table border="1" cellpadding="10" cellspacing="0" className="table-responsive">
                <thead>
                    <tr>
                        <th>Pruebas</th>
                        <th style={{width:170+'px'}}>Satisfactorio</th>
                        <th>Fecha de Validación</th>
                    </tr>
                </thead>
                <tbody>
                        {checkList.map((item, index)=>(
                            <tr>
                                <td key={index}>{item.Item}</td>
                                <td><input type="checkbox" className="form-check-input"/></td>
                                <td><input type="date" className="form-control" /></td>
                            </tr>  
                        ))}
                </tbody>
            </table>
            
        </div>    

        <div className="row mt-3">
                <div className="col-md-12 contenedor">                
                    <button type="submit" className="btn btn-primary" style={{width:150 +'px'}}>Guardar</button> 
                    {/* <span style={{width:50 +'px'}}></span>
                    <button type="button" className="btn btn-success" style={{width:150 +'px'}}>Revisión</button>  */}
                </div>
            </div>
    </div>

    )
}

export default Revision;