import React, { useEffect, useRef,useState } from "react";
import { Form, Button,Container } from "react-bootstrap";
import InputField from "../InputField";
import { Link,useNavigate } from "react-router-dom";

export default function LoginPage({ setUserLoggedIn }) {
    const [formErrors, setFormErrors] = useState({})
    const emailField = useRef();
    const passwordField =useRef();
    const navigate = useNavigate()
    useEffect(() => {
        emailField.current.focus();
    },[]);

    const onSubmit = async (event) =>{
        event.preventDefault();
        const email = emailField.current.value;
        const password = passwordField.current.value;

        const errors = {};
        if (!email) {
            errors.email = "Email must not be empty";
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
                email: email,
                password: password
            }
            const response = await fetch("http://localhost:5000/api/login",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
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
                localStorage.setItem("access_token",result.access_token)
                localStorage.setItem("refresh_token",result.refresh_token)
                setUserLoggedIn(true)
                navigate("/user")
            }
        }
    }
    return (
       <>  
        <Container className="Loginform">
            <legend>Log in!</legend>
            <hr />
            <Form.Text className="text-danger">{formErrors.error}</Form.Text>
                <Form onSubmit={onSubmit}>
                    <InputField 
                    name="email" label=" Email address"
                    error={formErrors.email} fieldRef={emailField}/>
                    <InputField 
                    name="password" label="Password" type="password"  
                    error={formErrors.password} fieldRef={passwordField}/>
                    <Button variant="primary" type="submit">Login</Button>
                </Form>
            <hr />
            <p>Don't have an account? <Link to={"/register"}>Register here</Link></p>
        </Container>
            
            
            
        </>
    );
}