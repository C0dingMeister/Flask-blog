import React, { useEffect, useState } from "react";
import { Container, Image, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import UserNavBar from "../UserNavBar";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import AllPosts from "../AllPosts";
import HomeNavBar from "../HomeNavBar";

export default function ProfilePage({userLoggedIn ,setUserLoggedIn}) {
    const navigate = useNavigate()
    const { username } = useParams();
    const [user,setUser] = useState({});
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        
        (async()=>{
            setLoading(true)
            let data = {
                username: username,
                follower:userLoggedIn
            }
            const response = await fetch("http://localhost:5000/api/getauthor",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            })
            if(response.ok){
                const result = await response.json();
                console.log(result)
                setUser(result)
            }
        })()
        setLoading(false)
    },[])

    const follow = ()=>{
        const button = document.getElementById('follow-btn')
        if(!userLoggedIn){
          navigate('/login')
        }
        else{
            (async()=>{
                let data = {
                    follower:userLoggedIn,
                    following:username,
                    }
                let options = {
                    method:'PUT',
                    headers: {
                    "Authorization": "Bearer "+localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                            },
                    body: JSON.stringify(data),
                }
                
                const response = await fetch("http://localhost:5000/api/follow",options)
                if(response.ok){
                    const result = await response.json()
                    if(result.message==='following'){                                                                         
                        button.textContent = 'following'
                    }else{
                        button.textContent = 'follow'
                    }
                }

            })()                                                                               
        }
      }
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
        Subscribe to get an email whenever {username} publishes
        </Tooltip>
    );
    

    return (
        <Container>
            {userLoggedIn ? <UserNavBar userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn}/>:
              <HomeNavBar/>}
            {loading ? <Spinner animation="borders"/> :
            <>
            <div style={{ textAlign: "center" }}>
                <Image src={"http://localhost:5000/"+user.profile} className="ProfilePicture" />
                <h3 className="display-3">{username}</h3>
                <Button variant="success" className="btn-sm" id="follow-btn" onClick={follow}>{user.following ? "Following":"Follow"}</Button>
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                    <Button variant="light" style={{marginLeft:"5px"}}><i className="fa fa-lg fa-sharp fa-solid fa-envelope"></i></Button>
                </OverlayTrigger>
                <hr />
            </div>
            <Container>
                <h2 className="display-4">About {username}</h2>
                <hr />
                <Container>
                    <h4>{user.about_me}</h4>
                    {userLoggedIn && <h3>{userLoggedIn}</h3>}
                </Container>
                <hr />
                <h2 className="display-2">Blogs by {username}</h2>
                <hr />
                <Container>
                    <AllPosts username={username} url={'/api/myposts'}/>
                </Container>
            </Container>
            </>}
            
        </Container>
    );
}