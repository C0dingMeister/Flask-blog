import React, { useEffect, useRef,useState,useContext } from "react";
import { Form, Button,Container, Spinner } from "react-bootstrap";
import InputField from "../InputField";
import { Link,useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useFlash } from "../context/FlashProvider";
import HomeNavBar from "../HomeNavBar";

export default function LoginPage() {
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const emailField = useRef();
    const passwordField =useRef();
    const navigate = useNavigate();
    const { setAuth, setIsAuthenticated } = useContext(AuthContext);
    const flash = useFlash()
    const location = useLocation();
    const from = location.state?.from?.pathname || "/user";
    useEffect(() => {
        emailField.current.focus();
    },[]);

    const onSubmit = async (event) =>{
        setLoading(true)
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
            const response = await fetch(process.env.API_URL+"/api/login_with_cookies",{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                
                body: JSON.stringify(data)
            })

            if(!response.ok){
                const error = await response.json();
                setFormErrors(error)
            }
            else{
                setFormErrors({})
                const result = await response.json();
                setAuth(result.user)
                setIsAuthenticated(true)
                navigate(from, {replace: true})
                flash("Logged in!","success")
            }
        }
        setLoading(false)
    }
    return (
       <> 
            {loading ? <Spinner className="center-page" animation="border"/>:
                <>
                    <HomeNavBar/>
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
            }
       </>
    );
}