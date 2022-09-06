import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'

function Login(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({  
        emailError:null,
        passwordError:null,
        defaultError:null
        })
    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === "email") {
            setEmail(value);
        }
        if (id === "password") {
            setPassword(value);
        }

    }
    const validateForm = ()=>{
        
        
        let emailError = "";
        let passwordError = "";

      
 
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!email || reg.test(email) === false){
            emailError = "Email Field is Invalid ";
        }
 
        if(!password){
            passwordError = "Password field is required";
        }
        
        if(emailError || passwordError ){
            setErrors({passwordError,emailError});
            
            return false;
        }
        
        console.log("success")

        submitForm()
    }

    const submitForm = () => {
        let data = {
            email: email,
            password: password,
        }
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
        // console.log(email, password)

        fetch("http://localhost:5000/login", options)
            .then((resp) => {
                if (resp.status === 200) {
                    return resp.json()
                }
            })
            .then((data) => {
                if (data.message === 'success') {
                    // console.log(data)
                    props.setUser(data.user)
                    props.setDp(data.dp)
                    localStorage.setItem("token",data.token)
                    
                    navigate('/')
                    // console.log(data.token)
                }
                else {
                    setErrors({defaultError:data.message})
                }
            })
            .catch((err) => { console.log(err) })
    }


    return (
        <>
        
            <div className="container form-container my-5">
                <h1 style={{textAlign:"center"}}>Login!</h1>
                <div className="inner">
                <span className="text-danger">{errors.defaultError}</span>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" onChange={(e) => handleChange(e)} placeholder="email" />
                        <span className="text-danger">{errors.emailError}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passsword" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" onChange={(e) => handleChange(e)} placeholder="password" />
                        <span className="text-danger">{errors.passwordError}</span>
                    </div>
                    <button className='btn btn-outline-info' onClick={validateForm}>Log in!</button>

                </div>

            </div>
        </>
    )
}

export default Login