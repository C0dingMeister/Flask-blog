import React, { useContext, useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link,NavLink, useNavigate } from "react-router-dom";
import AuthContext,{getCookie, logout} from "./context/AuthContext";
import { useFlash } from "./context/FlashProvider";

export default function UserNavBar() {
  const navigate = useNavigate()
  const {auth,setAuth, setIsAuthenticated} = useContext(AuthContext)
  const [subscribed, setSubscribed] = useState()
  const [sw ,setSw] = useState(null)
  const flash = useFlash()
  const url = process.env.API_URL+"/api/subscription"
  const headers = {
    "Content-Type":"application/json",
    'X-CSRF-TOKEN': getCookie('csrf_access_token')
  }

  //Checking whether the user is already subscribed or not
  useEffect(()=>{
    (async()=>{
      const response = await fetch(process.env.API_URL+"/api/notifications",{
        method:"GET",
        headers:headers,
        credentials: 'include',
      })
      
      if(response.ok){
        const result = await response.json()
        setSubscribed(result.message)
      }
      else{

        await logout()
        setAuth(null)
        setIsAuthenticated(false)
        navigate('/')
        flash("Login Session expired. Please login again!")
      }
      
    })()
  },[])

  useEffect(()=>{
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Service Worker and Push are supported');
    
      navigator.serviceWorker.register('/sw.js')
      .then(function(swReg) {
        console.log('Service Worker is registered');
    
        setSw(swReg);
      })
      .catch(function(error) {
        console.error('Service Worker Error', error);
      });
    } else {
      console.warn('Push messaging is not supported');
      pushButton.textContent = 'Push Not Supported';
    }
    console.log(Notification.permission)
  },[])
  const handleLogout = async() => {
    
    await logout()
    setAuth(null)
    setIsAuthenticated(false)
    navigate("/")
    flash("Logged out successfully!")
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
          reg = await navigator.serviceWorker.register("/sw.js")
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
          sub:null
        }
        const response = await fetch(url,{
          method:"POST",
          headers:headers,
          credentials: 'include',
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
      //  const reg = await navigator.serviceWorker.register("/sw.js");
       const sub = await sw.pushManager.subscribe({
         userVisibleOnly: true,
         applicationServerKey: publicKey
       
       })
       return sub
     } 
      
      subscribe()
      .then(async (sub)=>{
        // console.log(JSON.stringify(sub))
      let data = {
        sub:sub
      }
      const response = await fetch(url,{
        method:"POST",
        headers:headers,
        credentials: 'include',
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
        
        navigate("/")
      }
      })
      .catch((error)=>{
        alert(error);
      })
      

      
    }
    
  }
  return (
    <>
      <Navbar bg="light" sticky="top" expand="md" className="mb-3 UserNavBar" collapseOnSelect={false}>
        <Container fluid>
          <Navbar.Brand as={NavLink} to={"/user"} className="brand-name" ><img src={process.env.API_URL+"/static/logo(256x256).ico"} height={"30px"} width={"30px"}/> Microblog</Navbar.Brand>
      
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
                <Link className="offcanvasLinks" to={`/profile/${auth}`}>My Profile</Link>
                <Link className="offcanvasLinks" to="/create_blog">Write a Blog</Link>
                <div className="notifiaction-button" id="notification" key={subscribed} title={subscribed ? "Disable notifications":"Allow notifications"} onClick={notification}><i className={subscribed ? "fa fa-solid fa-bell-slash":"fa fa-solid fa-bell"} id="bell"></i></div>
                <div className="logout-button" onClick={handleLogout}>Logout</div>
                
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}