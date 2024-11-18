import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const  LineChart = ({labels,datos}) => {
    const data = {
      labels: labels, //['En proceso', 'Completados', 'Rechazados', 'Descartados'],
      datasets: [
        {
            label: 'Variación de los Estados ',
            data:  datos, // [30, 55, 15, 5],
            borderColor:      'rgba(54, 162, 235, 0.5)', // Azul            
            borderWidth: 1,
            fill: true,
            backgroundColor:  "rgba(54, 162, 235, 1)",
        }
      ]
    };
  
    return (      
      // style={{}}
      <div style={{marginLeft:"50px",width:"800px",height:"500px"}}>

        <Line data={data}  />

        <br></br>
        <p>Indicador de comportamiente de los estados en el desarrollo de software</p>
      </div>
    );
  }

  export default LineChart;