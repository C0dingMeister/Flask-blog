import React, { useContext, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import AllPosts from '../AllPosts'
import AuthContext from '../context/AuthContext'
import HomeNavBar from '../HomeNavBar'
import UserNavBar from '../UserNavBar'

function TagPage() {
    const {tag} = useParams()
    const {auth} = useContext(AuthContext)
    
  return (
    <>
    {auth ? <UserNavBar /> :
            <HomeNavBar />}
    <Container className='tag-container'>   
      <h1>{tag} page</h1>
      <AllPosts url={`/api/tag/${tag}`}/>
    </Container>
    </>
  )
}

export default TagPage