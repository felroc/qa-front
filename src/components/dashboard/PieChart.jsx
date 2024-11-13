import "./PieChart.css"
import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);


const PieChart = ({labels,datos}) => {  

  const [chartData, setChartData] = useState({
    //labels: ['Azul', 'Verde','Rojo', ],
    labels: labels, //['Solicitado','En Revisión', 'En Corrección', 'Aprobado', 'Rechazado', 'Descartados'],
    datasets: [{
      label: 'PieChart',
      data: datos, // [30, 55, 15, 5],
      backgroundColor: [        
        'rgba(54, 162, 235, 0.5)', // Azul
        'rgba(75, 192, 192, 0.5)', // Verde
        'rgba(255, 99, 132, 0.5)', // Rojo
        "rgba(255, 159, 64, 0.5)", // Naranja
      ],
      borderWidth: 0, // apagado
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(25, 25, 25, 1)',
        "rgba(255, 159, 64, 1)",
      ],      
    }]
  });

  const chartData2 = {
    labels: ["Rojo", "Azul", "Amarillo", "Verde", "Púrpura", "Naranja"],
    datasets: [
      {
        label: "Colores",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)", // Rojo
          "rgba(54, 162, 235, 0.2)", // Azul
          "rgba(255, 206, 86, 0.2)", // Amarillo
          "rgba(75, 192, 192, 0.2)", // Verde 
          "rgba(153, 102, 255, 0.2)", // Purple
          "rgba(255, 159, 64, 0.2)", // Naranja
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      {/* <h2>Gestion de Proyectos</h2> */}
      <div className="chart-container">
        <Chart
          type="pie"
          data={chartData}
          options={{
            // Opciones de configuración de la gráfica
          }}
        />
      </div> 
    </div>
  );
}

export default PieChart;