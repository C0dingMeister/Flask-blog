import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link,NavLink, useNavigate } from "react-router-dom";

export default function UserNavBar({userLoggedIn ,setUserLoggedIn }) {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUserLoggedIn(null)
    navigate("/")
  }
 
  return (
    <>
      <Navbar bg="light" sticky="top" expand="md" className="mb-3 UserNavBar" collapseOnSelect={false}>
        <Container fluid>
          <Navbar.Brand as={NavLink} to={"/user"} className="brand-name" ><img src='http://localhost:3000/logo(256x256).ico' height={"30px"} width={"30px"}/> Microblog</Navbar.Brand>
      
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title style={{ marginLeft: "8px" }} id={`offcanvasNavbarLabel-expand-lg`}>
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Link className="offcanvasLinks" to="/user">Home</Link>
                <Link className="offcanvasLinks" to={`/profile/${userLoggedIn}`}>My Profile</Link>
                <Link className="offcanvasLinks" to="/create_blog">Write a Blog</Link>
                <div className="logout-button" onClick={logout}>Logout</div>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}