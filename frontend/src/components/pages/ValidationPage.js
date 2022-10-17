import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useFlash } from '../context/FlashProvider'

function ValidationPage() {
    const {id} = useParams()
    const navigate = useNavigate()
    const flash = useFlash()
    const [loading, setLoading] = useState(false)
    useEffect(()=>{
        (async()=>{
            setLoading(true)
            if(id.length !== 32){
                navigate('/')
                return
            }
            let data = {
                id:id
            }
            const response = await fetch(process.env.API_URL+'/api/validid',{
                method:'POST',
                headers:{
                    'Content-Type':"application/json"
                },
                body: JSON.stringify(data)
            })
            const result = await response.json()
            if(result.message !== 'valid'){
                navigate('/')
                return
            }
            setLoading(false)
        })()
    },[id])
    const handleClick = async()=>{
        setLoading(true)
        let data = {
            id: id
        }
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(process.env.API_URL+'/api/auth/validate',options)
        if(response.ok){
            const result = await response.json()
            if(result.message==='success'){
                flash("Your email has been verified and registered successfully!","success")
                navigate('/login')
            }
            else{
                flash("The validation link has expired. Please register again!")
                navigate('/register')
            }
        }
        setLoading(false)
    }
  return (
    <>
        {loading ? <Spinner className="center-page" animation='border'/> 

        :

        <Container>
            <h3>Click the button below to activate your account</h3>
            <Button variant='primary' onClick={handleClick}>Activate</Button>
        </Container>    
        }
    </>
  )
}

export default ValidationPage