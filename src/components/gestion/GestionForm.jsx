import { useState, useEffect, useSyncExternalStore } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./GestionForm.css";

const MSG_NO_PROYNAME="Ingrese el nombre del proyecto";
const MSG_NO_PO="Seleccione el Product Owner";
const MSG_NO_DATE="Seleccione la fecha de creación";
const MSG_NO_DEV="Seleccione el Developer";
const MSG_NO_MANTEC="Adjunte el Manual Técnico";
const MSG_NO_MANDEP="Adjunte el Manual de Despliegue";
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
    const navigate = useNavigate();

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
    const [proyName, setProyName] = useState("");
    const [user, setUser] = useState("");
    const [created, setCreated] = useState("");
    const [estado, setEstado] = useState('');

    // Hook UseState para campos de tabla Proy_Etapa
    //const [proyectoId, setProyectoId] = useState(0);    
    const [etapaId, setEtapaId] = useState(1); // Binding a la DB
    const [etapa, setEtapa] = useState('Desarrollo-QA'); // Debe existir en la DB
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
    const [revision,setRevision] = useState('1');
    
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
        setUser(data[0].Fullname); // se toma el primer valor del combo box
        setDevs(data.filter(user => user.Rol_Id === 2));
        setDev(data[0].Fullname); // se toma el primer valor del combo box
        setTesters(data.filter(user => user.Rol_Id === 3));
        setTester(data[0].Fullname); // se toma el primer valor del combo box
    }

    const getEstados = async () =>{        
        const response = await fetch(backend+"/api/qa/estados");
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        //setEstados(data.filter(estado => estado.Etapa_Id === null)); etapa_id is null para todas las etapas 
        setEstados(data);       
        setEstado(data[0].estado); // se toma el primer valor del combo box
    }

    const getCatalogos = async () =>{        
        const response = await fetch(backend+"/api/qa/catalogos");
        //console.log(response);
        const data = await response.json();
        console.log(data);
        await setCatalogos(data); // Se solicita el catalogo 1 unica vez y se filtra
        await setServers(data.filter(cat => cat.tipo === 'serv'));
        await setDbs(data.filter(cat => cat.tipo === 'db'));
        await setAccesos(data.filter(cat => cat.tipo === 'acc'));
        await setPermisos(data.filter(cat => cat.tipo === 'per'));
    }

    // Evento Page Load 
    useEffect( ()=> {
        console.log("Cargando gestion form...");
        getEstados();
        getUsuarios();
        //setTasks([...tasks,{id:tasks.length+1,name:newTaskName,prioridad:1, completado:false}]); 
        const catalogo =  getCatalogos();
        // console.log(catalogo)
        //  setServers([...catalogo]);
        // setServers(catalogos.filter(cat => cat.tipo === 'serv'));
        // setDbs(catalogos.filter(cat => cat.tipo === 'db'));
        // setAccesos(catalogos.filter(cat => cat.tipo === 'acc'));
        // setPermisos(catalogos.filter(cat => cat.tipo === 'per'));
    },[]); // [] requerido para evitar loop infinito


    // Funcion para agregar un nuevo proyecto a las gestiones
    const addNewProyecto = async (proyectId) =>{                
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend)
        const datos = {             
            proyName,
            user,
            created,
            estado 
        };

        console.log(datos);

        await fetch(backend+'/api/qa/proyecto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            //if( data.affectedRows === 1 ) {}
            if( data > 0 ) {
                console.log('Proyecto: API Success'); 
                console.log(data);
                addNewEtapa(data); // backend envia el id
                return data; // > 0 : "OK";
            }
            else {
                console.log("Proyecto: MySQL Error");
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
    
    // Funcion para agregar una nueva etapa a un proyecto 
    const addNewEtapa = async (id) =>{     
        console.log(id) 
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Frontend y Backend) 
        const datos = {           
            id,  
            etapaId, // default 1
            estado: 'En cola',
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
                console.log('Etapa: API Success'); 
                //console.log(data);
                alert("Proyecto guardado correctamente.");
                navigate('/revision'); // <------------------------------------------------------
                return "OK";
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
    
    const createNewGestion = async(valid) => {
        if( valid === true ) {
            const id = await addNewProyecto();
            console.log("id", id);
        }
    }

    const attach = async (filename, field) => {
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
                field = response.data; // asigna el campo recibido como parametro
                return "OK";
            })
            .catch(error => {
                console.error('Attach Error:', error);
                return error;
            });            
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // EVENTOS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // Evento OnSubmit del Form
    const handlerSubmit =  (e) => {
        e.preventDefault(); // evitar recargar la página web (postback)
        // console.log("PO: ",user);
        // console.log("Estado: ",estado);
        // console.log("Dev: ",dev);
        // console.log("Tester: ",tester);
        console.log("Server: ",server);

        //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // Validaciones        
        //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        if( proyName.length === 0){            
            console.log(MSG_NO_PROYNAME);
            alert(MSG_NO_PROYNAME);
            return;
        }
        else if( user.length === 0){            
            console.log(MSG_NO_PO);
            alert(MSG_NO_PO);
            return;
        }
        else if( created.length === 0){            
            console.log(MSG_NO_DATE);
            alert(MSG_NO_DATE);
            return;
        }
        else if( dev.length === 0){
            console.log(MSG_NO_DEV);
            alert(MSG_NO_DEV);
            return;
        }       
        else if( tester.length === 0){
            console.log(MSG_NO_TESTER);
            alert(MSG_NO_TESTER);
            return;
        }       
        else if( server.length === 0){
            console.log(MSG_NO_SERV);
            alert(MSG_NO_SERV);
            return;
        }
        else if( db.length === 0){
            console.log(MSG_NO_DB);
            alert(MSG_NO_DB);
            return;
        }
        else if( acceso.length === 0){
            console.log(MSG_NO_ACCESOS);
            alert(MSG_NO_ACCESOS);
            return;
        }
        else if( permiso.length === 0){
            console.log(MSG_NO_PERMISOS);
            alert(MSG_NO_PERMISOS);
            return;
        }
        else if( fechaInicio.length === 0){
            console.log(MSG_NO_FECHA_INI);
            alert(MSG_NO_FECHA_INI);
            return;
        }
        // else if( fechaFinal.length === 0){
        //     console.log(MSG_NO_FECHA_FIN);
        //     alert(MSG_NO_FECHA_FIN);
        //     return;
        // }
        else {            
            //console.log(fileManTec);    
            attach( fileManTec, manualTecnico )
            //console.log("man tec: " +manualTecnico );
            if( manualTecnico === null ) {
                alert("Adjunte el Manual Técnico.");
                return;
            }
            
            attach( fileManDep, manualDeploy ) 
            if( manualDeploy === null ) {
                alert("Adjunte el Manual de Despliegue.");
                return; 
            }

            attach( fileCrono, cronograma ) 
            if( cronograma === null ) {
                alert("Adjunte el Cronograma de QA.");
                return;
            }

            createNewGestion(true);
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
        setUser(e.target.value);        
    }    
    const onChangeEstado = (event) => { 
        setEstado(event.target.value);        
    };
    
    const onChangeDev = (event) => {
        setDev(event.target.value);        
    };
    const onChangeManualTecnico = (event)=>{
        setFileManTec(event.target.files[0]);        
    }
    const onChangeManualDeploy = (event)=>{
        setFileManDep(event.target.files[0]);        
    }
    
    const onChangeTester = (event) => {
        setTester(event.target.value);        
    };
    const onChangeCronograma = (event)=>{
        setFileCrono(event.target.files[0]);        
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
        <form onSubmit={handlerSubmit} className="mb-3">        
            <h1>Gestión y Control de Calidad</h1>
            <hr></hr>
            
            <div className="row mt-3">

                <div className="col-md-3">
                    <label htmlFor="proyName" className="form-label">Nombre del proyecto</label>
                    <input type="text" value={proyName} onChange={onChangeProyName} name="proyName" className="form-control"/>
                </div>

                <div className="col-md-3">
                    <label htmlFor="" className="form-label">Producto Owner</label> 
                    <select name="user" value={user} onChange={onChangeUser} onClick={onChangeUser} className="form-select" >
                        {users.map((item, index)=>(
                            <option key={index} value={item.Fullname}>{item.Fullname}</option>
                        ))}                           
                    </select>                        
                </div> 

                <div className="col-md-3">
                    <label htmlFor="" className="form-label">Estado de Proyecto</label>                         
                    <select name="estado" value={estado} onChange={onChangeEstado} onClick={onChangeEstado} className="form-select" >
                        {estados.map((item, index)=>(
                            <option key={index} value={item.estado}>{item.estado}</option>
                        ))}                           
                    </select>
                </div> 

                <div className="col-md-3">
                    <label htmlFor="" className="form-label">Fecha de creación</label>
                    <input type="date" value={created} onChange={onChangeCreated} onClick={onChangeCreated} name="created" className="form-control"/>
                </div>                
            </div>

            <hr></hr>

            <div className="row form-group">
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Etapa</label>
                    <p>{etapa}</p>
                    {/* <input type="text" name="etapa" className="form-control" value={etapa} readOnly={true} /> */}
                </div>

                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <label htmlFor="revision" className="control-label">Revisión</label>
                    <p>{revision}</p>
                    {/* <input type="text" name="revision" value={revision} readOnly={true} className="form-control right" /> */}
                </div>

            </div>
            
            <hr></hr>
            <h4>Datos del Developer</h4>
            
            <div className="row form-group">
                
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="dev" className="control-label">Developer</label>
                    <select name="dev" value={dev} onChange={onChangeDev} onClick={onChangeDev} className="form-select" >
                        {devs.map((item, index)=>(
                            <option key={index} value={item.Fullname}>{item.Fullname}</option>
                        ))}
                    </select>                            
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Manual Técnico</label>
                    <input type="file" name="manualTecnico" onChange={onChangeManualTecnico} className="form-control" id="manualTec"/>
                </div>
                
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Manual de Despliegue</label>
                    <input type="file" name="manualDespliegue" onChange={onChangeManualDeploy} className="form-control" />
                </div>

            </div>

            <hr></hr>
            <h4>Datos del QA Tester</h4>

            <div className="row form-group">
                
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="tester" className="control-label">QA Tester</label>
                    <select name="tester" value={tester} onChange={onChangeTester} onClick={onChangeTester} className="form-select" >
                        {testers.map((item, index)=>(
                            <option key={index} value={item.Fullname}>{item.Fullname}</option>
                        ))}
                    </select>   
                </div>

                <div className="col-lg-4 col-md-3 col-sm-6 col-xs-12">
                    <label className="control-label">Cronograma</label>
                    <input type="file" name="cronograma" onChange={onChangeCronograma} className="form-control" />
                </div>
            </div>

            <hr></hr>
            <h4>Ambiente de Pruebas</h4>

            <div className="row form-group">
                
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="server" className="control-label">Servidor</label>                    
                    <select name="server" value={server} onChange={onChangeServer} onClick={onChangeServer} className="form-select" >
                        {servers.map((item, index)=>(
                            <option key={index} value={item.item}>{item.item}</option>
                        ))}
                    </select> 
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="db" className="control-label">Instancia DB</label>                    
                    <select name="db" value={db} onChange={onChangeDb} onClick={onChangeDb} className="form-select" >
                        {dbs.map((item, index)=>(
                            <option key={index} value={item.item}>{item.item}</option>
                        ))}
                    </select>
                </div>
            </div>
                
            <div className="row form-group">
                <div className="col-lg-4 col-md-3 col-sm-6 col-xs-12">
                    <label htmlFor="acceso" className="control-label">Accesos</label>
                    <select name="acceso" value={db} onChange={onChangeAccesos} onClick={onChangeAccesos} className="form-select" >
                        {accesos.map((item, index)=>(
                            <option key={index} value={item.item}>{item.item}</option>
                        ))}
                    </select>
                </div>

                <div className="col-lg-4 col-md-3 col-sm-6 col-xs-12">
                    <label htmlFor="permiso" className="control-label">Permisos</label>
                    <select name="permiso" value={db} onChange={onChangePermisos} onClick={onChangePermisos} className="form-select" >
                        {permisos.map((item, index)=>(
                            <option key={index} value={item.item}>{item.item}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row form-group">            
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Fecha Inicio</label>
                    <input type="date" name="fechaInicio" onChange={onChangeFechaIni} onClick={onChangeFechaIni} className="form-control" />
                </div>
          
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Fecha cierre</label>
                    <input type="date" name="fechaFinal" onChange={onChangeFechaFin} onClick={onChangeFechaFin} className="form-control" />
                </div>
            </div>
            
            <hr></hr>

            <div className="row mt-3">
                <div className="col-md-12 contenedor">                
                    <button type="submit" className="btn btn-primary" style={{width:150 +'px'}}>Guardar</button> 
                    {/* <span style={{width:50 +'px'}}></span>
                    <button type="button" className="btn btn-success" style={{width:150 +'px'}}>Revisión</button>  */}
                </div>
            </div>
        
        </form>
    )
}

export default GestionForm;