import "./NavBar.css"

import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import {NavLink, LinkContainer , Link} from "react-router-dom";

const NavBar = ( {backend}) => {
    const {isAuthenticated, user} = useAuth();    
    const [roles, setRoles] = useState([])
    const [rol,setRol] = useState('')
    
    const getRoles = async () => {
        const response = await fetch(backend+"/api/qa/roles");
        //console.log(response);
        const data = await response.json();
        //console.log("getRoles:",data)
        await setRoles(data)           
        return data
    }

    const load = async (rol_id) => {
      const res = await getRoles()
      // console.log("roles:",res)
      // console.log("user.rol_id:",rol_id)
      
      const name = await res.filter( rol=> rol.Rol_Id === rol_id )[0].Rol_name
      // console.log("name:",name)

       setRol( name )
      
      await setRoles(res)
    }

    useEffect(() => {
      const data = localStorage.getItem('user');
      if (data) {
        const obj = JSON.parse(data)
        // console.log('Navbar: ',obj)
        load(obj.rol_id) // necesario para cargar roles
      }
      
    }, [user]);

    return(
        <Navbar bg="primary" variant="dark1" expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            Software QA
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {isAuthenticated ? (
                <>                  
                  <Nav.Link as={NavLink} to="/gestion">Gestiones</Nav.Link>
                  <Nav.Link as={NavLink} to="/proyecto">Proyecto</Nav.Link>                  
                  <Nav.Link as={NavLink} to="/revision">Revisión</Nav.Link>

                  <Nav.Link as={NavLink} to="/users">Usuarios</Nav.Link>
                  <Nav.Link as={NavLink} to="/checklist">CheckList</Nav.Link>
                  
                  <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
                </>
              ) : (
                <>                  
                  <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                  {/* <Nav.Link as={NavLink} to="/task">Task</Nav.Link> */}
                </>
              )}              
            </Nav>
            {isAuthenticated ? (
            <Nav className="ms-auto">
              
              <Navbar.Text className="ms-auto" style={{marginLeft:"250px"}}>
                {user.fullname} &nbsp; / &nbsp; {rol} 
              </Navbar.Text> 
             
              <Nav.Link as={NavLink} style={{marginLeft:"100px"}} className="me-auto" to="/logout">Logout</Nav.Link>                  
            </Nav>) : (<></>)
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}

export default NavBar;