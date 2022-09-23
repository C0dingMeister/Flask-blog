import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link,NavLink, useNavigate } from "react-router-dom";

export default function UserNavBar({userLoggedIn ,setUserLoggedIn }) {
  const navigate = useNavigate()
  const [subscribed, setSubscribed] = useState()
  const url = window.location.origin+"/api/subscription"
  const headers = {
    "Content-Type":"application/json",
    "Authorization":"Bearer "+ localStorage.getItem("access_token"),
  }

  //Checking whether the user is already subscribed or not
  useEffect(()=>{
    (async()=>{
      // console.log("getting notification data")
      let data = {
        user:userLoggedIn
      }
      
      const response = await fetch(window.location.origin+"/api/notifications",{
        method:"POST",
        headers:headers,
        body: JSON.stringify(data)
      })
      
      if(response.ok){
        const result = await response.json()
        setSubscribed(result.message)
      }
      else{

        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        setUserLoggedIn(null)
        navigate('/')
      }
      
    })()
  },[])

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUserLoggedIn(null)
    navigate("/")
  }

  // Triggers onClick. If already subscribed, will unsubscribe the user and vice-versa
  
  const notification = async () => {
    const button = document.getElementById("notification")
    if (subscribed) {
      button.classList.add('disabledbutton')
      // console.log("unsubscribing")
      async function unsubscribe() {
        // console.log("getting registration")
        let reg = await navigator.serviceWorker.getRegistration();
        if(!reg){
          reg = await navigator.serviceWorker.register("/static/js/sw.js")
        }
        const sub = await reg.pushManager.getSubscription()
        return sub
      }
       
      unsubscribe().then(async (sub)=>{
        if(sub) {
          const res = await sub.unsubscribe()
          // console.log(res)
        }else{
          // console.log("subcription not found in sw deleting whatever is stored in DB")
        }
        
        let data = {
          user:userLoggedIn,
          sub:null
        }
        const response = await fetch(url,{
          method:"POST",
          headers:headers,
          body: JSON.stringify(data)
        })
        const result = await response.json()
        // console.log(result)
        setSubscribed(false)
        button.classList.remove('disabledbutton')
      })  
      
    
    }

    else {
      button.classList.add('disabledbutton')
     async function subscribe(){

       const publicKey = "BIWiaQ4_PfE50maGN54-91QglRCyxlZaehIltGsvVyi1nWJndsfMAE7BExLOc_dodtrIpE9dIrybPbwGe2uxaAQ";
       const reg = await navigator.serviceWorker.register("/static/js/sw.js");
       const sub = await reg.pushManager.subscribe({
         userVisibleOnly: true,
         applicationServerKey: publicKey
       
       })
       return sub
     } 
      
      subscribe().then(async (sub)=>{
        // console.log(JSON.stringify(sub))
      let data = {
        user:userLoggedIn,
        sub:sub
      }
      const response = await fetch(url,{
        method:"POST",
        headers:headers,
        body: JSON.stringify(data)
      })
      // console.log(response)
      if(response.ok){
        const result = await response.json()
        // console.log(result)
        setSubscribed(true)
      button.classList.remove('disabledbutton')
      }
      else{
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        navigate("/")
      }
      })
      .catch(()=>{
        alert("Notifications are blocked.");
      })
      

      
    }
    
  }
  return (
    <>
      <Navbar bg="light" sticky="top" expand="md" className="mb-3 UserNavBar" collapseOnSelect={false}>
        <Container fluid>
          <Navbar.Brand as={NavLink} to={"/user"} className="brand-name" ><img src={window.location.origin+"/static/logo(256x256).ico"} height={"30px"} width={"30px"}/> Microblog</Navbar.Brand>
      
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title style={{ marginLeft: "8px" }} id={`offcanvasNavbarLabel-expand-lg`}>
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Link className="offcanvasLinks" to="/user">Home</Link>
                <Link className="offcanvasLinks" to={`/profile/${userLoggedIn}`}>My Profile</Link>
                <Link className="offcanvasLinks" to="/create_blog">Write a Blog</Link>
                <div className="notifiaction-button" id="notification" key={subscribed} title={subscribed ? "Disable notifications":"Allow notifications"} onClick={notification}><i className={subscribed ? "fa fa-solid fa-bell-slash":"fa fa-solid fa-bell"} id="bell"></i></div>
                <div className="logout-button" onClick={logout}>Logout</div>
                
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}