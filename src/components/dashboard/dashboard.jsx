import PieChart from "./PieChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { useState, useEffect, useRef } from "react";

const Dashboard = ({frontend,backend}) => {
    
    // const [tbl, setTbl] = useState([])
    const [datos, setDatos] = useState([]);
    const [labels, setLabels] = useState([]);
    //const labels = ['Solicitado','En Revisión', 'En Corrección', 'Aprobado', 'Rechazado']//, 'Descartados']
    
    const getDashboard = async () => {
        try {
            const response = await fetch(backend+"/api/qa/dashboard");
            const data = await response.json();
            // console.log('getDashboard: ',data);
            
            // await setTbl(data);
            // console.log('tbl: ',tbl);

            const lst = await data.map((dato)=> dato.cantidad)
            await setDatos(lst)
            // console.log('lst: ',lst);

            const lbl = await data.map((dato)=> dato.estado)
            await setLabels(lbl)
            // console.log('lbl: ',lbl);

            return lst;
        }
        catch(error){
            console.error('getDashboard: ',error)
        }
    }
    
    //console.log('datos: ',datos)

    // Evento Page Load
    useEffect( () => {
        const data = getDashboard();        
       
    },[])

    return (
        <div>
            <h1>Gestion de Proyectos</h1>
            <hr></hr>
            <div className="row"> 

                <div className="col-md-4">
                    <LineChart labels={labels} datos={datos}></LineChart>
                </div>

                <div className="col-md-4">
                    <BarChart labels={labels} datos={datos}></BarChart>
                </div>
               
                <div className="col-md-4">
                    <PieChart labels={labels} datos={datos}></PieChart>    
                </div>
            </div>
        </div>
    )
}

export default Dashboard;