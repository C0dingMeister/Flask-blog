import React, { useEffect, useState } from "react";
import { Container, Image, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import UserNavBar from "../UserNavBar";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import AllPosts from "../AllPosts";
import HomeNavBar from "../HomeNavBar";
import EditProfilePage from "./EditProfilePage";

export default function ProfilePage({userLoggedIn ,setUserLoggedIn}) {
    const navigate = useNavigate()
    const { username } = useParams();
    const [user,setUser] = useState({});
    const [loading,setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const [page, setPage] = useState()
    
    useEffect(() => {
        
        (async()=>{
            setLoading(true)
            // console.log(userLoggedIn)
            let data = {
                username: username,
                follower:userLoggedIn
            }
            const response = await fetch(window.location.origin+"/api/getauthor",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            })
            if(response.ok){
                const result = await response.json();
                // console.log(result)
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
                
                const response = await fetch(window.location.origin+"/api/follow",options)
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
    
    const editProfile = (e)=>{
        setPage(e.target.name)
        setShow(true)
    }
    return (
        <Container>
            {show && <EditProfilePage show={show} setShow={setShow} page={page} about_me={user.about_me}/>}
            {userLoggedIn ? <UserNavBar userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn}/>:
              <HomeNavBar/>}
            {loading ? <Spinner animation="borders"/> :
            <>
            <div style={{ textAlign: "center" }}>
                <div className="edit-button">
                    <Image src={window.location.origin+"/"+user.profile} className="ProfilePicture" />
                    {userLoggedIn === username && <Button className="btn-sm" name="upload" onClick={(e)=>editProfile(e)}><i className="fa fa-edit"></i> Edit</Button>}
                </div>
                <h3 className="display-3">{username}</h3>
                {userLoggedIn !==username && <Container>
                    <Button variant="success" className="btn-sm" id="follow-btn" onClick={follow}>{user.following ? "Following":"Follow"}</Button>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                    >
                        <Button variant="light" style={{marginLeft:"5px"}}><i className="fa fa-lg fa-sharp fa-solid fa-envelope"></i></Button>
                    </OverlayTrigger>
                </Container>}
                <hr />
            </div>
            <Container>
                <div >
                    <label className="display-4">About {username}</label>
                    {userLoggedIn === username && <Button className="btn-sm edit-about" onClick={(e)=>editProfile(e)}><i className="fa fa-edit"></i> Edit</Button>}
                </div>
                <hr />
                <Container>
                    <h4>{user.about_me}</h4>
                </Container>
                <hr />
                <h2 className="display-2">Blogs by {username}</h2>
                <hr />
                <Container>
                    {userLoggedIn===username ? <AllPosts username={username} url={'/api/myposts'} edit={true}/>:<AllPosts username={username} url={'/api/myposts'}/>}
                </Container>
            </Container>
            </>}
            
        </Container>
    );
}