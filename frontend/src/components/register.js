import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({
    nameError:null,
    emailError:null,
    passwordError:null,
    confirmPasswordError:null
    })
    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === "username") {
            setUserName(value);
        }
        if (id === "email") {
            setEmail(value);
        }
        if (id === "password") {
            setPassword(value);
        }
        if (id === "confirmpassword") {
            setConfirmPassword(value);
        }

    }


    const validateForm = ()=>{
        
        
        let nameError = "";
        let emailError = "";
        let passwordError = "";
        let confirmPasswordError = "";

        if(!userName || userName.length < 6){
            nameError = "Usernames should be atleast 6 characters long!";
        }
 
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!email || reg.test(email) === false){
            emailError = "Email Field is Invalid ";
        }
 
        if(!password){
            passwordError = "Password field is required";
        }
        if(!confirmPassword || confirmPassword !== password){
            confirmPasswordError = "Passwords do not match!"
        }
        if(emailError || nameError || passwordError|| confirmPasswordError){
            setErrors({nameError,emailError,passwordError,confirmPasswordError});
            
            return false;
        }
        
        console.log("success")

        submitForm()
    }

    const submitForm = async () => {
        let data = {
            username: userName,
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
        console.log(userName, email, password)
        setErrors({
            nameError:null,
            emailError:null,
            passwordError:null,
            confirmPasswordError:null
            })  

        await fetch("http://localhost:5000/registeration", options)
            .then((resp) => { return resp.json() })
            .then((data) => {
                
               
                if(data.message.startsWith("R")){
                    navigate('/login')
                    
                }
                else if(data.message.startsWith("E")){
                    console.log(data.message)
                    setErrors({emailError:data.message})
                    
                }
                
                else if(data.message.startsWith("U")){
                    console.log(data.message)
                    setErrors({nameError:data.message})   
                }               
            })
            
            .catch((err) => { console.log(err) })
          
        
    }

    return (
        <>
            <div className="container form-container my-4">
                <h1 style={{textAlign:"center"}}>Register today!</h1>
                <div className="inner">
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" required value={userName} id="username" onChange={(e) => handleChange(e)} placeholder="username" />
                        <span className="text-danger">{errors.nameError}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" required value={email} id="email" onChange={(e) => handleChange(e)} placeholder="email" />
                        <span className="text-danger">{errors.emailError}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" required value={password} id="password" onChange={(e) => handleChange(e)} placeholder="Password" />
                        <span className="text-danger">{errors.passwordError}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmpasssword" className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" required value={confirmPassword} id="confirmpassword" onChange={(e) => handleChange(e)} placeholder="Confirm Password" />
                        <span className="text-danger">{errors.confirmPasswordError}</span>
                    </div>
                    <button className='btn btn-primary' onClick={validateForm}>Submit</button>
                </div>


            </div>
            
        </>
    )
}





export default Register