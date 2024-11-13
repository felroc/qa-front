import { useEffect, useState } from "react";
import "./Revision.css"

const Revision = ({frontend,backend}) => { 

    const [checkList, setCheckList] = useState([]);    
    const [proyId, setProyId] = useState([]);
    const [proyecto, setProyecto] = useState([]);
    

    // Evento Page Load
    useEffect( () => {
        var proy_id = 0;
        getCheckList(); 
        //await getProyecto(proy_id);
    },[])


    const getCheckList = async () => {
        const response = await fetch("http://localhost:8081/api/qa/checkList");
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        setCheckList(data);
    }

    const getRevision = async (proyId,etapaId) => {
        const response = await fetch("http://localhost:8081/api/qa/revision/"+proyId+"/"+etapaId);
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        setCheckList(data);
    }
    const getEtapa = async (proyId,etapaId) => {
        const response = await fetch("http://localhost:8081/api/qa/etapa/"+proyId+"/"+etapaId);
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        setCheckList(data);
    }
    const getProyecto = async (proyId) => {
        const response = await fetch("http://localhost:8081/api/qa/proyecto/"+proyId);
        //console.log(response);
        const data = await response.json();
        //console.log('data',data);
        await setProyecto(data[0]);
        //console.log('proy',proyecto.Proyecto_Id);
        return data[0].Proyecto_Id;
    }

    const onChangeProyId = async (e) => { 
        await setProyId(e.target.value) 
    }

    const onClickBuscar = async(proyId) => {
        console.log('proyId: ',proyId);
        await getProyecto(proyId);
    }
    const onSearch = (e) => {
        e.preventDefault(); // evitar recargar la página web (postback)
    }
    
    return (
	<div className="container" >
        <div className="label-form form-group ">
            {/* <center> */}{/* </center> */}    
        </div>
        
        <h1>Revisión del Desarrollo</h1>

        <hr></hr>
        <div className="row form-group">
            <form className="d-flex" role="search" onSubmit={onSearch}>
                <input type="search" value={proyId} onChange={onChangeProyId} placeholder="Gestion ID" className="form-control me-2" aria-label="Search"/>
                <button type="submit" onClick={()=>{onClickBuscar(proyId)}} className="btn btn-info btn-outline-success btn-darkx ">Buscar</button>
            </form>
        </div>

        <hr></hr>

        <div className="row form-group">

            <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                <label className="control-label">Nombre de Proyecto</label>
                <input type="text" name="revisor" className="form-control" readOnly="readonly" value="Sistema de Ventas" />
            </div>

            <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                <label className="control-label">Etapa</label>
                <input type="text" name="revisor" className="form-control" readOnly="readonly" value="Desarrollo-QA" />
            </div>

            <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                <label className="control-label">QA Tester</label>
                <input type="text" name="revisor" className="form-control" readOnly="readonly" value="April Smith" />
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                <label className="control-label">Estado</label>
                <input type="text" name="estado" className="form-control" value='En proceso' readOnly="readonly" />
            </div>
        </div>

        <hr></hr>
   
        <div className="contenedorx">        
            <table border="1" cellPadding="10" cellSpacing="0" className="table-responsive">
                <thead>
                    <tr>
                        <th>Pruebas</th>
                        <th style={{width:170+'px'}}>Satisfactorio</th>
                        <th>Fecha de Validación</th>
                    </tr>
                </thead>
                <tbody>
                        {checkList.map((item, index)=>(
                            <tr key={index}>
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