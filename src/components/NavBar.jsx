import "./NavBar.css"

import React, { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import {NavLink, LinkContainer , Link} from "react-router-dom";

const NavBar = () => {
    const {isAuthenticated, user} = useAuth();    
    const roles = [{rol_id:1,rol:'PO'},{rol_id:1,rol:'DEV'},{rol_id:1,rol:'QA'}]

    useEffect(() => {
      const data = localStorage.getItem('user');
      if (data) {
        //console.log('Navbar: ',data)
      }
    }, []);

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
              
              <Navbar.Text className="ms-auto" style={{marginLeft:"250px"}}>Usuario: {user.fullname} </Navbar.Text> 
              {/* Rol: {roles[user.rol_id-1].rol}  */}
              <Nav.Link as={NavLink} style={{marginLeft:"100px"}} className="me-auto" to="/logout">Logout</Nav.Link>                  
            </Nav>) : (<></>)
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}

export default NavBar;