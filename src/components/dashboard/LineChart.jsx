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
            label: 'Proyectos',
            data:  datos, // [30, 55, 15, 5],
            borderColor: 'rgba(54, 162, 235, 0.5)', // Azul
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: true
        }
      ]
    };
  
    return (
      <div style={{marginLeft:"05px"}}>
        {/* <h2>Gráfico de Líneas</h2> */}
        <Line data={data} style={{width:"600px",height:"200px"}} />
      </div>
    );
  }

  export default LineChart;