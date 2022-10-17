import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Stack } from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import {faG} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SigninPage({ show, setShow,page }) {
    const navigate = useNavigate()
    const handleClose = () => setShow(false);
    const goToLogin = () => navigate("/login")
    
    const goToRegister = () => navigate("/register")
    
    return (
        <>{
            page==='register'?
            <>
            <Modal show={show} onHide={handleClose} centered>
            <Modal.Header >
                <Modal.Title>Create an Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack direction="vertical" gap={4}>
                   <Button variant="light"  className="modal-buttons"><FontAwesomeIcon icon={faG}/>  Sign up with gmail</Button>
                   <Button variant="light" onClick={goToRegister} className="modal-buttons"><i className="fa fa-sharp fa-solid fa-envelope"></i>  Sign up with email</Button>
                </Stack>
                    
            </Modal.Body>
            
        </Modal>
            </>
            :
            <>
            <Modal show={show} onHide={handleClose} centered>
            <Modal.Header >
                <Modal.Title>Welcome back!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack direction="vertical" gap={4}>
                    <Button variant="light" className="modal-buttons"><FontAwesomeIcon icon={faG}/>  Sign in with gmail</Button>
                    <Button variant="light" onClick={goToLogin} className="modal-buttons"><i className="fa fa-sharp fa-solid fa-envelope"></i>  Sign in with email</Button>
                </Stack>
            </Modal.Body>
        </Modal>
            </>
        }
        
        </>

    );
}