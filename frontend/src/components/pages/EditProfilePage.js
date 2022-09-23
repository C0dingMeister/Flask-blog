import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';


export default function EditProfilePage({ show, setShow, page, about_me }) {
    const [error, setError] = useState()
    const navigate = useNavigate()
    const handleClose = () => setShow(false);
    const handleAboutMe = async()=>{
        const text = document.querySelector('textarea')
        // console.log(text.value.trim().replace(/\s+/g, " "))
        let data = {
            about_me: text.value.trim().replace(/\s+/g, " ")
        }
        let options = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            },
        }
        const response = await fetch(window.location.origin+"/api/aboutme",options)
        if(response.ok){
            const result = await response.json()
            // console.log(result)
        }
        navigate('/user')
        setShow(false)
    }
    const handleClick = (e) => {
        const formData = new FormData();
        let input = document.querySelector('input[type="file"]')

        formData.append('avatar', input.files[0]);
        let file = input.files[0]
        // console.log(file)
        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            setError("You can only upload PNG and JPG images")
            e.target.value = null
            // console.log("upload png and jpg only")
        }
        else if (file.size > 2000000) {
            setError("Image should be under 2 MB in size")
            e.target.value = null
            // console.log("too heavy file")
        }
        else {
            // console.log("correct")
            setError(null)

            const uploadPic = async () => {
                let options = {
                    method: "PUT",
                    body: formData,
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    },
                }
                const response = await fetch(window.location.origin+"/api/setdp", options)
                if (response.ok) {
                    const result = await response.json()
                    // console.log(result)
                }
                setShow(false)
                navigate('/user')
            }
            uploadPic()
        }

        e.target.value = null

    }
    return (
        <>
            {page === 'upload' ?
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header >
                        <Modal.Title>Upload New Profile Picture (Only PNG and JPG supported)</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Click to Upload</Form.Label>
                            <Form.Control type="file" onChange={(e) => handleClick(e)} />
                            <Form.Text className="text-danger">{error}</Form.Text>
                        </Form.Group>

                    </Modal.Body>

                </Modal>
                :
                <Modal show={show} onHide={handleClose} centered>

                    <Modal.Body>
                        <Form.Group
                            className="mb-3"
                        ><Modal.Header >
                        <Modal.Title>About Me</Modal.Title>
                    </Modal.Header>
                            <Form.Control as="textarea" rows={3} defaultValue={about_me} />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleAboutMe}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal.Body>

                </Modal>
            }

        </>
    );
}