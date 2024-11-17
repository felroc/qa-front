import "./Revision.css"
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom';

const Revision = ({frontend,backend}) => { 
    const { proy_id } = useParams(); // /revision/:proy_id
    const navigate = useNavigate();
    const [checkList, setCheckList] = useState([]);    
    const [proyId, setProyId] = useState([]);
    const [proyecto, setProyecto] = useState([]);
    const [proy_etapa, setProyEtapa] = useState([]);
    const [etapa, setEtapa] = useState([]);
    const [etapas, setEtapas] = useState() //([{Etapa_Id: 1, Etapa: "Control de Calidad"},{Etapa_Id: 1, Etapa: "Control de Calidad"}]);
    const [revision, setRevision] = useState([]);
    const [detalleRevision, setDetalleRevision] = useState([])
    const [checked,setIsChecked]=useState(false)
    const [detalleError, setDetalleError] = useState(false)

    const MySwal = withReactContent(Swal);
    const Notificacion = async (msg, icono) => {
        await Swal.fire({
            position: "top-end",
            icon: icono,
            title: msg,
            showConfirmButton: false,
            timer: 5000
          });
    }

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

    const getDetalleRev = async (proyId,etapaId,revId) => {
        const response = await fetch("http://localhost:8081/api/qa/detalle_revision/"+proyId+"/"+etapaId+"/"+revId);
        //console.log(response);
        const data = await response.json();
        // console.log('getRevision: ',data);
        await setDetalleRevision(data);
        return data;
    }   
    
    // Insert o Update if already exists
    const addUpdateDetalleRevision = async (rev) =>{
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
        // Insert o Update if already exists
        await fetch(backend+'/api/qa/detalle_revision', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            console.log('addUpdateDetalleRevision:', data.affectedRows);
            if( data.affectedRows == 1 ) {
                // console.log('API Success');
                // No mostrar notificacion
                setDetalleError(false)
            }
            else {
                console.error("addUpdateDetalleRevision MySQL Error: ",data.info);
                setDetalleError(true)
            }
            return data;
        })
        .catch(error => {
            setDetalleError(true)
            console.error('addUpdateDetalleRevision API Error: ',error);            
            return error;
        });
    };      
    
    // Evento Page Load
    useEffect( () => {        
        getCheckList();
        load(proy_id);        
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
            //console.log("proy_etapa: ", proy_etapa);

            setEtapa(etapas[proy_etapa.Etapa_Id-1])
            // console.log('etapa: ',etapa)

            const rev = await getRevision(proyId,proy_etapa.Etapa_Id)
            // console.log("revision: ", rev);            
            setRevision(rev)
            
            // console.log('revision',revision)
            const detRev = await getDetalleRev(proyId, proy_etapa.Etapa_Id,rev.Revision_Id)
            setDetalleRevision(detRev)
            // console.log("detalle: ", detRev);
        } 
    }

    // Funcion para agregar una nueva etapa a un proyecto 
    const addNewEtapa = async () =>{        
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend) 
        const datos = {           
            id:             proy_etapa.Proyecto_Id,  
            etapaId:        proy_etapa.Etapa_Id+1 ,
            estado:         'En Proceso',
            dev:            proy_etapa.Dev,
            tester:         proy_etapa.QA_Tester,
            manualTecnico:  proy_etapa.Manual_Tecnico,
            manualDeploy:   proy_etapa.Manual_Despliegue,
            cronograma:     proy_etapa.Cronograma,
            ambiente:       proy_etapa.Ambiente, 
            acceso:         proy_etapa.Accesso,
            permisos:       proy_etapa.Permisos,
            instanciaDB:    proy_etapa.Instancia_DB,
            serverName:     proy_etapa.Server_Name,
            fechaInicio:    moment(proy_etapa.Fecha_Inicio).format('YYYY-MM-DD'),
            fechaFinal:     proy_etapa.Fecha_Final==null ? 'null' : proy_etapa.FechaFinal
        };
                
        console.log(datos);
        
        await fetch(backend+'/api/qa/etapa', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Etapa Response:', data);
            
            if( data.affectedRows === 1 ) {
                //console.log('Etapa: API Success'); 
                //console.log(data);
                console.log("Se creo la siguiente etapa.");                
                return data //"OK";
            } else {
                console.error("Etapa: MySQL Error");
                //console.log(data.info);
                return data.info;
            }
        })
        .catch(error => {
            console.error('Etapa: API Error');
            return error;
        });
    }

    const onSubmit = async(e) => {
        // evitar recargar la página web (postback)
        e.preventDefault();       
    }

    const onSave = async() => {
        const res = await detalleRevision.map((det=>(
            addUpdateDetalleRevision(det) 
       )))   

       setDetalleError(true)
       if( detalleError ) {
        Notificacion('Valide la revisión...','warning') 
       } 
       else 
       {
        const marcados = detalleRevision.filter(item => item.Marcado === 1 || item.Marcado==true);       
        // console.log('marcados', marcados.length)

        if( checkList.length === marcados.length) { // siguiente etapa 
            if( etapa.Etapa_Id < 4 ) { // Produccion 
                addNewEtapa()
                Notificacion('Etapa completada satisfactoriamente.','success')
                navigate('/proyecto')
            }
            else {
                Notificacion('Gestión completada satisfactoriamente.','success')
                navigate('/gestion')
            }
        }
        else {
            Notificacion('Revisión guardada correctamente.','success')
        }
       }
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
            // console.log('insert')
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
            // console.log('update')
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
            console.log('check: ',res[0].Marcado)
            return res[0] || 0;
        }

        return res[0] || 0;
    }

    const onDevolver = () => {
        // cambiar estado
    }

    const onChangeProyId = async (e) => { 
        await setProyId(e.target.value) 
    }

    const onClickBuscar = async(proyId) => {
        console.log('proyId: ',proyId);
        //await getProyecto(proyId);
        load(proyId)
    }

    return (
    <form onSubmit={onSubmit}>  
    {/* form-inline form-horizontal */}
	<div className="container mt-3 " >
        
        <div className="row ">
            <div className="col-md-6 ">
                <h1>Revisión del Desarrollo</h1>
            </div>
            <div className="col-md-6 " role="search" >                
                <div className="d-flex">
                    <input type="search" value={proyId} onChange={onChangeProyId} placeholder="Gestion ID" className="form-control me-2" aria-label="Search"/>
                    <button type="button" onClick={()=>{onClickBuscar(proyId)}} className="btn btn-info btn-outline-successx ">Buscar</button>
                </div>                
            </div>
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
            
            <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                <label className="control-label">Etapa</label>                
                <input value={etapa.Etapa || ''}  type="text" name="proy_etapa" className="form-control" readOnly="readonly" />
            </div>

            <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                <label className="control-label">Revisión</label>
                <input value={revision.Revision_Id || ''} type="text" name="tester" className="form-control" readOnly="readonly" />
            </div>
        </div>

        <div className="row form-group mt-3">           
{/*             
            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                <label className="control-label">Estado</label>
                <input value={proy_etapa.Estado || ''} type="text" name="estado" className="form-control" readOnly="readonly" />
            </div> */}
        </div>

        <hr></hr>
   
        <div className="table-responsive contenedorx">        
            <table border="1" cellPadding="10" cellSpacing="0" className="table">
                <thead>
                    <tr>
                        <th>Pruebas</th>
                        <th style={{width:170+'px'}}>Estado</th>
                        <th>Fecha de Validación</th>
                    </tr>
                </thead>
                <tbody>
                        {checkList.map((item, index)=>(
                            <tr key={index}>
                                <td key={index}>{item.Item}</td>
                                <td>
                                    <div className="form-check form-switch">
                                        <input id={'chk'+index} checked={getCheck(item)}  onClick={()=>{onClickCheck(item)}} onChange={onChangeCheck} type="checkbox" className="form-check-input"/>
                                        <label className="form-check-label" htmlFor={'chk'+index}> {getCheck(item)?'Satisfactorio':'No Satisfactorio'} </label>
                                    </div>
                                </td>
                                <td><input value={item.Fecha} type="date" className="form-control" /></td>
                            </tr>  
                        ))}
                </tbody>
            </table>
            
        </div>    

        <div className="row mt-3">
                <div className="col-md-12 contenedor">
                    <button onClick={()=>{onSave()}} type="button" className="btn btn-success" style={{width:150 +'px'}}>Guardar</button>

                    <span style={{width:50 +'px'}}></span>

                    <button onClick={()=>{onDevolver()}} type="button" className="btn btn-danger" style={{width:150 +'px'}}>Devolver</button>

                    <span style={{width:50 +'px'}}></span>
                    
                    <button onClick={()=>{navigate('/gestion')}} type="button" className="btn btn-info" style={{width:150 +'px'}}>Gestiones</button>
                </div>
            </div>
    </div>
    </form>
    )
}

export default Revision;