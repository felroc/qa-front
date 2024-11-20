// Modulos
import React from 'react';
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';

// Componentes
//import App from './App'; //import reportWebVitals from './reportWebVitals';
import NavBar from './components/NavBar';
import Welcome from './components/Welcome';
import GestionForm from './components/gestion/GestionForm';
import GestionList from './components/gestion/GestionList';
import Revision from './components/revision/Revision';
import LoginForm from './components/Login/LoginForm';
import UserList from './components/user/UserList';
import TaskTable from './components/task/TaskTable';
import UserForm from './components/user/UserForm'; 
import Dashboard from './components/dashboard/dashboard';
import LogOut from './components/Login/Logout';
import CheckList from './components/CheckList/CheckList'

const frontend = "localhost:3000"; // URL del fronted
const backend = "http://localhost:8081"; // URL del backend

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    {/* <React.StrictMode > */}      
      <div className='container my-3'>
        <AuthProvider>
          <NavBar backend={backend} ></NavBar>
          <Routes>
            
            <Route path='/' element={<Welcome></Welcome>}></Route>
            <Route path='/login' element={<LoginForm frontend={frontend} backend={backend}></LoginForm>}></Route>

            <Route path='/dashboard' element={
               <ProtectedRoute>
                <Dashboard frontend={frontend} backend={backend}></Dashboard>
              </ProtectedRoute>
              }>
            </Route>          

            <Route path='/proyecto' element={
              <ProtectedRoute>
                <GestionForm frontend={frontend} backend={backend}/>
              </ProtectedRoute>
              }>
            </Route>
            <Route path='/proyecto/:proy_id' element={
              <ProtectedRoute>
                <GestionForm frontend={frontend} backend={backend}/>
              </ProtectedRoute>
              }>
            </Route>

            <Route path='/gestion' element={
              <ProtectedRoute>
                <GestionList frontend={frontend} backend={backend}/>
              </ProtectedRoute>
              }>                
            </Route>
          
            <Route path='/revision' element={
              <ProtectedRoute>
                <Revision backend={backend}/>
              </ProtectedRoute>
              }>                
            </Route>

            <Route path='/revision/:proy_id' element={
              <ProtectedRoute>
                <Revision backend={backend}/>
              </ProtectedRoute>
              }>                
            </Route>

            <Route path='/users' element={
              <ProtectedRoute>
                <UserList frontend={frontend} backend={backend}></UserList>
              </ProtectedRoute>
              }>                
            </Route>

            <Route path='/users/new' element={
              <ProtectedRoute>
                <UserForm frontend={frontend} backend={backend}></UserForm>
              </ProtectedRoute>
              }>                
            </Route>

            <Route path='/users/view/:username' element={
              <ProtectedRoute>
                <UserForm frontend={frontend} backend={backend}></UserForm>
              </ProtectedRoute>
              }>                
            </Route>

            <Route path='/users/edit/:username' element={
              <ProtectedRoute>
                <UserForm frontend={frontend} backend={backend}></UserForm>
              </ProtectedRoute>
              }>                
            </Route> 
            <Route path='/checklist' element={
              <ProtectedRoute>
                <CheckList frontend={frontend} backend={backend}></CheckList>
              </ProtectedRoute>
            }></Route>

            {/* <Route path='/task' element={<TaskTable></TaskTable>}></Route> */}
            <Route path='/logout' element={<LogOut></LogOut>}></Route>
            <Route path='*' element={<h1>Página no encontrada 404.</h1>}></Route>

          </Routes>
        </AuthProvider>
{/* >>>>>>> 22c2ab1c7e5d5ff7da4a6e362d76c3f436ef6c18 */}
      </div>
    {/* </React.StrictMode> */}
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

