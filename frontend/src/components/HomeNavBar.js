import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container'
import { Button} from 'react-bootstrap';
import SigninPage from './pages/SigninPage';
import { NavLink, useNavigate } from 'react-router-dom';
import FlashMessage from './FlashMessage';
export default function HomeNavBar() {
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [page, setPage] = useState()

    const handleShow = (element) => {
        // console.log(element.target.name)
        navigate(`/${element.target.name}`)
        // setPage(element.target.name)
        // setShow(true)
    }
    const changeNavbarColor = () => {
        const Header = document.querySelector('.Header');
        try {
            if (window.scrollY > 10) {
                Header.style.backgroundColor = '#FECD70';
            }
            else {
                Header.style.backgroundColor = '#FEF8F9';
            }
        } catch (error) {

        }

    };
  
    window.addEventListener('scroll', changeNavbarColor);
    return (
        <>
        {show && <SigninPage show={show} setShow={setShow} page={page} />}
        <Navbar className='Header' fixed='top'>
            <Container>
                <Navbar.Brand as={NavLink} to={"/"} className="brand-name"><img src='logo(256x256).ico' height={"30px"} width={"30px"}/> Microblog</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Button className='get-started-button NavBtn ' variant='dark' name="register" onClick={(element) => handleShow(element)}>Get started</Button>
                    <Button className='signin-button NavBtn' variant='outline-dark' name='login' onClick={(element) => handleShow(element)}>Sign In!</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <FlashMessage/>
        </>
    );
}