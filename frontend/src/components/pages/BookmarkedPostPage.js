import React from 'react'
import { Container } from "react-bootstrap";
import AllPosts from "../AllPosts";

function BookmarkedPostPage() {
  return (
   <>
        <Container>
            <h1>Favorites</h1>
            <hr />
            <AllPosts url={"/api/getfavorites"} slice={false}/>
        </Container>
   </>
  )
}

export default BookmarkedPostPage