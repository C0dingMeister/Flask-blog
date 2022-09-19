import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row, Spinner, Stack } from "react-bootstrap";
import { useParams } from "react-router-dom";
import HomeNavBar from "../HomeNavBar";
import UserNavBar from "../UserNavBar";
import AuthorBar from "../AuthorBar";


export default function FullPostPage({ userLoggedIn, setUserLoggedIn }) {
   const { id } = useParams()
   const [post, setPost] = useState({});
   useEffect(() => {
      (async () => {

         console.log(id)
        let data = {
         follower: userLoggedIn
         }
         const response = await fetch(`http://localhost:5000/get/${id}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
         })
         if (response.ok) {
            const result = await response.json()
            
            setPost(result)
         }
      
      })()
   }, [])

   return (
      <>
         {userLoggedIn ? <UserNavBar userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} /> :
            <HomeNavBar />}
         <Container className="PostPageDiv">
            <Row>
               <Col lg={9} className="AuthorTopBarCol">

                  {post === undefined || post === null ? <Spinner animation="border" /> :
                     <>
                        <AuthorBar sidebar={false} username={post.username} date={post.date} tag={post.tag} picture={post.picture} following={post.following} userLoggedIn={userLoggedIn}/>
                        <div className="PostPageBody">
                           <h1 className="display-2">{post.article_title}</h1>
                           <hr />
                           <Container>
                              <h4 className="display-5">
                                 {post.article_body}
                              </h4>
                           </Container>
                           <hr />
                        </div>

                     </>
                  }

               </Col>
               <Col lg={3} className="AuthorSideBarCol">
                  <AuthorBar sidebar={true} username={post.username} date={post.date} tag={post.tag} picture={post.picture} following={post.following} userLoggedIn={userLoggedIn} />
               </Col>
            </Row>
         </Container>
      </>
   );
}