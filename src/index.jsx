import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';

// Componentes
import App from './App'; //import reportWebVitals from './reportWebVitals';
import NavBar from './components/NavBar';
import Welcome from './components/Welcome';
import TaskTable from './task/TaskTable';
import GestionForm from './components/gestion/GestionForm';
import GestionList from './components/gestion/GestionList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <NavBar></NavBar>
      <div className='container my-3'>
        <Routes>
          <Route path='/' element={<GestionList/>}></Route>
          <Route path='/dashboard' element={<h1>Dashboard</h1>}></Route>
          <Route path='/gestion' element={<GestionForm></GestionForm>}></Route>
          <Route path='/etapa' element={<h1>Etapas</h1>}></Route>
          <Route path='/revision' element={<h1>Revisión</h1>}></Route>
          <Route path='*' element={<h1>Página no encontrada 404.</h1>}></Route>
        </Routes>        
      </div>
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
