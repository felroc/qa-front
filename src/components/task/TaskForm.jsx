import { useState, useRef, useEffect } from "react";

const TaskForm = ({addNewTask}) => {    

    const [taskName , setTaskName] = useState("");
    const inputName = useRef(null);

    useEffect( ()=>{
        inputName.current.focus();
    })

    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log("Guardando Task...");
    }

    const handleInputChange = (e)=>{
        //console.log(e);
        //console.log(e.target);
        //console.log(e.target.name);
        //console.log(e.target.value);
        setTaskName(e.target.value);
        console.log(taskName)
    }

    const createNewTask=()=>{
        if( taskName.length>0){
            addNewTask(taskName);
            setTaskName("");
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name:</label>
                <input type="text" ref={inputName} value={taskName} onChange={handleInputChange} name="name" className="form-control"></input>                
            </div>
            <button type="submit" onClick={createNewTask} className="btn btn-primary" >Guardar</button> 
        </form>
    )
}

export default TaskForm;