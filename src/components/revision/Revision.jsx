import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import "./Revision.css"

const Revision = ({frontend,backend}) => { 
    const { proy_id } = useParams(); // /revision/:proy_id

    const [checkList, setCheckList] = useState([]);    
    const [proyId, setProyId] = useState([]);
    const [proyecto, setProyecto] = useState([]);
    const [etapa, setEtapa] = useState([]);
    const [etapas, setEtapas] = useState([]);
    const [revision, setRevision] = useState([]);
    
    const getCheckList = async () => {
        const response = await fetch("http://localhost:8081/api/qa/checkList");
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        setCheckList(data);
        //console.log('checkList: ',checkList) no works
    }
    
    const getProyecto = async (proyId) => {
        const response = await fetch("http://localhost:8081/api/qa/proyecto/"+proyId);
        //console.log(response);
        const data = await response.json();
        // console.log('data',data);        
        setProyecto(data); // no works
        //await setProyecto(data[0]); // no works
        //console.log('getProyecto: ',proyecto); //no works        
        return data[0];
    }

    // Devuelve la ultima etapa
    const getProyEtapa = async (proyId) => {
        const response = await fetch("http://localhost:8081/api/qa/proy_etapa/"+proyId);
        //console.log(response);
        const data = await response.json();
        // console.log('getProyEtapa: ',data);
        setEtapa(data);
        return data[0];
    }
    const getEtapas = async (proyId) => {
        const response = await fetch("http://localhost:8081/api/qa/etapas/");
        //console.log(response);
        const data = await response.json();
        console.log('Etapas: ',data);
        setEtapas(data);
        return data[0];
    }
    
    // Devuelve la ultima revision
    const getRevision = async (proyId,etapaId) => {
        const response = await fetch("http://localhost:8081/api/qa/revision/"+proyId+"/"+etapaId);
        //console.log(response);
        const data = await response.json();
        console.log('getRevision: ',data);
        setRevision(data);
        return data[0];
    }

    // Evento Page Load
    useEffect( () => {
        load();
        getCheckList();
    },[])

    async function load() {      
        await getEtapas()  
        console.log('parametro proy_id: ',proy_id);
        if( proy_id > 0 ) {
            const proy = await getProyecto(proy_id);  
            setProyecto(proy)          
            // console.log("proy: ", proy.Nombre);

            const etapa = await getProyEtapa(proy_id);
            await setEtapa(etapa)
            // console.log("etapa: ", etapa);

            const rev = await getRevision(proy_id, 1)
            setRevision(rev)
            console.log("revision: ", rev);
        } 
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

    const onClickCheck =(e) => {
        alert('clik')
    }
    
    return (
	<div className="container" >        
        
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
                <input value={proyecto.Nombre || ''} type="text" name="proy" className="form-control" readOnly="readonly" />
            </div>

            <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                <label className="control-label">QA Tester</label>
                <input value={etapa.QA_Tester || ''} type="text" name="tester" className="form-control" readOnly="readonly" />
            </div>

            
            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                <label className="control-label">Estado</label>
                <input value={etapa.Estado || ''} type="text" name="estado" className="form-control" readOnly="readonly" />
            </div>
        </div>

        <div className="row form-group mt-3">
            <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                <label className="control-label">Etapa</label>
                <input value={etapas[etapa.Etapa_Id-1].Etapa || ''}  type="text" name="etapa" className="form-control" readOnly="readonly" />
            </div>

            <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                <label className="control-label">Revisión</label>
                <input value={revision.Revision_Id || ''} type="text" name="tester" className="form-control" readOnly="readonly" />
            </div>

        </div>

        <hr></hr>
   
        <div className="table-responsive contenedorx">        
            <table border="1" cellPadding="10" cellSpacing="0" className="table">
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
                                <td><input onClick={onClickCheck} value={item.Marcado} type="checkbox" className="form-check-input"/></td>
                                <td><input value={item.Fecha} type="date" className="form-control" /></td>
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