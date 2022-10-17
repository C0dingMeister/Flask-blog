import React, { useRef, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import HomeNavBar from '../HomeNavBar'
import InputField from '../InputField'
import DashBoard from './DashBoard'

function AdminPage() {
    const [formErrors, setFormErrors] = useState({})
    const [loggedIn, setLoggedIn] = useState(false)
    const usernameField = useRef();
    const passwordField =useRef();

    const onSubmit = async(event)=>{
        event.preventDefault();
        const username = usernameField.current.value;
        const password = passwordField.current.value;
        const errors = {};
        if (!username) {
            errors.username = "Username must not be empty";
        }
        if(!password){
            errors.password = "Password must not be empty";
        }
        setFormErrors(errors)
        if (Object.keys(errors).length > 0) {
            return;
        }
        else{
            let data = {
                username: username,
                password: password
            }
            const response = await fetch(process.env.API_URL+"/api/auth/admin_login",{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            if(!response.ok){
                const error = await response.json();
                setFormErrors(error)
            }
            else{
                setFormErrors({})
                const result = await response.json();
                setLoggedIn(true)
            }
        }
        
    }
  return (
    <>
        {loggedIn ? <DashBoard setLoggedIn={setLoggedIn}/> :
            <> 
                <HomeNavBar/>
                <Container className="Loginform">
                    <legend>Admin page</legend>
                    <hr />
                    <Form.Text className="text-danger">{formErrors.error}</Form.Text>
                        <Form onSubmit={onSubmit}>
                            <InputField 
                            name="username" label="Name"
                            fieldRef={usernameField}/>
                            <InputField 
                            name="password" label="Password" type="password"  
                            fieldRef={passwordField}/>
                            <Button variant="primary" type="submit">Login</Button>
                        </Form>
                </Container>
            </>
        }
    </>
  )
}

export default AdminPage