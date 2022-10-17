import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { getUser, getCookie, logout } from "../context/AuthContext";
import { useFlash } from "../context/FlashProvider";

export default function EditPostPage({ show, setShow, title ,content, id }) {
    const navigate = useNavigate()
    const handleClose = () => setShow(false);
    const flash = useFlash()
    const handleEdit = async ()=>{
        const user = await getUser()
        if(user){

            const title = document.getElementById('title')
            const content = document.getElementById('content')
    
            let data = {
                title:title.value,
                content: content.value
            }
            let options = {
                method: "PUT",
                headers:{
                    "Content-Type":"application/json",
                    'X-CSRF-TOKEN': getCookie('csrf_access_token'),
                },
                credentials: 'include',
                body: JSON.stringify(data)
            }
    
            const response = await fetch(`${process.env.API_URL}/api/update/${id}`,options)
    
            if(response.ok){
                const result = await response.json()
                navigate('/user')
            }else{
                navigate('/')
            }
            setShow(false)
        }
        
        else{
            await logout()
            navigate('/')
            flash("Loggin session expired. Please login again!")
        }
        
        
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} scrollable>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Form>
                        <Form.Group className="mb-3 " controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                
                                type="text"
                                defaultValue={title}
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3 "
                            controlId="content"
                        >
                            <Form.Label>Content</Form.Label>
                            <Form.Control as="textarea"  defaultValue={content} rows={6} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

