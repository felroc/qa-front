import { useState, useRef, useEffect } from "react";

// Formulario para ingreso de proyectos
const GestionForm = ()=>{
    
    // Hook userState para listado de proyectos
    const [proys, setProys] = useState([]);    

    // Hook userState para etapas (por proyecto)
    const [etapas, setEtapa] = useState([]);    
    
    // Hook UseState para campos de tabla Proyecto
    const [proyectoId, setProyectoId] = useState(0);
    const [proyName, setProyName] = useState("");
    const [user, setUser] = useState("");
    const [created, setCreated] = useState("");
    const [estado, setEstado] = useState("");

    // Hook UseState para campos de tabla Proy_Etapa
    const [etapaId, setEtapaId] = useState(0); 
    const [dev, setDev] = useState("");
    const [qa, setQA] = useState("");
    const [manualTec, setManualTec] = useState("");
    const [manualDeploy, setManualDeploy] = useState("");
    const [cronogramaQA, setCronogramaQA] = useState("");
    const [ambiente, setAmbiente] = useState("");
    const [accesos, setAccesos] = useState("");
    const [permisos, setPermisos] = useState("");
    const [instanciaDB, setInstanciaDB] = useState("");
    const [serverName, setServerName] = useState("");
    const [fechaInicio, setFechaInico] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");

    // Funcion para agregar un nuevo proyecto a las gestiones
    const addNewProyecto = (newTaskName) =>{
        //setTasks([...tasks,{id:tasks.length+1,name:newTaskName,prioridad:1, completado:false}]); 
        const proyectoId = proys.length + 1;

        // DTO : Data Transfer Object ( Sirve para transferencia entre el Front y Back )
        const datos = { 
            //proyectoId: proyectoId, 
            nombre: proyName,
            user: user,
            created: created,
            estado: "Ingresado" // estado inicial
        };

        //alert('nombre '+datos.user);

        setProys([...proys, datos]);

        fetch('http://localhost:8081/api/qa/proy', {
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
                alert("ERROR en el MySQL."); // ampliar error
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            // Mostrar mensaje de error al usuario
        });
    };
    

    // Funcion para agregar una nueva etapa a un proyecto 
    const addNewEtapa = (newTaskName) =>{
        //setTasks([...tasks,{id:tasks.length+1,name:newTaskName,prioridad:1, completado:false}]); 
        const etapaId = etapas.length + 1;
        const datos = { 
            proyectoId: proyectoId,
            etapaId: etapaId,
            dev: dev,
            qaTester: qa,
            manualTecnico: manualTec,
            manualDespliegue: manualDeploy,
            cronograma: cronogramaQA,
            ambiente: ambiente,
            acceso: accesos,
            permisos: permisos,
            instanciaDB: instanciaDB,
            serverName: serverName,
            fechaInicio: fechaInicio,
            fechaFinal: fechaFinal
       };
        setEtapa([...etapas, datos]);
    }

    const createNewGestion=()=>{
        const msgnoproy="Debe ingresar el nombre del proyecto";
        const msgnopo="Debe seleccionar el Product Owner";
        const msgnodate="Debe ingresar la fecha de creación";

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
            addNewProyecto();
            addNewEtapa();
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
    const onChangeEstado = (e)=>{ 
        setEstado(e.target.value);        
    }

    // Evento OnSubmit del Form
    const handlerSubmit = (e)=>{
        e.preventDefault(); // evitar submit 
    } 
    
    // Hook UserEffect para OnFocus del TextBox Nombre del Proyecto
    // const proyectName = useRef(null);
    // useEffect( ()=>{
    //     proyectName.current.focus(); // pone el cursor en el TextBox Nombre de proyecto
    // })

    return (
        <form onSubmit={handlerSubmit}>
            <div className="mb-3">
                <h1>Nuevo Proyecto</h1>
                <hr></hr>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <label htmlFor="proyName" className="form-label">Nombre del proyecto</label>
                        <input type="text" value={proyName} onChange={onChangeProyName} name="proyName" className="form-control"></input>
                        {/* ref={proyectName}  */}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="" className="form-label">Fecha de creación</label>
                        <input type="date" value={created} onChange={onChangeCreated} name="created" className="form-control"></input>
                    </div>
                </div> 

                <div className="row mt-3">
                    <div className="col-md-6">
                        <label htmlFor="" className="form-label">Producto Owner</label> 
                        <input type="text" value={user} onChange={onChangeUser} name="user" className="form-control"></input>
                    </div> 
                    <div className="col-md-6">
                        <label htmlFor="" className="form-label">Estado</label> 
                        <input type="text" value={estado} onChange={onChangeEstado} name="estado" className="form-control"></input>
                    </div> 
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <button type="submit" onClick={createNewGestion} className="btn btn-primary" >Guardar</button> 
                    </div>
                </div>
            </div>            
        </form>
    )
}

export default GestionForm;