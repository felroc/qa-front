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
      borderWidth: 1, 
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
      // datalabels: {
      //   formatter: (value, context) => {
      //     const dataset = context.dataset;
      //     const total = dataset.data.reduce((acc, val) => acc + val, 0);
      //     const percentage = Math.round((value / total) * 100) + '%';
      //     return percentage;
      //   },
      //   // color: 'white',
      // },
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
    
    // className="chart-container"
      <div style={{marginLeft:"50px",width:"800px",height:"500px"}} >
        <Chart
          type="pie"
          data={data}
          options={options}
        />
        <br></br>
        <p>Indicador de porcentaje de los desarrollos de software </p>        
      </div> 
    
  );
}

export default PieChart;