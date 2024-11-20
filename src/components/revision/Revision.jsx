import "./Revision.css"
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../AuthContext";

const ESTADO_REV_OK = "QA Satisfactorio"
const ESTADO_EN_REV = 'En Revisión'
const ESTADO_PEND = 'Pendiente de Corrección'
const ESTADO_RECHA = 'Desarrollo Rechazado'

const Revision = ({frontend,backend}) => { 
    const { user } = useAuth();
    const { proy_id } = useParams(); // /revision/:proy_id
    const navigate = useNavigate();
    const [checkList, setCheckList] = useState([]);    
    const [proyId, setProyId] = useState([]);
    const [proyecto, setProyecto] = useState([]);
    const [proy_etapa, setProyEtapa] = useState([]);
    const [etapa, setEtapa] = useState([]);
    const [etapas, setEtapas] = useState() 
    const [revision, setRevision] = useState([]);
    const [detalleRevision, setDetalleRevision] = useState([])
    const [checked,setIsChecked]=useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [detalleError, setDetalleError] = useState(false)
    const [item,setItem] = useState(0)
    const [visible , setVisible ] = useState(1)

    const MySwal = withReactContent(Swal);
    const Notificacion = async (msg, icono='success') => {
        await Swal.fire({
            position: "top-end", 
            timerProgressBar: true, icon: icono,
            title: msg,
            showConfirmButton: false,
            timer: 5000
          });
    }
    const Mensaje = async (lbl, icono='warning', func) => {
        Swal.fire({
            title: lbl, icon: icono, 
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonColor: "success",
            confirmButtonText: "OK",
            showDenyButton: true,
            denyButtonText: `Cancel`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                // Swal.fire("Saved!", "", "success");
                if(func) func()
                return true
            } else if (result.isDenied) {
                // Swal.fire("Saved!", "", "success");
                return false
            }
        });             
    }

    const getCheckList = async () => {
        const response = await fetch(backend+"/api/qa/check_list");
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        await setCheckList( data.filter(x=>x.Activo==1) );
        //console.log('checkList: ',checkList) no works
    }
    
    const getProyecto = async (proyId) => {
        try {
            const response = await fetch(backend+"/api/qa/proyecto/"+proyId);
            //console.log(response);
            const data = await response.json();
            // console.log('getProyecto data',data[0]);        
            await setProyecto(data); // no works
            //await setProyecto(data[0]); // no works
            // console.log('getProyecto: ',data); 
            return data[0];
        }catch(error){
            console.error('error',error)
        }
    }

    // Devuelve la ultima proy_etapa
    const getProyEtapa = async (proyId) => {
        const response = await fetch(backend+"/api/qa/proy_etapa/"+proyId);
        //console.log(response);
        const data = await response.json();
        // console.log('getProyEtapa: ',data[0]);
        setProyEtapa(data);
        return data[0];
    }

    const getEtapas = async (proyId) => {
        const response = await fetch(backend+"/api/qa/etapas/");
        //console.log(response);
        const data = await response.json();
        // console.log('Etapas: ',data);
        // await setEtapas(data); // all
        return data; // all
    }
    
    // Devuelve la ultima revision
    const getRevision = async (proyId,etapaId) => {
        // console.log('getRevision...',proyId,etapaId)
        const response = await fetch(backend+"/api/qa/revision/"+proyId+"/"+etapaId);
        //console.log(response);
        const data = await response.json();
        // console.log('getRevision: ',data[0]);
        //await setRevision(data[0]);
        return data[0];
    }

    const getDetalleRev = async (proyId,etapaId,revId) => {
        const response = await fetch(backend+"/api/qa/detalle_revision/"+proyId+"/"+etapaId+"/"+revId);
        //console.log(response);
        const data = await response.json();
        // console.log('getDetalleRev: ',data);
        await setDetalleRevision(data);
        return data;
    }   
    
    // Insert o Update if already exists
    const addUpdateDetalleRevision = async (rev) =>{
        //console.log('addUpdateDetalleRevision: ',rev)
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend)
        const datos = {             
            Proyecto_Id:    rev.Proyecto_Id,
            Etapa_Id:       rev.Etapa_Id,
            Revision_Id:    rev.Revision_Id,
            Check_List_Id:  rev.Check_List_Id,
            Marcado:        rev.Marcado,
            Fecha:          moment(rev.Fecha).format('YYYY-MM-DD')
        };
        // console.log('rev fecha',datos.Fecha);
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
            // console.log('addUpdateDetalleRevision:', data.affectedRows);
            if( data.affectedRows == 1 ) {
                // console.log('API Success');
                // No mostrar notificacion
                setDetalleError(false)
                return true
            }
            else {
                Notificacion("MySQL "+data,"error");
                console.error("MySQL addUpdateDetalleRevision",data);
                setDetalleError(true)
                return false
            }
            return data;
        })
        .catch(error => {
            Notificacion("API "+error,"error");
            setDetalleError(true)
            console.error('addUpdateDetalleRevision API: ',error);            
            return error;
        });
    };      
    
    // Evento Page Load
    useEffect( () => {     
        console.log(user) 
        if( user && user.rol_id == 3)  {            
            getCheckList();
            load(proy_id);
        }
        else{
            Notificacion('Debe tener Rol de QA Tester','warning');
        }
        console.log(revision)
    },[])

    async function load(proyId) {
        // console.log('proyId: ',proyId);

        if( proyId > 0 ) {
            await setProyId(proyId) 
            const proy = await getProyecto(proyId);
            
            if( proy && proy.Estado == ESTADO_REV_OK) {
                Notificacion(ESTADO_REV_OK)
                setVisible(0)
            }
            if( proy && proy.Estado == ESTADO_RECHA) {
                Notificacion(ESTADO_RECHA)
                setVisible(0)
            }

            if( proy ) {
                setProyecto(proy)          
                // console.log("proy: ", proy.Nombre);

                const etapas = await  getEtapas() 
                setEtapas(etapas)
                // console.log('Etapas: ',etapas)

                const proy_etapa = await getProyEtapa(proyId);
                await setProyEtapa(proy_etapa)            
                //console.log("proy_etapa: ", proy_etapa);

                await setEtapa(etapas[proy_etapa.Etapa_Id-1])
                // console.log('etapa: ',etapa)

                const rev = await getRevision( proyId, proy_etapa.Etapa_Id)
                // console.log("revision: ", rev);            
                 setRevision(rev)
                
                // console.log('revision',revision)
                const detRev = await getDetalleRev(proyId, proy_etapa.Etapa_Id,rev.Revision_Id)
                await setDetalleRevision(detRev)
                // console.log("detalle: ", detRev);
            }
            else {
                Notificacion('El proyecto '+proyId+' no existe','warning')
            }
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
            console.log('addNewEtapa:', data);
            
            if( data.affectedRows === 1 ) {
                //console.log('Etapa: API Success',data);              
                console.log("Se creo la siguiente etapa.",'success');
                return data //"OK";
            } else {
                console.error("addNewEtapa MySQL ",data);
                //console.log(data.info);
                return data.info;
            }
        })
        .catch(error => {
            console.error('addNewEtapa API ',error);
            return error;
        });
    }

    const updateDashboard = async (id, cantidad) =>{        
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend) 
        const datos = {           
            id, 
            cantidad
        }
                
        // console.log(datos);
        
        await fetch(backend+'/api/qa/dashboard', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            // console.log('dashboard:', data);
            
            if( data.affectedRows === 1 ) {
                //console.log('Etapa: API Success',data);                 
                return data //"OK";
            } else {
                console.error("dashboard MySQL",data);
                //console.log(data.info);
                return data;
            }
        })
        .catch(error => {
            console.error('dashboard API',error);
            return error;
        });
    }

    const patchProyecto = async (id, estado) =>{        
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend) 
        const datos = {           
            id, 
            estado
        }
                
        // console.log(datos);
        
        await fetch(backend+'/api/qa/proyecto', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            // console.log('patchProyecto Response:', data);
            
            if( data.affectedRows === 1 ) {
                //console.log('patchProyecto: API Success',data);                 
                return data //"OK";
            } else {
                console.error("patchProyecto MySQL ",data);
                //console.log(data.info);
                return data;
            }
        })
        .catch(error => {
            console.error('patchProyecto API ',error);
            return error;
        });
    }

    const insertRevision = async () =>{        
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend) 
        const datos = {
            Proyecto_Id:    proyecto.Proyecto_Id,
            Etapa_Id:       etapa.Etapa_Id,
            Revision_Id:    revision.Revision_Id + 1,
            Fecha:          moment(new Date()).format('YYYY-MM-DD'),
            Estado:         "En Revision"
        }
                
        // console.log('insertRevision',datos);
        
        await fetch(backend+'/api/qa/revision', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            // console.log('insertRevision:', data);
            
            if( data.affectedRows === 1 ) {
                //console.log('insertRevision: API Success',data);                 
                
                return data //"OK";
            } else {
                console.error("insertRevision MySQL",data);
                //console.log(data.info);
                return data;
            }
        })
        .catch(error => {
            console.error('insertRevision API',error);
            return error;
        });
    }

    const patchProyEtapa = async (id, estado, etapaId) =>{        
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend) 
        const datos = {           
            id, 
            etapaId,
            estado
        }                
        // console.log('patchProyEtapa',datos);
        
        await fetch(backend+'/api/qa/etapa', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            // console.log('patchProyecto Response:', data);
            
            if( data.affectedRows === 1 ) {
                //console.log('patchProyecto: API Success',data);                 
                return data //"OK";
            } else {
                console.error("patchProyecto MySQL ",data);
                //console.log(data.info);
                return data.info;
            }
        })
        .catch(error => {
            console.error('patchProyecto API ',error);
            return error;
        });
    }

    const onSubmit = async(e) => {
        // evitar recargar la página web (postback)
        e.preventDefault();       
    }

    const onSave = async(proyId) => {

        if(proyId > 0) {
            
            const marcados = detalleRevision.filter(item => item.Marcado === 1 || item.Marcado==true);       
            if( marcados.length > 0 ) {
                await setDetalleError(true) // setting at addUpdateDetalleRevision

                const res = await detalleRevision.map( (det=>( // guardar checkList y fecha
                    addUpdateDetalleRevision(det) 
                )))                
            
                if( marcados.length >= checkList.length) { // siguiente etapa , pueden haber etapas Inactivas

                    if( etapa.Etapa_Id < 4 ) { // Produccion 
                        patchProyEtapa(proyecto.Proyecto_Id,ESTADO_REV_OK, proy_etapa.Etapa_Id)
                        addNewEtapa()
                        updateDashboard(2,1) // revision
                        patchProyecto(proyecto.Proyecto_Id, 'Revisión en Proceso')
                        Mensaje('Etapa completada satisfactoriamente.','success',()=>{
                            Notificacion("Se creó la siguiente etapa.",'success')
                            //navigate('/proyecto/'+proyecto.Proyecto_Id)
                            navigate('/gestion')
                        })                        
                    }
                    else { // siguiente etapa
                        patchProyEtapa(proyecto.Proyecto_Id,ESTADO_REV_OK, proy_etapa.Etapa_Id)
                        await updateDashboard(4,1) // aprobado
                        patchProyecto(proyecto.Proyecto_Id, 'QA Satisfactorio')
                        Mensaje('Gestión completada satisfactoriamente.','success',()=>{
                            Notificacion("Se Finalizo la Gestión satisfactoriamente.",'success')
                            navigate('/gestion')
                        })
                    }
                }
                else if(marcados.length > 0) {                    
                    updateDashboard(2,1) // revision
                    patchProyecto(proyecto.Proyecto_Id, 'Revisión en Proceso')
                    patchProyEtapa(proyecto.Proyecto_Id, ESTADO_EN_REV,proy_etapa.Etapa_Id)
                    load(proyId)
                    //Mensaje('Revisión guardada correctamente.','success',()=>{Notificacion('Revisión guardada!')})
                    Notificacion('Revisión guardada correctamente.','success')
                }               
            }
            else {                
                patchProyecto(proyecto.Proyecto_Id, 'Revisión en Proceso')
                patchProyEtapa(proyecto.Proyecto_Id, ESTADO_EN_REV,proy_etapa.Etapa_Id)
                Mensaje('Debe marcar al menos una prueba.','warning')
            }
        }
        else{
            Notificacion("Debe ingresar un proyecto",'warning')
        }    
        
    }

    const onChangeCheck = async(e) => {   
        // console.log('checked',e.target.checked)     
        await setIsChecked(e.target.checked);
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
                    Fecha: null
                }]
            );
        }
        else {            
            // console.log('update')
            setDetalleRevision( detalleRevision.map( (det) => (
                det.Check_List_Id === item.Check_List_Id
                ? {...det,Marcado:!det.Marcado} : det
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
            return res[0] || 0;
        }

        return res[0] || 0;
    }
    
    const onChangeDate = (e) => {
        setSelectedDate(e.target.value);
        
        // console.log("onChangeDate: ",e.target.value)

        const result = detalleRevision.filter((det) => (
            det.Check_List_Id == item.Check_List_Id 
        ));        

        if( result.length==0 ) { //  insert
            
            // console.log('insert')
            setDetalleRevision( 
                [...detalleRevision,{
                    Proyecto_Id:proyecto.Proyecto_Id,
                    Etapa_Id:etapa.Etapa_Id,
                    Revision_Id: revision.Revision_Id,
                    Check_List_Id: item.Check_List_Id,
                    Marcado: 0, 
                    Fecha: moment(e.target.value).format('YYYY-MM-DD')
                }]
            );
        }
        else {            
            // console.log('update')
            console.log('result',result[0].Fecha)
            setDetalleRevision( detalleRevision.map( (det) => (
                det.Check_List_Id === item.Check_List_Id
                ? {...det,Fecha:moment(e.target.value).format('YYYY-MM-DD')} : det
            )));
        }  
    }

    const onClickDate = (item) => {
        setItem(item)
    }
    const getDate = (item) => {

        // si no esta en detalleRevision no se muestra
        const res = detalleRevision.filter( (det) => (
            det.Check_List_Id == item.Check_List_Id 
        ))

        if( res.length > 0 ) {
            // console.log('getDate: ',res[0].Fecha)
            return moment(res[0].Fecha).format('YYYY-MM-DD')  || selectedDate;
        }

        return res[0] || 0;
    }

    const onDevolver = async() => {
        Mensaje("¿Desea Devolver el proyecto?",'warning',devolver)         
    }
    const devolver = async () => {        
        // cambiar estado
        updateDashboard(3,1) // correccion
        patchProyecto(proyecto.Proyecto_Id, ESTADO_PEND) 
        patchProyEtapa(proyecto.Proyecto_Id, ESTADO_PEND,proy_etapa.Etapa_Id)
        insertRevision() // nueva revision
        await load(proyecto.Proyecto_Id)
        Notificacion("El desarrollo fue devuelto para correcciones.",'success') 
        navigate('/gestion')
        //navigate('/proyecto/'+proyecto.Proyecto_Id)
               
    }

    const onRechazado = () => {
        Mensaje("¿Desea Rechazar el proyecto?",'warning',rechazar)               
    }
    const rechazar = () => {
        // cambiar estado
        updateDashboard(5,1) // correccion
        patchProyecto(proyecto.Proyecto_Id, ESTADO_RECHA)
        patchProyEtapa(proyecto.Proyecto_Id, ESTADO_RECHA ,proy_etapa.Etapa_Id)
        load(proyId)
        Notificacion("El desarrollo fue rechazado.",'success',()=>{navigate('/gestion')})
        navigate('/gestion')
    }

    const onChangeProyId = async (e) => { 
        await setProyId(e.target.value) 
    }

    const onClickBuscar = async(proyId) => {
        console.log('proyId: ',proyId); 
        setProyId(proyId)
        navigate('/revision/'+proyId)
        
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

        <div style={{display:revision && visible===1 ?'block':'none'}}>                    

            <div className="row form-group" >

                <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                    <label className="control-label">Nombre de Proyecto</label>
                    <input value={proyecto.Nombre || ''} type="text" name="proy" className="form-control" readOnly="readonly" />
                </div>
                
                <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                    <label className="control-label">Etapa</label>                
                    <input value={etapa.Etapa || ''}  type="text" name="proy_etapa" className="form-control" readOnly="readonly" />
                </div>

                <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                    <label className="control-label">Revisión</label>
                    <input value={revision.Revision_Id || ''} type="text" name="revision" className="form-control" readOnly="readonly" />
                </div>
            </div>

            <div className="row form-group mt-3">           
                
                <div className="col-lg-3 col-md-4 col-sm-3 col-xs-3">
                    <label className="control-label">QA Tester</label>
                    <input value={proy_etapa.QA_Tester || ''} type="text" name="tester" className="form-control" readOnly="readonly" />
                </div>
                
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Estado</label>
                    <input value={proy_etapa.Estado || ''} type="text" name="estado" className="form-control" readOnly="readonly" />
                </div>
{/* 
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Cantidad de Defectos</label>
                    <input value={revision.Cantidad_Defectos || ''} onChange={onChangeCheck} name="defectos" type="text" className="form-control" />
                </div>

                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Cantidad de Atrasos</label>
                    <input value={revision.Cantidad_Defectos || ''} onChange={onChangeCheck} type="text" className="form-control" />
                </div> */}

            </div>

            <hr></hr>
    
            <div className="table-responsive contenedorx">        
                <table border="1" cellPadding="10" cellSpacing="0" className="table">
                    <thead>
                        <tr>
                            <th>Pruebas</th>
                            <th style={{width:270+'px'}}>Estado</th>
                            <th style={{width:170+'px'}}>Fecha de Revisión</th>
                        </tr>
                    </thead>
                    <tbody>
                            {checkList.map((item, index)=>(
                                <tr key={index}>
                                    <td key={index}>{item.Item}</td>
                                    <td>
                                        <div className="form-check form-switch">
                                            <input id={'chk'+index} checked={getCheck(item)} onClick={()=>{onClickCheck(item)}} onChange={onChangeCheck} type="checkbox" className="form-check-input"/>
                                            <label className="form-check-label" htmlFor={'chk'+index}> {getCheck(item)?'Satisfactorio':'No Satisfactorio'} </label>
                                        </div>
                                    </td>
                                    <td><input value={getDate(item)} onClick={()=>{onClickDate(item)}} onChange={onChangeDate } type="date" className="form-control" /></td>
                                </tr>  
                            ))}
                    </tbody>
                </table>
                
            </div>    

            <div className="row mt-3" style={{display: user.rol_id == 3 ? 'flex':'none' }}>
                <div className="col-md-12 contenedor">
                    <button onClick={()=>{onSave(proyecto.Proyecto_Id)}} type="button" className="btn btn-success" style={{width:150 +'px'}}>Guardar</button>

                    <span style={{width:50 +'px'}}></span>

                    <button onClick={()=>{onDevolver()}} type="button" className="btn btn-warning" style={{width:150 +'px'}}>Devolver</button>

                    <span style={{width:50 +'px'}}></span>
                    
                    <button onClick={()=>{onRechazado()}} type="button" className="btn btn-danger" style={{width:150 +'px'}}>Rechazar</button>

                    {/* <span style={{width:50 +'px'}}></span>
                    
                    <button onClick={()=>{onDescartar()}} type="button" className="btn btn-danger" style={{width:150 +'px'}}>Descartar</button> */}
                </div>
            </div>
        
        </div>
    </div>
    </form>
    )
}

export default Revision;