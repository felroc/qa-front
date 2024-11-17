import "./CheckList.css"
import { useEffect, useState } from "react"
import moment from 'moment'; 
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const CheckList = ({frontend,backend}) => {
    
    const [items,setItems] = useState([])
    const [id,setId] = useState(0)
    const [item,setItem] = useState('')    
    const [activo,setActivo] = useState(' ')
    
    const MySwal = withReactContent(Swal);

    const Notificacion = async (msg, icono='warning') => {
        await Swal.fire({
            position: "top-end",
            icon: icono,
            title: msg,
            showConfirmButton: false,
            timer: 3000
          });
    }

    const getCheckList = async () =>{        
        try{
            const response = await fetch(backend+"/api/qa/check_list");
            //console.log(response);
            const data = await response.json();
            // console.log('getCheckList',data);
            setItems(data);
            // return data;
        }
        catch(err){
            console.error(err);
        }        
    }

    useEffect( ()=> {  
        getCheckList()               
    },[])


    const onChangeItem = (e) => {
        setItem(e.target.value);         
    }

    const onChangeEstado = (e) => {        
        setActivo(e.target.value); 
    }
    
    const onEdit = (item)=>{
        setId(item.CheckListId)
        setItem(item.Item); 
        setActivo(item.Activo)
        // console.log('item',item)
    }

    const addPrueba = async (prueba) => {
        
        await fetch(backend+'/api/qa/check_list', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(prueba),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            //if( data.affectedRows === 1 ) {}
            if( data.msg === prueba.CheckListId ) {
                console.info('Proyecto: API Success'); 
                //console.log(data);                
                Notificacion("El usuario se guardó correctamente!","success");                
                return "OK";
            }
            else {
                console.error("MySQL Error");
                //console.log(data);
                Notificacion("MySQL Error: "+data.msg,"error");
                return data;
            }
        })
        .catch(error => {
            console.error('API Error',"error");
            console.log(error);
            Notificacion('API Error',"error");
            return error;
        });
    }

    const updatePrueba = async (prueba) => {

        await fetch(backend+'/api/qa/check_list', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(prueba),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            //if( data.affectedRows === 1 ) {}
            if( data.msg === prueba.CheckListId ) {
                console.info('Proyecto: API Success'); 
                //console.log(data);                
                // Notificacion("El usuario se guardó correctamente!","success");                
                return "OK";
            }
            else {
                console.error("MySQL Error");
                //console.log(data);
                Notificacion("MySQL Error: "+data.msg,"error");
                return data;
            }
        })
        .catch(error => {
            console.error('API Error',"error");
            console.log(error);
            Notificacion('API Error',"error");
            return error;
        });
    }

    const savePrueba = () => {
        const datos = {
            CheckListId : id,
            Item        : item,
            Activo      : activo
        }

        console.log('savePrueba:',datos)
        
        if( activo === ' ') {
            Notificacion('seleccione un estado');
            return;
        }
        else if( id === 0)
        {
            addPrueba(datos)

            setItems([...items,{
                CheckListId : id,
                Item        : item,
                Activo      : activo,
                TipoTestId: 1
            }])

            Notificacion('La Prueba se agregó correctamente.','success');
        }
        else { // Actualizar    
            updatePrueba(datos)        
            
            setItems( items.map( (i) => (
                i.CheckListId === id ? {...i,Item:item,Activo:activo} : i
            )))

            Notificacion('La Prueba se actualizó correctamente.','success');
        }

        // Clear
        setId(0)
        setItem('')
        setActivo(' ')

    }

    const onSumbit = (e) => {
        e.preventDefault(); // evitar recargar la página web (postback)
        savePrueba()
    }

    const deleteCheckList = async(item) => {
        
        try{
            const datos = { CheckListId: item.CheckListId } 
            const response = await fetch(backend+"/api/qa/check_list", {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos),
            }) 
            //console.log('onDelete',response);
            //const data = await response.json();
            //console.log('onDelete',data);
            setItems(items.filter(i => i.CheckListId !== item.CheckListId));            
            Notificacion("La prueba fue eliminada","success")
            //Swal.fire("La prueba fue eliminada.", "", "info");            
        } 
        catch(err) { 
            Notificacion(err,"success")
            Swal.fire(err, "", "info");            
            console.error('onDelete',err);
        }
    }

    const onDelete = async (item) => {
        Swal.fire({
            title: "¿Desea eliminar la prueba?",
            showDenyButton: true,
            showConfirmButton: false,
            showCancelButton: true,
            confirmButtonColor: "danger",
            //confirmButtonText: "Eliminar",
            denyButtonText: `Eliminar`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire("Saved!", "", "success");
            } else if (result.isDenied) {
                deleteCheckList(item)
                
            }
        });             
    }

    return (
    <>
        <h1 className="mt-3">Listado de Pruebas</h1>
        <hr></hr>

        <div className="row form-group mt-3">

            <div className="col-md-8">
                <label htmlFor="item" className="form-label">Nombre de la Prueba</label>
                <input type="text" value={item||''} onChange={onChangeItem} required name="item" className="form-control"/>
            </div>

            <div className="col-md-4">
                <label htmlFor="item" className="form-label">Estado</label>
                <select value={activo||0} onChange={onChangeEstado} className="form-select">
                    <option value={' '}></option>
                    <option value={'1'}>Activo</option>
                    <option value={'0'}>Inactivo</option>
                </select>
                {/* <input type="text" value={item.Activo==null?0:1||''} onChange={onChangeItem} name="item" className="form-control"/> */}
            </div>
      
        </div>

        <div className="row mt-3">
            <div className="col-md-12 contenedor">       
            <form onSubmit={onSumbit}>         
                <button type="submit" className="btn btn-primary" style={{width:"150px"}}>Guardar</button> 
                <span style={{width:50+"px"}}></span>
                {/* <button className="btn btn-warning" onClick={() => navigate('/')} style={{width:150 +'px'}}>Cancelar</button> */}
            </form>
            </div>
        </div>

        <div className="table-responsive mt-3">
            <table className="table table-striped table-borderedx table-hover table-dark2">                
                <thead>
                    <tr>
                        {/* {headers.map((header, index)=>(
                            <th style={headerStyle} key={index}>{header}</th>
                        ))} */}
                        <th >ID</th>
                        <th >Nombre de la Prueba</th>
                        <th >Activo</th>
                        <th colSpan={2}>&bnsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index)=>(                                
                        <tr key={index} >
                            <td>{item.CheckListId}</td>
                            <td>{item.Item}</td>
                            <td>
                                <span className="label-control">{item.Activo==true || item.Activo == 1 ? 'Activo' : 'Inactivo'}</span>
                            </td>
                            <td>
                                <button onClick={()=>{onEdit(item)}} type="button" className="btn btn-warning1 btn-dark">Editar</button>
                            </td>                            
                            <td>
                                <button onClick={()=>{onDelete(item)}} className="btn btn-info1 btn-dark">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>       
    
    </>
    )
}

export default CheckList;