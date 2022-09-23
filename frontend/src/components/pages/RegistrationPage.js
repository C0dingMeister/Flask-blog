import React, { useState,useEffect,useRef } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import InputField from "../InputField";
export default function RegisterationPage() {
    const [formErrors, setFormErrors] = useState({})
    const usernameField = useRef();
    const emailField = useRef();
    const passwordField = useRef();
    const confrimPasswordField = useRef();
    const navigate = useNavigate()
    useEffect(()=>{
        usernameField.current.focus()
    })
    const onSubmit = async (event) => {
        event.preventDefault();
        if(passwordField.current.value !== confrimPasswordField.current.value){
            setFormErrors({confirmPassword: "Passwords don't match"})
        }
        else{
            let data = {
                username: usernameField.current.value,
                email: emailField.current.value,
                password: passwordField.current.value
            }
            const response = await fetch(window.location.origin+"/api/registeration",{
                method: "POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json()
            if(result.errors){
                setFormErrors(result.errors)
            }
            else{
                setFormErrors({})
                navigate('/login')
            }
        }
    }
    return(
            <>
            <Container className="Loginform">
            
            <legend>Become a writer today!</legend>
                <hr />
                <Form.Text className="text-danger">{formErrors.error}</Form.Text>
                <Form onSubmit={onSubmit}>
                    <InputField 
                    name={"username"} label={"Username"} 
                    error={formErrors.username} fieldRef={usernameField} />
                    <InputField 
                    name={"email"} label={"Email address"} 
                    error={formErrors.email} fieldRef={emailField} />
                    <InputField 
                    name={"password"} label={"Password"} type="password"
                    error={formErrors.password} fieldRef={passwordField} />
                    <InputField 
                    name={"confirmPassword"} label={"Confirm Password"} type="password"
                    error={formErrors.confirmPassword} fieldRef={confrimPasswordField} />
                    <Button variant="primary" type="submit">Register</Button>
                </Form>
                </Container>
            </>
    );
}