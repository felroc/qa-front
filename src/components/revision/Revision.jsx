import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import "./Revision.css"
import moment from 'moment';

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
        await setDetalleRevision(data);
        return data;
    }
    const addRevision = async (rev) =>{                
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend)
        // const datos = {             
        //     proyName,
        //     user,
        //     created,
        //     estado 
        // };

        console.log('rev',rev);

        await fetch(backend+'/api/qa/detalle_revision', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rev),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            //if( data.affectedRows === 1 ) {}
            if( data > 0 ) {
                console.log('Proyecto: API Success'); 
                console.log(data);                
                return data; // > 0 : "OK";
            }
            else {
                console.error("Proyecto: MySQL Error");
                //console.log(data);
                return data.info;
            }
        })
        .catch(error => {
            console.error('Proyecto: API Error');
            console.log(error);
            return error;
        });
    };      
    
    const addDetalleRevision = async (rev) =>{                
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend)
        const datos = {             
            Proyecto_Id:    rev.Proyecto_Id,
            Etapa_Id:       rev.Etapa_Id,
            Revision_Id:    rev.Revision_Id,
            Check_List_Id:  rev.Check_List_Id,
            Marcado:        rev.Marcado,
            Fecha:          moment(rev.Fecha).format('YYYY-MM-DD')
        };

        // console.log('detalle',datos);

        await fetch(backend+'/api/qa/detalle_revision', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data.affectedRows);
            //if( data.affectedRows === 1 ) {}
            if( data.affectedRows == 1 ) {
                console.log('API Success'); 
                // console.log(data);                
                return data; // > 0 : "OK";
            }
            else {
                console.error("MySQL Error");
                //console.log(data);
                return data.info;
            }
        })
        .catch(error => {
            console.error('Proyecto: API Error');
            console.log(error);
            return error;
        });
    };      
    
    // Evento Page Load
    useEffect( () => {        
        load(proy_id);
        getCheckList();
    },[])

    async function load(proyId) {      

        console.log('parametro proy_id: ',proyId);

        if( proy_id > 0 ) {
            const proy = await getProyecto(proyId);  
            setProyecto(proy)          
            // console.log("proy: ", proy.Nombre);

            const etapas = await  getEtapas() 
            setEtapas(etapas)
            // console.log('Etapas: ',etapas)

            const proy_etapa = await getProyEtapa(proyId);
            await setProyEtapa(proy_etapa)            
            // console.log("proy_etapa: ", proy_etapa);

            setEtapa(etapas[proy_etapa.Etapa_Id-1])
            // console.log('etapa: ',etapa)

            const rev = await getRevision(proyId,proy_etapa.Etapa_Id)
            // console.log("revision: ", rev);            
            setRevision(rev)
            
            // console.log('revision',revision)
            const detRev = await getDeRev(proyId, proy_etapa.Etapa_Id,rev.Revision_Id)
            setDetalleRevision(detRev)
            // console.log("detalle: ", detRev);
        } 
    }

    const onChangeProyId = async (e) => { 
        await setProyId(e.target.value) 
    }
    const onClickBuscar = async(proyId) => {
        console.log('proyId: ',proyId);
        //await getProyecto(proyId);
        load(proyId)
    }

    const onSubmit = (e) => {
        e.preventDefault(); // evitar recargar la página web (postback)
        //console.log(detalleRevision)
        detalleRevision.map((det=>(
            addDetalleRevision(det)
        )))
        // addRevision( revision ) siguiente etapa
    }

    const onChangeCheck =(e) => {   
        // console.log('checked',e.target.checked)     
        setIsChecked(e.target.checked);
    }

    const onClickCheck =(item) => {        
        //console.log("item: ",item)

        const result = detalleRevision.filter((det) => (
            det.Check_List_Id == item.Check_List_Id
        ));

        // console.log('result',!result.Marcado)        

        if( result.length==0 ) { //  insert
            console.log('insert')
            setDetalleRevision( 
                [...detalleRevision,{
                    Proyecto_Id:proyecto.Proyecto_Id,
                    Etapa_Id:etapa.Etapa_Id,
                    Revision_Id: revision.Revision_Id,
                    Check_List_Id: item.Check_List_Id,
                    Marcado: 1, 
                    Fecha: "2024-11-14 0:00"
                }]
            );
        }
        else {            
            console.log('update')
            setDetalleRevision( detalleRevision.map( (det) => (
                det.Check_List_Id === item.Check_List_Id
                ? {...det,Marcado:!det.Marcado,Fecha:'2024-11-12'} : det
            )));

        }
        // console.log('detalle.post',detalleRevision)   
    }
    const getCheck = (item) => {
        
        const res = detalleRevision.filter( (det) => (
            det.Check_List_Id == item.Check_List_Id && det.Marcado ? det.Marcado : 0
        ))

        if( res.length > 0 ) {
            // console.log('check: ',res[0].Marcado)
        }

        return res[0] || 0;
    }

    return (
	<div className="container" >        
        
        <h1>Revisión del Desarrollo</h1>

        <hr></hr>
        {/* <div className="row form-group">
            <form className="d-flex" role="search" onSubmit={onSearch}>
                <input type="search" value={proyId} onChange={onChangeProyId} placeholder="Gestion ID" className="form-control me-2" aria-label="Search"/>
                <button type="submit" onClick={()=>{onClickBuscar(proyId)}} className="btn btn-info btn-outline-success btn-darkx ">Buscar</button>
            </form>
        </div>

        <hr></hr> */}

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
                <form className="d-flex" role="search" onSubmit={onSubmit}>  
                    <button type="submit" className="btn btn-primary" style={{width:150 +'px'}}>Guardar</button> 
                </form>
                    {/* <span style={{width:50 +'px'}}></span>
                    <button type="button" className="btn btn-success" style={{width:150 +'px'}}>Revisión</button>  */}
                </div>
            </div>
    </div>

    )
}

export default Revision;