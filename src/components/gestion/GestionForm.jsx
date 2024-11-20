import "./GestionForm.css";
import { useState, useEffect, useSyncExternalStore } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import moment from "moment";
import { useAuth } from "../../AuthContext";

const MSG_NO_PROYNAME="Ingrese el nombre del proyecto";
const MSG_NO_PO="Seleccione el Product Owner";
const MSG_NO_DATE="Seleccione la fecha de creación";
const MSG_NO_DEV="Seleccione el Developer";
const MSG_NO_MANTEC="Adjunte el Manual Técnico";
const MSG_NO_MANDEP="Adjunte el Código Fuente";
const MSG_NO_TESTER="Seleccione el QA Tester";
const MSG_NO_CRONO="Adjunte el Cronograma de QA";
//const MSG_NO_AMBIENTE=""; ETAPA
const MSG_NO_SERV="Seleccione el Servidor Web";
const MSG_NO_DB="Seleccione el Servidor SQL";
const MSG_NO_ACCESOS="Seleccione los Accesos";
const MSG_NO_PERMISOS="Seleccione los Permisos";
const MSG_NO_FECHA_INI="Seleccione la Fecha de Inicio"; // Inicio de etapa
const MSG_NO_FECHA_FIN="Seleccione la Fecha de Cierre"; // al finalizar la etapa
const MSG_NO_FILE="Seleccione un archivo";

// Formulario para ingreso de proyectos
const GestionForm = ({fronted,backend})=> {
    const { user } = useAuth();
    const MySwal = withReactContent(Swal);
    const { proy_id } = useParams();
    const navigate = useNavigate();

    const Notificacion = async (msg, icono='success') => {
        await Swal.fire({
            position: "top-end",
            icon: icono,
            title: msg,
            showConfirmButton: true,
            timer: 3000
          });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // BINDINGS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Hook userState para listado de estados
    const [estados, setEstados] = useState([]);
    
    // Hook userState para etapas (por proyecto)
    const [etapas, setEtapas] = useState([]);    
    
    // Hook userState para listado de estados
    const [users, setUsers] = useState([]); // Product Owner
    const [devs, setDevs] = useState([]);
    const [testers, setTesters] = useState([]);

    // Hook UseState para campos de tabla Proyecto   
    const [proyectId,setProyectoId] = useState(0)
    const [proyName, setProyName] = useState("");
    const [po, setPO] = useState("");
    const [created, setCreated] = useState("");
    const [estado, setEstado] = useState('');

    // Hook UseState para campos de tabla Proy_Etapa
    //const [proyectoId, setProyectoId] = useState(0);    
    const [etapaId, setEtapaId] = useState(1); // Binding a la DB
    const [etapa, setEtapa] = useState(''); // Debe existir en la DB
    const [dev, setDev] = useState('');
    const [manualTecnico, setManualTecnico] = useState(''); 
    const [manualDeploy, setManualDeploy] = useState(''); 
    const [tester, setTester] = useState('');
    const [cronograma, setCronograma] = useState('');
    //const [ambiente, setAmbiente] = useState(''); 
    const [acceso, setAcceso] = useState("");
    const [permiso, setPermiso] = useState("");
    const [db, setDb] = useState("");
    const [server, setServer] = useState("");
    const [fechaInicio, setFechaInico] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [revision,setRevision] = useState('');
    
    // Archivos adjuntos
    const [fileManTec, setFileManTec] = useState(null); 
    const [fileManDep, setFileManDep] = useState(null); 
    const [fileCrono, setFileCrono] = useState(null); 

    // Listas desplegables
    const [catalogos, setCatalogos] = useState([]);
    const [servers, setServers] = useState([]);
    const [dbs, setDbs] = useState([]);
    const [accesos, setAccesos] = useState([]);
    const [permisos, setPermisos] = useState([]);    
    
    const [proy_etapa, setProyEtapa] = useState([]);
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // FUNCIONES
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    const getUsuarios = async () =>{        
        const response = await fetch(backend+"/api/qa/users");
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        // Se solicita el catalogo de usuarios 1 unica vez y se filtra
        setUsers(data.filter(user => user.Rol_Id === 1));        
        setDevs(data.filter(user => user.Rol_Id === 2));        
        setTesters(data.filter(user => user.Rol_Id === 3));

        // setPO(data[0].Fullname); // se toma el primer valor del combo box
        // setDev(data[0].Fullname); // se toma el primer valor del combo box
        // setTester(data[0].Fullname); // se toma el primer valor del combo box
    }

    const getEstados = async () =>{        
        const response = await fetch(backend+"/api/qa/estados");
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        //setEstados(data.filter(estado => estado.Etapa_Id === null)); etapa_id is null para todas las etapas 
        setEstados(data);       
        // setEstado(data[0].estado); // se toma el primer valor del combo box
    }

    const getCatalogos = async () =>{        
        const response = await fetch(backend+"/api/qa/catalogos");
        //console.log(response);
        const data = await response.json();
        //console.log('getCatalogos',data);
        await setCatalogos(data); // Se solicita el catalogo 1 unica vez y se filtra

        await setServers(data.filter(cat => cat.tipo === 'serv'));        
        await setDbs(data.filter(cat => cat.tipo === 'db'));        
        await setAccesos(data.filter(cat => cat.tipo === 'acc'));        
        await setPermisos(data.filter(cat => cat.tipo === 'per'));

        // await setServer(data.filter(cat => cat.tipo === 'serv')[0].item);
        // await setDb(data.filter(cat => cat.tipo === 'db')[0].item);
        // await setAcceso(data.filter(cat => cat.tipo === 'acc')[0].item);
        // await setPermiso(data.filter(cat => cat.tipo === 'per')[0].item);
    }


    const getEtapas = async (proyId) => {
        const response = await fetch(backend+"/api/qa/etapas/");
        //console.log(response);
        const data = await response.json();
        console.log('Etapas: ',data);
        await setEtapas(data); // all
        
        if( proyId ) {
            await getProyEtapa(proyId,data)        
        }
        else {
            setEtapa(data[0].Etapa)
            setRevision(1)
        }
        return data; // all
    }

    // Devuelve la ultima proy_etapa
    const getProyEtapa = async (proyId,etapas) => {
        const response = await fetch(backend+"/api/qa/proy_etapa/"+proyId);
        //console.log(response);
        const data = await response.json();
        console.log('getProyEtapa: ',data);
        await setProyEtapa(data[0]);

        await setEtapa( etapas[data[0].Etapa_Id-1].Etapa )
        
        await getRevision(proyId,data[0].Etapa_Id)

        await setDev(data[0].Dev)
        await setManualTecnico(data[0].Manual_Tecnico)
        await setManualDeploy(data[0].Manual_Despliegue)
        await setCronograma(data[0].Cronograma)
        await setTester(data[0].QA_Tester)
        

        await setServer(data[0].Server_Name);
        await setDb(data[0].Instancia_DB);
        await setAcceso(data[0].Accesso);
        await setPermiso(data[0].Permisos);
        return data[0];
    }

    // Devuelve la ultima revision
    const getRevision = async (proyId,etapaId) => {
        // console.log('getRevision...',proyId,etapaId)
        const response = await fetch(backend+"/api/qa/revision/"+proyId+"/"+etapaId);
        //console.log(response);
        const data = await response.json();
        console.log('getRevision: ',data[0]);
        await setRevision(data[0].Revision_Id);
        return data[0];
    }

    const getProyecto = async (proyId) =>{    

        if( proyId ) {
            const response = await fetch(backend+'/api/qa/proyecto/'+proyId)
            //console.log(response);
            const data = await response.json();
            console.log('getProyecto: ',data[0]);
            await setProyectoId(data[0].Proyecto_Id)
            await setProyName(data[0].Nombre);
            await setEstado(data[0].Estado);
            await setPO(data[0].User_Create)
            return data[0];
        }
    }

    // Evento Page Load 
    useEffect( ()=> {
        console.log("Cargando gestion form...",proy_id);
        getEtapas(proy_id)
        getProyecto(proy_id)

        setCreated( moment(new Date()).format('YYYY-MM-DD'))
        setFechaInico( moment(new Date()).format('YYYY-MM-DD'))
        setFechaFinal( moment(new Date()).add(7,"days").format('YYYY-MM-DD'))
        
        getCatalogos();
        getEstados();
        getUsuarios();

        if( user.rol_id == 2  )
        {
            if( proy_id > 0 ) Notificacion("Solo puede adjuntar archivos...",'info')
            else 
            Notificacion("No tiene autorización crear proyectos...",'error')
        }            
        
        //setTasks([...tasks,{id:tasks.length+1,name:newTaskName,prioridad:1, completado:false}]);         
        // console.log(catalogo)     
        
    },[]); // [] requerido para evitar loop infinito


    // Funcion para agregar un nuevo proyecto a las gestiones
    const addNewProyecto = async () =>{                
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend)
        const datos = {        
            proyectId,     
            proyName,
            user: po,
            created,
            estado 
        };

        // console.log('addNewProyecto',datos);

        await fetch(backend+'/api/qa/proyecto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            // console.log('addNewProyecto:', data);
            
            if( data > 0 ) { // backend envia el id
                setProyectoId(data)
                // console.log('Proyecto: API Success',data);                 
                addUpdateEtapa(data); // backend envia el id
                return data; // > 0 : "OK";
            }
            else {
                console.error("MySQL addNewProyecto: ",data);
                Notificacion("MySQL addNewProyecto: "+data,'error');                
                return data;
            }
        })
        .catch(error => {
            Notificacion("API addNewProyecto: "+error,'error');            
            console.error("API addNewProyecto: ",error);
            return error;
        });
    };            
    
    // Funcion para agregar una nueva etapa a un proyecto 
    const addUpdateEtapa = async (id) =>{     
        console.log(id) 
        setProyectoId(id)
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend) 
        const datos = {           
            id      ,  
            etapaId : proy_etapa.Etapa_Id,
            estado: 'En Proceso',
            dev,
            tester,
            manualTecnico,
            manualDeploy,
            cronograma,
            ambiente: etapa, 
            acceso: acceso,
            permisos: permiso,
            instanciaDB: db,
            serverName: server,
            fechaInicio,
            fechaFinal: fechaFinal==="" ? 'null' :fechaFinal
        };
                
        console.log('addUpdateEtapa',datos);
        
        await fetch(backend+'/api/qa/proy_etapa', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            console.log('addUpdateEtapa Response:', data);
            
            if( data.affectedRows === 1 ) {
                // console.log('Etapa: API Success'); 
                //console.log(data);
                Notificacion("Proyecto guardado correctamente.");                 
                return "OK";
            } else {
                console.error("addUpdateEtapa MySQL",data);
                //Notificacion("MySQL "+data,"error");
                console.log('addUpdateEtapa MySQL',data);
                return data;
            }
        })
        .catch(error => {
            console.error('addUpdateEtapa API',error);
            //Notificacion("API "+error,"error")
            return error;
        });
    }
    
    const createNewGestion = (valid) => {
        if( valid === true ) {
            const id = addNewProyecto();
            console.log("id", id);
        }
    }

    const attach = async (filename, opc) => {
        //console.log( 'attach: ', filename)

        if( filename === null || filename === undefined ) {            
            return MSG_NO_FILE;
        }
        else {
            const formData = new FormData();
            formData.append('file', filename); // adjunta el archivo

            await axios.post(backend+'/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log('Attach:', response.data); // devuelve el nombre del archivo con su ID
                switch( opc ){
                    case 1 : setManualTecnico(response.data)
                    break
                    case 2 : setManualDeploy(response.data)
                    break
                    case 3 : setCronograma(response.data)
                    break
                }
                return response.data;
            })
            .catch(error => {
                console.error('Attach Error:', error);
                return error;
            });            
        }
    }

    const updateDashboard = async (id, cantidad) =>{        
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend) 
        const datos = {           
            id, 
            cantidad
        }
                
        console.log(datos);
        
        await fetch(backend+'/api/qa/dashboard', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            console.log('updateDashboard:', data);
            
            if( data.affectedRows === 1 ) {
                //console.log('Etapa: API Success',data);                 
                return data //"OK";
            } else {
                console.error("updateDashboard: MySQL Error");
                //console.log(data.info);
                return data.info;
            }
        })
        .catch(error => {
            console.error('updateDashboard: API Error');
            return error;
        });
    }

    const updateProyecto = async () =>{                
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend)
        const datos = {        
            proy_id: proyectId,
            proyName,
            user: po,
            created,
            estado 
        };

         console.log('updateProyecto',datos);

        await fetch(backend+'/api/qa/proyecto', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
             console.log('updateProyecto affectedRows:', data.affectedRows);
            
            if( data.affectedRows == 1 ) { // backend envia el id
                // console.log('Proyecto: API Success',data);                 
                addUpdateEtapa(proy_id); // backend envia el id
                return data; // > 0 : "OK";
            }
            else {
                console.error("MySQL updateProyecto: ",data);
                Notificacion("MySQL updateProyecto: "+data,'error');                
                return data;
            }
        })
        .catch(error => {
            Notificacion("API updateProyecto: "+error,'error');            
            console.error("API updateProyecto: ",error);
            return error;
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // EVENTOS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    const validacion = () =>{
        if( proyName.length === 0){            
            console.log(MSG_NO_PROYNAME);
            Notificacion(MSG_NO_PROYNAME,'warning');
            return false;
        }
        else if( po.length === 0){            
            console.log(MSG_NO_PO);
            Notificacion(MSG_NO_PO,'warning');
            return false;
        }
        else if( created.length === 0){            
            console.log(MSG_NO_DATE);
            Notificacion(MSG_NO_DATE,'warning');
            return false;
        }
        else if( dev.length === 0){
            console.log(MSG_NO_DEV);
            Notificacion(MSG_NO_DEV,'warning');
            return false;
        }       
        else if( tester.length === 0){
            console.log(MSG_NO_TESTER);
            Notificacion(MSG_NO_TESTER,'warning');
            return false;
        }       
        else if( server.length === 0){
            console.log(MSG_NO_SERV);
            Notificacion(MSG_NO_SERV,'warning');
            return false;
        }
        else if( db.length === 0){
            console.log(MSG_NO_DB);
            Notificacion(MSG_NO_DB,'warning');
            return false;
        }
        else if( acceso.length === 0){
            console.log(MSG_NO_ACCESOS);
            Notificacion(MSG_NO_ACCESOS,'warning');
            return false;
        }
        else if( permiso.length === 0){
            console.log(MSG_NO_PERMISOS);
            Notificacion(MSG_NO_PERMISOS,'warning');
            return false;
        }
        else if( fechaInicio.length === 0){
            console.log(MSG_NO_FECHA_INI);
            Notificacion(MSG_NO_FECHA_INI,'warning');
            return false;
        }
        // else if( fechaFinal.length === 0){
        //     console.log(MSG_NO_FECHA_FIN);
        //     Notificacion(MSG_NO_FECHA_FIN,'warning');
        //     return false;
        // }
        else if( revision && revision.Revision_Id>0 && fileManTec === null ) {                            
            Notificacion(MSG_NO_MANTEC,'warning');
            return;
        }
        else if( revision  && revision.Revision_Id>0 && fileManDep === null ) {            
            Notificacion(MSG_NO_MANDEP,'warning');
            return; 
        }
        else if( revision && revision.Revision_Id>0 && fileCrono === null ) {            
            Notificacion(MSG_NO_CRONO,'warning');
            return;
        }
        return true;
    }

    // Evento OnSubmit del Form
    const handlerSubmit = async (e) => {
        e.preventDefault(); // evitar recargar la página web (postback)
        
        //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // Validaciones        
        //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        if( validacion() ) {            

            // console.log('manualTecnico',manualTecnico);   
            // console.log('manualDeploy',manualDeploy);   
            // console.log('cronograma',cronograma); 
            console.log('proyectId: ',proyectId)  
            console.log('proy_etapa: ',proy_etapa)  

            if( proyectId==0 ) //&& proy_etapa.Etapa_Id == 1 
            {
                createNewGestion(true);

                updateDashboard(1,1) // revision
            }
            else {
                updateProyecto()
            }
        }
    }

    // Eventos OnChange
    const onChangeProyName = (e)=>{        
        setProyName(e.target.value);
    }
    const onChangeCreated = (e)=>{
        setCreated(e.target.value);        
    }
    const onChangeUser = (e)=>{        
        setPO(e.target.value);        
    }    
    const onChangeEstado = (event) => { 
        setEstado(event.target.value);        
    };
    
    const onChangeDev = (event) => {
        setDev(event.target.value);        
    };
    const onChangeManualTecnico = async(event)=>{
        await setFileManTec(event.target.files[0]);        
        await attach( event.target.files[0] , 1 )         
    }
    const onChangeManualDeploy = async(event)=>{
        await setFileManDep(event.target.files[0]);         
        await attach( event.target.files[0] , 2 )        
    }
    
    const onChangeTester = (event) => {
        setTester(event.target.value);        
    };
    const onChangeCronograma = async(event)=>{
        await setFileCrono(event.target.files[0]);
        await attach( event.target.files[0] , 3 )         

    }
    const onChangeServer = (event) => {
        setServer(event.target.value);      
    };
    const onChangeDb = (event) => {
        setDb(event.target.value);      
    };
    const onChangeAccesos = (event) => {
        setAcceso(event.target.value);      
    };
    const onChangePermisos = (event) => {
        setPermiso(event.target.value);      
    };
    const onChangeFechaIni = (event) => {
        setFechaInico(event.target.value);      
    };
    const onChangeFechaFin = (event) => {
        setFechaFinal(event.target.value);      
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // VISTA HTML
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div >
        <div style={{display: user.rol_id == 3 ? 'block' : 'none'}}>
            <h1>ACCESSO RESTRINGIDO</h1>
            <hr></hr>
            <p>No tiene accesso a este contenido.</p>
        </div>
        <form onSubmit={handlerSubmit} className="mb-3" style={{display: user.rol_id == 3 ? 'none': 'flex' }}>  
            
            <div className="row mt-3">
                <div className="col-md-8">
                    <h1>Proyecto</h1>
                </div>
                <div className="col-md-4 mt-2" style={{textAlign:"right"}}>
                    <h2>Correlativo: {proyectId}</h2>
                </div>
            </div>      
            
            <hr></hr>
            
            <div className="row mt-3" style={{display: user.rol_id == 2 ? 'none': 'flex' }}>

                <div className="col-md-4">
                    <label htmlFor="proyName" className="form-label">Nombre del proyecto</label>
                    <input value={proyName} type="text" onChange={onChangeProyName} name="proyName" className="form-control"/>
                </div>

                <div className="col-md-4">
                    <label htmlFor="" className="form-label">Producto Owner</label> 
                    <select name="po" value={po} onChange={onChangeUser} onClick={onChangeUser} className="form-select" >
                        <option value=' '></option>
                        {users.map((item, index)=>(
                            <option key={index} value={item.Fullname}>{item.Fullname}</option>
                        ))}                           
                    </select>                        
                </div> 

                <div className="col-md-3">
                    <label htmlFor="" className="form-label">Fecha de creación</label>
                    <input type="date" value={created} onChange={onChangeCreated} onClick={onChangeCreated} name="created" className="form-control"/>
                </div>       

            </div>

            <div className="row mt-3" style={{display: user.rol_id == 2 ?'none': 'flex' }}>

                <div className="col-md-4">
                    <label htmlFor="" className="form-label">Estado de Proyecto</label>                         
                    <select name="estado" value={estado} onChange={onChangeEstado} onClick={onChangeEstado} className="form-select" >
                        <option value=' '></option>
                        {estados.map((item, index)=>(
                            <option key={index} value={item.estado}>{item.estado}</option>
                        ))}                           
                    </select>
                </div>          
                
                <div className="col-md-4 mt-2">
                    <label className="control-label">Etapa</label>
                    <input value={etapa} type="text" name="etapa" className="form-control" readOnly={true} />
                </div>

                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 mt-2">
                    <label htmlFor="revision" className="control-label">Revisión</label>                    
                    <input value={revision}  type="text" name="revision" readOnly={true} className="form-control right" />
                </div>

            </div>
            
            <br className="mt-3z"></br>
            <hr></hr>
            <h4>Datos del Developer</h4>
            
            <div className="row form-group">
                
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="dev" className="control-label">Developer</label>
                    <select name="dev" value={dev} onChange={onChangeDev} onClick={onChangeDev} className="form-select" >
                        <option value=' '></option>
                        {devs.map((item, index)=>(
                            <option key={index} value={item.Fullname}>{item.Fullname}</option>
                        ))}
                    </select>                            
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Manual Técnico</label>
                    <input  type="file" name="manualTecnico" onChange={onChangeManualTecnico} className="form-control" id="manualTec"/>
                    {/* value={manualTecnico} no works */}
                </div>
                
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Código Fuente</label>
                    <input  type="file" name="manualDespliegue" onChange={onChangeManualDeploy} className="form-control" />
                    {/* value={manualDeploy} no works */}
                </div>

            </div>

            <br className="mt-3z"></br>
            <hr></hr>
            <h4>Datos del QA Tester</h4>

            <div className="row form-group" style={{display: user.rol_id == 2 ?'none': 'flex' }}>
                
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <label htmlFor="tester" className="control-label">QA Tester</label>
                    <select name="tester" value={tester} onChange={onChangeTester} onClick={onChangeTester} className="form-select" >
                        <option value=' '></option>
                        {testers.map((item, index)=>(
                            <option key={index} value={item.Fullname}>{item.Fullname}</option>
                        ))}
                    </select>   
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Cronograma</label>
                    <input  type="file" name="cronograma" onChange={onChangeCronograma} className="form-control" />
                    {/* value={cronograma} no works */}
                </div>
            </div>

            <br className="mt-3z"></br>
            <hr ></hr>
            <h4>Recursos para las Pruebas</h4>

            <div className="row form-group" style={{display: user.rol_id == 2 ?'none': 'flex' }}>
                
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="server" className="control-label">Servidor</label>                    
                    <select name="server" value={server} onChange={onChangeServer} onClick={onChangeServer} className="form-select" >
                        <option value=' '></option>
                        {servers.map((item, index)=>(
                            <option key={index} value={item.item}>{item.item}</option>
                        ))}
                    </select> 
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="db" className="control-label">Instancia DB</label>                    
                    <select name="db" value={db} onChange={onChangeDb} onClick={onChangeDb} className="form-select" >
                        <option value=' '></option>
                        {dbs.map((item, index)=>(
                            <option key={index} value={item.item}>{item.item}</option>
                        ))}
                    </select>
                </div>
            </div>
                
            <div className="row mt-3" style={{display: user.rol_id == 2 ?'none': 'flex' }}>
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="acceso" className="control-label">Accesos</label>
                    <select name="acceso" value={acceso} onChange={onChangeAccesos} onClick={onChangeAccesos} className="form-select" >
                        <option value=' '></option>
                        {accesos.map((item, index)=>(
                            <option key={index} value={item.item}>{item.item}</option>
                        ))}
                    </select>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="permiso" className="control-label">Permisos</label>
                    <select name="permiso" value={permiso} onChange={onChangePermisos} onClick={onChangePermisos} className="form-select" >
                        <option value=' '></option>
                        {permisos.map((item, index)=>(
                            <option key={index} value={item.item}>{item.item}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row mt-3" style={{display: user.rol_id == 2 ?'none': 'flex' }}>
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Fecha Inicio</label>
                    <input value={fechaInicio||''} type="date" name="fechaInicio" onChange={onChangeFechaIni} onClick={onChangeFechaIni} className="form-control" />
                </div>
          
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Fecha cierre</label>
                    <input value={fechaFinal||''} type="date" name="fechaFinal" onChange={onChangeFechaFin} onClick={onChangeFechaFin} className="form-control" />
                </div>
            </div>
            
            <br className="mt-3z"></br>
            <hr></hr>
            <div className="row mt-3">
                <div className="col-md-12 contenedor">                
                    <button type="submit" className="btn btn-primary" style={{width:150 +'px'}}>Guardar</button> 
                    <span style={{width:50+"px"}}></span>
                    <button onClick={() => navigate('/gestion')} type="button" className="btn btn-warning"  style={{width:150 +'px'}}>Cancelar</button>
                    
                </div>
            </div>
            
        </form>
        </div>
    )
}

export default GestionForm;