import "./PieChart.css"
import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);


const PieChart = ({labels,datos}) => {  

  // console.log('pie chart: ',datos);
  // console.log('vec', [15, 10, 5, 55, 10])

  const data = {    
    labels: labels, //['Solicitado','En Revisión', 'En Corrección', 'Aprobado', 'Rechazado', 'Descartados'],
    datasets: [{
      label: 'PieChart',
      data: datos, // [ 10,  55, 5, 10, 15,],
      backgroundColor: [        
        'rgba(54, 162, 235, 0.5)', // Azul
        "rgba(153, 102, 255, 0.5)", // Purple
        "rgba(255, 159, 64, 0.5)", // Naranja             
        'rgba(54, 192, 54, 0.5)', // Verde   
        'rgba(255, 99, 132, 0.5)', // Rojo        
        "rgba(255, 206, 86, 0.5)", // Amarillo
      ],
      borderWidth: 1, // apagado
      borderColor: [
        'rgba(54, 162, 235, 1)', // Azul
        "rgba(153, 102, 255, 1)", // Purple
        "rgba(255, 159, 64, 1)", // Naranja             
        'rgba(54, 192, 54, 1)', // Verde   
        'rgba(255, 99, 132, 1)', // Rojo        
        "rgba(255, 206, 86, 1)", // Amarillo
      ],      
    }]
  }

  const options = {
    plugins: {
      legend: {
        position: "right", // Coloca las etiquetas debajo de la gráfica
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    // datalabels: {
    //   color: 'black',
    //   align: 'end',
    //   anchor: 'end',
    //   offset: 10
    // }
  };

  return (
    <div>
      {/* <h2>Gestion de Proyectos</h2> */}
      <div className="chart-container">
        <Chart
          type="pie"
          data={data}
          options={options}
        />
      </div> 
    </div>
  );
}

export default PieChart;