import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons'
import { faBookmark as fasBookmark } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farHeart, faComment } from '@fortawesome/free-regular-svg-icons'
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import HomeNavBar from "../HomeNavBar";
import UserNavBar from "../UserNavBar";
import AuthorBar from "../AuthorBar";
import AuthContext, { getUser, getCookie } from "../context/AuthContext";
import { useFlash } from "../context/FlashProvider";
import Comments from "../Comments";



export default function FullPostPage() {
   const { id } = useParams()
   const [post, setPost] = useState({});
   const { auth,setAuth } = useContext(AuthContext)
   const [favorite, setFavorite] = useState(false)
   const [like, setLike] = useState(false)
   const [bounce, setBounce] = useState(false)
   const [bounceLike, setBounceLike] = useState(false)
   const [show,setShow] = useState(false)
   const navigate = useNavigate()
   const location = useLocation()
   const flash = useFlash()
   useEffect(() => {
      (async () => {

         const user = await getUser()
         setAuth(user)
         let data = {
            follower: user
         }
         const response = await fetch(`${process.env.API_URL}/get/${id}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
         })
         if (response.ok) {
            const result = await response.json()

            setPost(result)
            setFavorite(result.favorite)
            setLike(result.liked)
         }

      })()
   }, [])
   const readingTime = (post) => {
      const wordsArray = post.split(" ")
      const length = wordsArray.length
      return Math.ceil(length / 200)
   }

   const handleShow = ()=>{
         setShow(true)
      }
   const handleLike = async()=>{
      const user = await getUser()
      if (!user) {
         navigate('/login', { state: { from: location }, replace: true })
         return
      }
      let data = {
         post: post.id
      }
      const response = await fetch(process.env.API_URL + '/api/like', {
         method: 'POST',
         headers: {
            'X-CSRF-TOKEN': getCookie('csrf_access_token'),
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data),
         credentials: 'include'
      })
      if (response.ok) {
         const result = await response.json()
         if (result.msg === 'liked') {
            setLike(true)
         } else {
            setLike(false)
         }
      
         setLike(!like)
         setBounceLike(true)
         const interval = setInterval(() => {
            setBounceLike(false)
            clearInterval(interval)
         }, 1000);
      }
         
   }
   const handleFavorite = async () => {
      const user = await getUser()
      if (!user) {
         navigate('/login', { state: { from: location }, replace: true })
         return
      }
      let data = {
         post: post.id
      }
      const response = await fetch(process.env.API_URL + '/api/favorite', {
         method: 'POST',
         headers: {
            'X-CSRF-TOKEN': getCookie('csrf_access_token'),
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data),
         credentials: 'include'
      })
      if (response.ok) {
         const result = await response.json()
         if (result.message.startsWith("Added")) {
            setFavorite(true)
            
            flash(result.message, "success")
         } else {
            setFavorite(false)

            flash(result.message, "dark")
         }
         let interval = setTimeout(() => {
            setBounce(false)
            clearInterval(interval)
         }, 1000);
         setBounce(true)
      }

      // setFavorite(!favorite)
      // setTimeout(() => {
      //       setBounce(false)
      // }, 1000);
      // setBounce(true)

   }
   return (
      <>
         {auth ? <UserNavBar /> :
            <HomeNavBar />}
         <Container className="PostPageDiv">
         {show && <Comments show={show} setShow={setShow} id={id}/>}
            <Row>
               {post.article_body === undefined || post.article_body === null ? <Spinner animation="border" /> :
                  <>
                     <Col lg={9} className="AuthorTopBarCol">
                        <AuthorBar sidebar={false} username={post.username} date={post.date}
                           readTime={readingTime(post.article_body) > 1 ? String(readingTime(post.article_body)) + " mins read" : "1 min read"}
                           tag={post.tag} picture={post.picture} following={post.following}
                           subscribed={post.subscribed} />
                        <div className="PostPageBody">
                           <div className="d-flex" style={{ maxWidth: "", margin: "auto" }}>
                              <Button variant="light" className="favorite-button ">
                                 <FontAwesomeIcon title={favorite ? "Remove from Favorites" : "Add to favorites"}
                                    onClick={handleFavorite} icon={favorite ? fasBookmark : farBookmark}
                                    bounce={bounce ? true : false} size="2x" />
                              </Button>
                              <h1 className="flex-grow-1">{post.article_title} </h1>
                           </div>

                           <hr />
                           <Container>
                              <h4 >
                                 {post.article_body}
                              </h4>
                           </Container>
                           <hr />
                           <div className="like-section">
                              <em>If you enjoyed reading this post make sure to <FontAwesomeIcon icon={fasHeart} color={"red"} /> this post and leave a comment</em>
                           </div>
                           <hr />
                           <div className="post-end-section">
                              <big onClick={handleLike}><FontAwesomeIcon icon={like ? fasHeart : farHeart}
                               bounce={bounceLike ? true : false}  color={"red"}/> Like</big>
                              <big onClick={handleShow}><FontAwesomeIcon icon={faComment}/> Comment</big>
                              
                           </div>
                        </div>

                     </Col>
                     <Col lg={3} className="AuthorSideBarCol">
                        <AuthorBar sidebar={true} username={post.username} readTime={readingTime(post.article_body) > 1 ? String(readingTime(post.article_body)) + " mins read" : "1 min read"}
                           date={post.date} tag={post.tag} picture={post.picture}
                           following={post.following} subscribed={post.subscribed}
                        />
                     </Col>
                  </>
               }
            </Row>

         </Container>
      </>
   );
}