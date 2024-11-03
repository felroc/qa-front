// Styles
import "./GestionRow.css";

//const TaskRow = ( props) => {
//    console.log(props);

const GestionRow = ( {index,task, toggleTask}) => {        
    //console.log(task);
    const prioridades = ["Ninguna", "Baja","Meida","Alta"];

    return (
        <tr>
            <td>{index}</td>
            <td>{task.id}</td>
            <td>{task.name}</td> 
            <td>{prioridades[task.prioridad]}</td>
            <td>
                <input type="checkbox" checked={task.completado} onChange={()=>toggleTask(task.id)} ></input>
                {task.completado}</td>
        </tr>
    )
}

export default GestionRow;