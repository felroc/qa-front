import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import "./Revision.css"

const Revision = ({frontend,backend}) => { 
    const { proy_id } = useParams(); // /revision/:proy_id

    const [checkList, setCheckList] = useState([]);    
    const [proyId, setProyId] = useState([]);
    const [proyecto, setProyecto] = useState([]);
    const [proy_etapa, setProyEtapa] = useState([]);
    const [etapa, setEtapa] = useState([]);
    const [etapas, setEtapas] = useState() //([{Etapa_Id: 1, Etapa: "Control de Calidad"},{Etapa_Id: 1, Etapa: "Control de Calidad"}]);
    const [revision, setRevision] = useState([]);
    const [detalleRevision, setDetalleRevision] = useState([])
    const [checked,setIsChecked]=useState(false)

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
        // console.log('getProyecto',data);        
        // setProyecto(data); // no works
        //await setProyecto(data[0]); // no works
        //console.log('getProyecto: ',proyecto); //no works        
        return data[0];
    }

    // Devuelve la ultima proy_etapa
    const getProyEtapa = async (proyId) => {
        const response = await fetch("http://localhost:8081/api/qa/proy_etapa/"+proyId);
        //console.log(response);
        const data = await response.json();
        // console.log('getProyEtapa: ',data);
        // setProyEtapa(data);
        return data[0];
    }

    const getEtapas = async (proyId) => {
        const response = await fetch("http://localhost:8081/api/qa/etapas/");
        //console.log(response);
        const data = await response.json();
        // console.log('Etapas: ',data);
        // await setEtapas(data); // all
        return data; // all
    }
    
    // Devuelve la ultima revision
    const getRevision = async (proyId,etapaId) => {
        const response = await fetch("http://localhost:8081/api/qa/revision/"+proyId+"/"+etapaId);
        //console.log(response);
        const data = await response.json();
        // console.log('getRevision: ',data);
        // await setRevision(data[0]);
        return data[0];
    }
    const getDeRev = async (proyId,etapaId,revId) => {
        const response = await fetch("http://localhost:8081/api/qa/detalle_revision/"+proyId+"/"+etapaId+"/"+revId);
        //console.log(response);
        const data = await response.json();
        // console.log('getRevision: ',data);
        // await setRevision(data);
        return data;
    }

    // Evento Page Load
    useEffect( () => {        
        load();
        getCheckList();
    },[])

    async function load() {      
        
        console.log('parametro proy_id: ',proy_id);

        if( proy_id > 0 ) {
            const proy = await getProyecto(proy_id);  
            setProyecto(proy)          
            // console.log("proy: ", proy.Nombre);

            const etapas = await  getEtapas() 
            setEtapas(etapas)
            // console.log('Etapas: ',etapas)

            const proy_etapa = await getProyEtapa(proy_id);
            await setProyEtapa(proy_etapa)            
            // console.log("proy_etapa: ", proy_etapa);

            setEtapa(etapas[proy_etapa.Etapa_Id-1])
            // console.log('etapa: ',etapa)

            const rev = await getRevision(proy_id,proy_etapa.Etapa_Id)
            setRevision(rev)
            // console.log("revision: ", rev);

            const detRev = await getDeRev(proy_id, proy_etapa.Etapa_Id,rev.Revision_Id)
            setDetalleRevision(detRev)
            // console.log("detalle revision: ", detRev);
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

    const onChangeCheck =(e) => {   
        console.log('checked',e.target.checked)     
        setIsChecked(e.target.checked);
        // const { value, checked } = e.target;
        // setCheckedItems([...checkedItems, value]);
    }
    const onClickCheck =(item) => {        
        //console.log("item: ",item)

        const result = detalleRevision.filter((det) => (
            det.Check_List_Id == item.Check_List_Id
        ));

        console.log('result',!result.Marcado)
        console.log('init',detalleRevision)   

        if( result.length==0 ) {
            setDetalleRevision( 
                [...detalleRevision,{
                    Proyecto_Id:detalleRevision.length+1,
                    Etapa_Id:etapa.Etapa_Id,
                    Revision_Id: revision.Revision_Id,
                    Check_List_Id: item.Check_List_Id,
                    Marcado: 1, 
                    Fecha: '2024-11-11'
                }]
            );
        }
        else {            
            setDetalleRevision( detalleRevision.map( (det) => (
                det.Check_List_Id === item.Check_List_Id
                ? {...det,Marcado:!det.Marcado} : det
            )));

            // detalleRevision.pop(result)    
            // setDetalleRevision(detalleRevision)
            // console.log('pop',detalleRevision)    

            // result.Marcado = !result[0].Marcado

            // detalleRevision.push(result)
            // setDetalleRevision(detalleRevision)
            // console.log('push',detalleRevision)    
        }
        //setIsChecked(e.target.checked);
        // const { value, checked } = e.target;
        // setCheckedItems([...checkedItems, value]);
    }
    const getCheck = (item) => {
        
        const res = detalleRevision.filter( (det) => (
            det.Check_List_Id == item.Check_List_Id && det.Marcado 
        ))

        if( res.length > 0 ) {
            console.log('check: ',res[0].Marcado)
        }

        return res[0] || false;
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
                <input value={proy_etapa.QA_Tester || ''} type="text" name="tester" className="form-control" readOnly="readonly" />
            </div>

            
            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                <label className="control-label">Estado</label>
                <input value={proy_etapa.Estado || ''} type="text" name="estado" className="form-control" readOnly="readonly" />
            </div>
        </div>

        <div className="row form-group mt-3">
            <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                <label className="control-label">Etapa</label>                
                <input value={etapa.Etapa || ''}  type="text" name="proy_etapa" className="form-control" readOnly="readonly" />
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
                                <td><input onClick={()=>{onClickCheck(item)}} checked={getCheck(item)} onChange={onChangeCheck} type="checkbox" className="form-check-input"/></td>
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