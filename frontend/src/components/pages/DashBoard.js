import React from 'react'
import { Button, Container } from 'react-bootstrap'
import { useFlash } from '../context/FlashProvider'

function DashBoard({setLoggedIn}) {
    const flash = useFlash()
    const handleSubmit = async(event)=>{
        const action = event.target.name
        if(action === 'logout'){
            setLoggedIn(false)
            return
        }else{
            let data = {
                model:action
            }
            const response = await fetch(process.env.API_URL+"/api/delete_all",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data)
            })
            if(response.ok){
                const result = await response.json()
                if(result.message==='success'){
                    flash(`All ${action} deleted successfully!`,'success')
                }
                else{
                    flash(result.message)
                }
            }
        }
    }
  return (
    <Container className='admin-page'>
        <h1>Dashboard</h1>
        <main>
            <div>
                <span>Delete User database</span>
                <Button variant='warning' name='user' onClick={handleSubmit}>delete</Button>
            </div>
            <div>
                <span>Delete Blog database</span>
                <Button variant='warning' name='blogs' onClick={handleSubmit}>delete</Button>
            </div>
            <div>
                <span>Delete Followers database</span>
                <Button variant='warning' name='followers' onClick={handleSubmit}>delete</Button>
            </div>
            <div>
                <span>Delete Tokens database</span>
                <Button variant='warning' name='tokens' onClick={handleSubmit}>delete</Button>
            </div>
            <Button variant='danger' name='logout' onClick={handleSubmit}>Logout</Button>
        </main>
    </Container>
  )
}

export default DashBoard