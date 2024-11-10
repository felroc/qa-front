import { useState, useEffect } from "react";
import axios from 'axios';

const backend = "http://localhost:8081";

const msgnoproy="Debe ingresar el nombre del proyecto";
const msgnopo="Debe seleccionar el Product Owner";
const msgnodate="Debe ingresar la fecha de creación";

// Formulario para ingreso de proyectos
const GestionForm = ()=> {
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // BINDINGS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Hook userState para listado de proyectos
    const [proys, setProys] = useState([]);    

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
    const [etapa, setEtapa] = useState('Solicitado'); // Debe existir en la DB
    const [etapaId, setEtapaId] = useState(1); // Binding a la DB
    const [dev, setDev] = useState('');
    const [manualTecnico, setManualTecnico] = useState(''); 
    const [manualDeploy, setManualDeploy] = useState(''); 
    const [tester, setTester] = useState('');
    const [cronograma, setCronograma] = useState(''); 
    const [acceso, setAcceso] = useState("");
    const [permiso, setPermiso] = useState("");
    const [db, setDb] = useState("");
    const [server, setServer] = useState("");
    const [fechaInicio, setFechaInico] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    
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
        setCatalogos(data); // Se solicita el catalogo 1 unica vez y se filtra
        setServers(data.filter(cat => cat.tipo === 'serv'));
        setDbs(data.filter(cat => cat.tipo === 'db'));
        setAccesos(data.filter(cat => cat.tipo === 'acc'));
        setPermisos(data.filter(cat => cat.tipo === 'per'));
    }

    // On Load Event
    useEffect( ()=> {
        console.log("Cargando gestion form...");
        getEstados();
        getUsuarios();
        getCatalogos();       
    },[]);


    // Funcion para agregar un nuevo proyecto a las gestiones
    const addNewProyecto = async () =>{                
        // DTO : Data Transfer Object ( Sirve para transferencia entre el Front y Back )
        const datos = {             
            proyName,
            user,
            created,
            estado 
        };

        //alert('estado '+estado);
        //setProys([...proys, datos]);

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
            // Mostrar mensaje de éxito o error al usuario
            if( data.affectedRows===1 ) 
                alert('El proyecto fue guardado.'); 
            else 
                alert("ERROR en el MySQL."+data.info); 
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            // Mostrar mensaje de error al usuario
        });
    };    
    
    const createNewGestion=()=>{    
        addNewProyecto();
        addNewEtapa();    
    }

    const attach = async (filename, field) => {
        if( filename === null || filename === undefined ) {
            alert('Seleccione un archivo...' );
            return;
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
                console.log('Attach:', response.data);                
                field = response.data; // asigna el campo recibido como parametro
                //return response.data;
            })
            .catch(error => {
                console.error('Error al subir el archivo:', error);
                alert('Error al subir el archivo:', error);
            });            
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // EVENTOS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    
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

    // Evento OnSubmit del Form
    const handlerSubmit =  (e)=>{
        e.preventDefault(); // evitar submit para enviar datos al backend
                
        // Validaciones        
        if( proyName.length === 0){            
            console.log(msgnoproy);
            alert(msgnoproy);
            return;
        }
        else if( user.length === 0){            
            console.log(msgnopo);
            alert(msgnopo);
            return;
        }
        else if( created.length === 0){            
            console.log(msgnodate);
            alert(msgnodate);
            return;
        }
        else {            
            //console.log(fileManTec);    
            attach( fileManTec, manualTecnico )
            //console.log("man tec: " +manualTecnico );
            if( manualTecnico === null ) return;
            
            attach( fileManDep, manualDeploy ) 
            if( manualDeploy === null ) return; 

            attach( fileCrono, cronograma ) 
            if( cronograma === null ) return;

            createNewGestion();
        }        
    } 
    
    // Funcion para agregar una nueva etapa a un proyecto 
    const addNewEtapa = (newTaskName) =>{       
        const datos = {             
            etapaId, // default 1
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
            fechaInicio: fechaInicio,
            fechaFinal: fechaFinal
        };
        //setEtapa([...etapas, datos]);
        
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // COMPONENTE HTML
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
                    <input type="date" value={created} onChange={onChangeCreated} name="created" className="form-control"/>
                </div>
                
                
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Etapa</label>
                    <input type="text" name="etapa" className="form-control" value={etapa} readOnly={true} />
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
                    <input type="file" name="cronograma" className="form-control" />
                </div>
            </div>

            <hr></hr>
            <h4>Ambiente de Pruebas</h4>

            <div className="row form-group">
                
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Servidor</label>                    
                    <select name="server" value={server} onChange={onChangeServer} onClick={onChangeServer} className="form-select" >
                        {servers.map((item, index)=>(
                            <option key={index} value={item.item}>{item.item}</option>
                        ))}
                    </select> 
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Instancia DB</label>                    
                    <select name="db" value={db} onChange={onChangeDb} onClick={onChangeDb} className="form-select" >
                        {dbs.map((item, index)=>(
                            <option key={index} value={item.item}>{item.item}</option>
                        ))}
                    </select>
                </div>

                {/* <div className="col-lg-4 col-md-3 col-sm-6 col-xs-12">
                    <label className="control-label">Componentes</label>
                    <input type="text" name="ambiente" className="form-control" />
                </div> */}

                <div className="col-lg-4 col-md-3 col-sm-6 col-xs-12">
                    <label className="control-label">Accesos</label>
                    <select name="acceso" value={db} onChange={onChangeAccesos} onClick={onChangeAccesos} className="form-select" >
                        {accesos.map((item, index)=>(
                            <option key={index} value={item.item}>{item.item}</option>
                        ))}
                    </select>
                </div>

                <div className="col-lg-4 col-md-3 col-sm-6 col-xs-12">
                    <label className="control-label">Permisos</label>
                    <select name="permiso" value={db} onChange={onChangePermisos} onClick={onChangePermisos} className="form-select" >
                        {permisos.map((item, index)=>(
                            <option key={index} value={item.item}>{item.item}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row form-group">                
            
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="estado" className="control-label">Revisión</label>
                    <select id="estado" className="form-control">
                        <option value=""></option>
                        <option>Pruebas de Negocio</option>
                        <option>Pruebas de Desarrollo</option>
                        <option>Pruebas de QA</option>
                        <option>Pruebas de Integración</option>
                        <option>Pruebas de OWASP</option>
                    </select>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Fecha Inicio</label>
                    <input type="date" name="fechaInicio" className="form-control" />
                </div>
          
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="control-label">Fecha cierre</label>
                    <input type="date" name="fechaFinal" className="form-control" />
                </div>
            </div>


            <div className="row mt-3">
                <div className="col-md-12">
                {/* onClick={createNewGestion} */}
                    <button type="submit" className="btn btn-primary" >Guardar</button> 
                </div>
            </div>
        
        </form>
    )
}

export default GestionForm;