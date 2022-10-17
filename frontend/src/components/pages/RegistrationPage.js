import React, { useState,useEffect,useRef } from "react";
import { Button, Form, Container, Spinner } from "react-bootstrap";
import { useFlash } from "../context/FlashProvider";
import HomeNavBar from "../HomeNavBar";
import InputField from "../InputField";
import ActivationPage from "./ActivationPage";
export default function RegisterationPage() {
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const usernameField = useRef();
    const emailField = useRef();
    const passwordField = useRef();
    const confrimPasswordField = useRef();
    const flash = useFlash()

    useEffect(()=>{
        if(!loading && !show){
            usernameField.current.focus()
        }
    })
    const onSubmit = async (event) => {
        setLoading(true)
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
            const response = await fetch(process.env.API_URL+"/api/registeration",{
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
                // navigate('/login')
                setShow(true)
                flash("Mail sent successfully!","success")
            }
        }
        setLoading(false)
    }
    return(
            <>  
                {loading ? <Spinner className="center-page" animation="border" />:
                show ? <ActivationPage/> :
                <>  
                    <HomeNavBar/>
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
                }
            </>
    );
}