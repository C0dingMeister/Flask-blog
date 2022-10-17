import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { Container, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function ActivationPage() {
  return (
    <Container className='activation-page'>
        
            <p>We have sent an activation link to the email you provided. Click that link to activate your account. It's only valid for 30 minutes.</p>
            <FontAwesomeIcon icon={faCircleCheck} className='check-circle' color='green'/>
            <Stack direction='horizontal' className='justify-content-between'>
                <Link to={'/login'}>Go to login page</Link>
                <Link to={'/'}>Go to Home page</Link>
            </Stack>
        
    </Container>
  )
}

export default ActivationPage