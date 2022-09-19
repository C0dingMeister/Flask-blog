import React, { useState, useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Createblog from './components/Createblog';
import CreateBlogPage from './components/pages/CreateBlogPage';
import FullPostPage from './components/pages/FullPostPage';
import HomePage from './components/pages/HomePage'
import LoginPage from './components/pages/LoginPage'
import ProfilePage from './components/pages/ProfilePage';
import RegisterationPage from './components/pages/RegistrationPage'
import UserPage from './components/pages/UserPage';
function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  let token = localStorage.getItem("access_token");
  useEffect(() => {
    console.log("getting user")
    token = localStorage.getItem("access_token");
    if (token) {

      (async () => {
        const response = await fetch('http://localhost:5000/api/getuser', {
          headers: {
            "Authorization": "Bearer " + token
          }
        })
        if (response.ok) {
          const result = await response.json()
          setUserLoggedIn(result.user)
        }
        else {
          setUserLoggedIn(null)
          localStorage.removeItem("access_token")
        }

      }
      )()
    }
  })

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={!userLoggedIn?<HomePage />:<Navigate to={"/user"}/>} />
          <Route path='/login' element={!userLoggedIn?<LoginPage setUserLoggedIn={setUserLoggedIn}/>:<Navigate to={"/user"}/>} />
          <Route path='/register' element={!userLoggedIn?<RegisterationPage />:<Navigate to={"/user"}/>} />
          <Route path='/create_blog' element={userLoggedIn ? <Createblog userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn}/>:<Navigate to={"/"}/>} />
          <Route path='/profile/:username' element={<ProfilePage userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn}/>} />
          <Route path='/user' element={!userLoggedIn?<Navigate to={"/"}/>:<UserPage userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn}/>} />
          <Route path='/post/:id' element={<FullPostPage userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn}/>}/>
          <Route path='/create' element={userLoggedIn ? <CreateBlogPage userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn}/>:<Navigate to={"/"}/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App