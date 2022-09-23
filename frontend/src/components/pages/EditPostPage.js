import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';

export default function EditPostPage({ show, setShow, title ,content, id }) {
    const navigate = useNavigate()
    const handleClose = () => setShow(false);

    const handleEdit = async ()=>{
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
                "Authorization":"Bearer "+localStorage.getItem("access_token")
            },
            body: JSON.stringify(data)
        }

        const response = await fetch(`${window.location.origin}/api/update/${id}`,options)

        if(response.ok){
            const result = await response.json()
            navigate('/user')
        }else{
            navigate('/')
        }
        setShow(false)
        
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

