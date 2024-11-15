
import React from "react";
import { useAuth } from "../AuthContext";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import {NavLink, LinkContainer , Link} from "react-router-dom";


const NavBar = () => {
    const {isAuthenticated, user} = useAuth();    

    return(
        <Navbar bg="primary" variant="dark" expand="lg">
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
                  <Nav.Link as={NavLink} to="/proyecto">Proyecto</Nav.Link>
                  <Nav.Link as={NavLink} to="/gestion">Gestiones</Nav.Link>
                  
                  <Nav.Link as={NavLink} to="/users">Usuarios</Nav.Link>
                  <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                  <Navbar.Text className="ms-auto">
                    {user.fullname} - {user.rol_id}
                  </Navbar.Text> 
                </>
              ) : (
                <>
                <Nav.Link as={NavLink} to="/revision">Revisión</Nav.Link>
                  <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                  {/* <Nav.Link as={NavLink} to="/task">Task</Nav.Link> */}
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}

export default NavBar;