import React, { useState ,useContext} from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Button, Image, Stack,Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext, { getUser,getCookie } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEnvelope as lightEnvelope} from "@fortawesome/free-regular-svg-icons"
import {faEnvelope as darkEnvelope} from "@fortawesome/free-solid-svg-icons"


export default function AuthorBar({date,tag,username,picture,following, subscribed , sidebar, readTime}) {
    const navigate = useNavigate()
    const {auth} = useContext(AuthContext)
    const [sub, setSub] = useState(subscribed)
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    
    const follow = async()=>{
        const mobileButton = document.getElementById('mobile-follow-btn')
        const desktopButton = document.getElementById('desktop-follow-btn')
        const user = await getUser()
        if(!user){
          navigate('/login',{state: {from: location}, replace: true} )
        }
        else{
            (async()=>{
                
                let data = {
                    follower:user,
                    following:username,
                    }
                let options = {
                    method:'PUT',
                    headers: {
                        'X-CSRF-TOKEN': getCookie('csrf_access_token'),
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(data)
                }
                
                const response = await fetch(process.env.API_URL+"/api/follow",options)
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
    const newsLetterSubscription = async()=>{
        const mailButton = document.getElementById('topmail-button')
        mailButton.style.pointerEvents = 'none'
        const user = await getUser()
        if(!user){
            navigate('/login',{state: {from: location}, replace: true} )
        }
        else{
            
            setLoading(true)
            console.log(sub)
            let data = {
                subscribingTo:username
            }
            let options = {
                method:'POST',
                headers: {
                    'X-CSRF-TOKEN': getCookie('csrf_access_token'),
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            }
            const response = await fetch(process.env.API_URL+'/api/mailsubscription',options)
            const result = await response.json()
            console.log(result)
            setLoading(false)
            setSub(!sub)
            
        }
        mailButton.style.pointerEvents = 'auto'
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
        {sub ? "Unsubscribe from mails" :`Subscribe to get an email whenever ${username} publishes`}
        </Tooltip>
    );
    return(
        <>
        {sidebar  ? 

        <Container className="AuthorSideBar">
        <Stack direction="vertical">
            <Image src={process.env.API_URL+"/"+picture} width="100px" height={"100px"}  style={{borderRadius:"25px"}}/>
            <Link to={"/profile/"+username}  className="display-5 noDecorationLinks">{username}</Link>
            {username !== auth && <div>
                    <Button className="btn-sm btn-success" onClick={follow} id="desktop-follow-btn" style={{ fontSize: "small", marginRight: "4px" }}>{following?"Following":"Follow"}</Button>
            </div>}
            
        </Stack>
        </Container>
               
               :
        
        <Stack direction="vertical" gap={3} className={"PostPageAuthor"}>
        <Stack direction="horizontal" className="justify-content-between">
           <div>
              <Image src={process.env.API_URL+"/" + picture} height="30px" width={"30px"} style={{ marginRight: "5px" }} />
              <Link to={"/profile/"+username} className="noDecorationLinks">{username}</Link>
           </div>
           {username!==auth && 
           <div className="action-button">
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                    <FontAwesomeIcon id="topmail-button" icon={sub ? darkEnvelope : lightEnvelope} size={'2x'} onClick={newsLetterSubscription}/>
                </OverlayTrigger>
                <Button className="btn-sm btn-success" id="mobile-follow-btn" onClick={follow} 
                style={{ fontSize: "small", marginRight: "4px" }}>{following?"Following":"Follow"}</Button>
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