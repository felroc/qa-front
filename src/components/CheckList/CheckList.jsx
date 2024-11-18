import "./CheckList.css"
import { useEffect, useState } from "react"
import moment from 'moment'; 
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useAuth } from "../../AuthContext";

const CheckList = ({frontend,backend}) => {
    const { user } = useAuth();

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
            console.log('getCheckList',data);
            setItems(data);
            // return data;
        }
        catch(err){
            console.error(err);
        }        
    }

    useEffect( ()=> {  
        if( user.rol_id == 1 || user.rol_id==3){
            getCheckList()               
        } else {
            Notificacion("No tiene autorización para este contenido",'error')
        }
    },[])


    const onChangeItem = (e) => {
        setItem(e.target.value);         
    }

    const onChangeEstado = (e) => {        
        setActivo(e.target.value); 
    }
    
    const onEdit = (item)=>{
        setId(item.Check_List_Id)
        setItem(item.Item); 
        setActivo(item.Activo)
        // console.log('item',item)
    }

    const addPrueba = async (prueba) => {
        console.log('addPrueba',prueba)
        await fetch(backend+'/api/qa/check_list', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(prueba),
        })
        .then(response => response.json())
        .then(data => {
            console.log('addPrueba:', data);
            
            if( data.affectedRows === 1 ) {
                //console.info('AddPrueba: API Success'); 
                //console.log(data);                
                Notificacion("La Prueba se guardó correctamente!","success");
                return "OK";
            }
            else {
                console.error("MySQL",data);                
                Notificacion("MySQL: "+data,"error");
                return data;
            }
        })
        .catch(error => {
            console.error('API Error',error);            
            Notificacion('API '+error,"error");
            return error;
        });
    }

    const updatePrueba = async (prueba) => {
        console.log('updatePrueba',prueba)
        await fetch(backend+'/api/qa/check_list', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(prueba),
        })
        .then(response => response.json())
        .then(data => {
            console.log('updatePrueba:', data);            
            if( data.affectedRows === 1 ) {
                //console.info('updatePrueba: API Success',data); 
                Notificacion("La Prueba se actualizó correctamente!","success");
                return "OK";
            }
            else {
                console.error("MySQL", data);                
                Notificacion("MySQL "+data,"error");
                return data;
            }
        })
        .catch(error => {
            console.error('API',error);            
            Notificacion('API '+error,"error");
            return error;
        });
    }

    const savePrueba =async () => {
        const datos = {
            CheckListId : id,
            Item        : item,
            Activo      : activo,
            TipoTestId: 1
        }

        // console.log('savePrueba:',datos)
        
        if( activo === ' ') {
            Notificacion('seleccione un estado');
            return;
        }
        else if( id === 0)
        {
            await addPrueba(datos)

            await setItems([...items,{
                Check_List_Id : id,
                Item        : item,
                Activo      : activo,
                Tipo_Test_Id: 1
            }])            
        }
        else { // Actualizar    
            await updatePrueba(datos)        
            
            await setItems( items.map( (i) => (
                i.Check_List_Id === id ? {...i,Item:item,Activo:activo} : i
            )))
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
        console.log('deleteCheckList',item)
        try{
            const datos = { CheckListId: item.Check_List_Id } 
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
            setItems(items.filter(i => i.Check_List_Id !== item.Check_List_Id));            
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

        <div className="row form-group mt-3" style={{display: user.rol_id == 2 ?'none': 'flex' }}>

            <div className="col-md-8">
                <label htmlFor="item" className="form-label">Nombre de la Prueba</label>
                <input autoComplete="1" type="text" value={item||''} onChange={onChangeItem} required name="item" className="form-control"/>
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

        <div className="row mt-3" style={{display: user.rol_id == 2 ?'none': 'flex' }}>
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
                        <th colSpan={2}>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index)=>(                                
                        <tr key={index} >
                            <td>{item.Check_List_Id}</td>
                            <td>{item.Item}</td>
                            <td>
                                <span className="label-control">{item.Activo==true || item.Activo == 1 ? 'Activo' : 'Inactivo'}</span>
                            </td>
                            <td>
                                <button onClick={()=>{onEdit(item)}} type="button" className="btn btn-warning btn-darkx">Editar</button>
                            </td>                            
                            <td>
                                <button onClick={()=>{onDelete(item)}} className="btn btn-info btn-darkx">Eliminar</button>
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