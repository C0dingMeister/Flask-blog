import React, { useState } from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Button, Image, Stack,Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";



export default function AuthorBar({date,tag,username,picture,following, subscribed ,userLoggedIn, sidebar, readTime}) {
    const navigate = useNavigate()
    
    const follow = ()=>{
        const mobileButton = document.getElementById('mobile-follow-btn')
        const desktopButton = document.getElementById('desktop-follow-btn')
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
                    "Authorization": "Bearer "+localStorage.getItem("access_token"),
                    'Content-Type': 'application/json',
                            },
                    body: JSON.stringify(data),
                }
                
                const response = await fetch(window.location.origin+"/api/follow",options)
                if(response.ok){
                    const result = await response.json()
                    if(result.message==='following'){                                                                         
                        mobileButton.textContent = 'Following'
                        desktopButton.textContent = 'Following'
                    }else{
                        mobileButton.textContent = 'Follow'
                        desktopButton.textContent = 'Follow'
                    }
                }
            })()                                                                               
        }
      }
    
    



    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
        {subscribed ? "Unsubscribe from mails" :`Subscribe to get an email whenever ${username} publishes`}
        </Tooltip>
    );
    return(
        <>
        {sidebar  ? 

        <Container className="AuthorSideBar">
        <Stack direction="vertical">
            <Image src={window.location.origin+"/"+picture} width="100px" height={"100px"}  style={{borderRadius:"25px"}}/>
            <Link to={"/profile/"+username}  className="display-5 noDecorationLinks">{username}</Link>
            {username !== userLoggedIn && <div >
                <Stack direction="horizontal">
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                    >
                        <Button variant="light" id="side-envelope"><i className={subscribed ? `fa fa-lg fa-sharp fa-solid fa-envelope-open`:`fa fa-lg fa-sharp fa-solid fa-envelope`}></i></Button>
                    </OverlayTrigger>
                    <Button className="btn-sm btn-success" onClick={follow} id="mobile-follow-btn" style={{ fontSize: "small", marginRight: "4px" }}>{following?"Following":"Follow"}</Button>
                </Stack>
            </div>}
            
        </Stack>
        </Container>
               
               :
        
        <Stack direction="vertical" gap={3} className={"PostPageAuthor"}>
        <Stack direction="horizontal" className="justify-content-between">
           <div>
              <Image src={window.location.origin+"/" + picture} height="30px" width={"30px"} style={{ marginRight: "5px" }} />
              <Link to={"/profile/"+username} className="noDecorationLinks">{username}</Link>
           </div>
           {username!==userLoggedIn && <div>
              <OverlayTrigger
                 placement="right"
                 delay={{ show: 250, hide: 400 }}
                 overlay={renderTooltip}
              >
                 <Button variant="light" id="top-envelope" style={{ marginLeft: "5px" }}><i className={subscribed ? `fa fa-lg fa-sharp fa-solid fa-envelope-open`:`fa fa-lg fa-sharp fa-solid fa-envelope`}></i></Button>
              </OverlayTrigger>
              <Button className="btn-sm btn-success" id="desktop-follow-btn" onClick={follow} style={{ fontSize: "small", marginRight: "4px" }}>{following?"Following":"Follow"}</Button>
           </div>}
        </Stack>

        <div>
           <span className="PostInfo">{new Date(date).toLocaleDateString('en-us',{month:"short",day:"numeric"})+" "+ new Date(date).toLocaleTimeString('en-us',{hour:"numeric",minute:"numeric",hour12:true})} </span>
           <span className="PostInfo">{readTime}</span>
           <span className="Tag">{tag}</span>
        </div>
        </Stack>
        
        }
        </>
    );
}