
import React, { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import {NavLink, LinkContainer , Link} from "react-router-dom";


const NavBar = () => {
    const {isAuthenticated, user} = useAuth();    

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
                  <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={NavLink} to="/users">Usuarios</Nav.Link>
                  <Nav.Link as={NavLink} to="/checklist">CheckList</Nav.Link>
                  <Nav.Link as={NavLink} to="/proyecto">Proyecto</Nav.Link>
                  <Nav.Link as={NavLink} to="/gestion">Gestiones</Nav.Link>
                  <Nav.Link as={NavLink} to="/revision">Revisión</Nav.Link>                  
                </>
              ) : (
                <>
                  {/* <Nav.Link as={NavLink} to="/revision">Revisión</Nav.Link> */}
                  <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                  {/* <Nav.Link as={NavLink} to="/task">Task</Nav.Link> */}
                </>
              )}              
            </Nav>
            {isAuthenticated ? (
            <Nav className="me-auto">
              
              <Navbar.Text className="ms-auto">{user.fullname}</Navbar.Text> 
              <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>                  
            </Nav>) : (<></>)
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}

export default NavBar;