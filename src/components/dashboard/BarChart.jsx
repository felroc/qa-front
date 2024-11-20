import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({labels,datos}) => {
  
  const data = {
    labels: labels,// ["En proceso", "Completados", "Rechazados", "Descartados"],
    datasets: [
      {
        label: "",
        data:  datos, // [30, 55, 15, 5],
        backgroundColor: //"rgba(75, 192, 192, 0.6)",
        [          
        'rgba(54, 162, 235, 0.5)', // Azul
        "rgba(153, 102, 255, 0.5)", // Purple
        "rgba(255, 159, 64, 0.5)", // Naranja             
        'rgba(54, 192, 54, 0.5)', // Verde   
        'rgba(255, 99, 132, 0.5)', // Rojo        
        "rgba(255, 206, 86, 0.5)", // Amarillo
        ],
        borderWidth: 1,
        borderColor: //"rgba(75, 192, 192, 1)",
        [          
         'rgba(54, 162, 235, 0.5)', // Azul
        'rgba(54, 192, 54, 0.5)', // Verde
        'rgba(255, 99, 132, 0.5)', // Rojo
        "rgba(255, 159, 64, 0.5)", // Naranja
        "rgba(153, 102, 255, 0.5)", // Purple
        "rgba(255, 206, 86, 0.5)", // Amarillo
        ],
        
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false
      },
      title: {
        display: true,
        text: "Cantidad de Proyectos por Estado",
      },
    },
  };

  return (
    // style={{ width: "100%", margin: "0 auto" }}
    <div style={{ width: "800px",height:"450px", margin: "50px" }}>

      <Bar data={data} options={options} />

      <br></br>
      <p>Indicador cuantitatvo de los desarrollo de software en cada estado</p>
    </div>    
  );
    
  }

  export default BarChart;