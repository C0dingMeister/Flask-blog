import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './components/context/AuthContext';
import FlashProvider from './components/context/FlashProvider';
import Createblog from './components/Createblog';
import FlashMessage from './components/FlashMessage';
import AdminPage from './components/pages/AdminPage';
import FullPostPage from './components/pages/FullPostPage';
import HomePage from './components/pages/HomePage'
import LoginPage from './components/pages/LoginPage'
import ProfilePage from './components/pages/ProfilePage';
import RegisterationPage from './components/pages/RegistrationPage'
import TagPage from './components/pages/TagPage';
import UserPage from './components/pages/UserPage';
import ValidationPage from './components/pages/ValidationPage';
import PublicRoute from './components/PublicRoute';
import RequireAuth from './components/RequireAuth';

function App() {

  // useEffect(() => {

  //   token = localStorage.getItem("access_token");
  //   if (token) {

  //     (async () => {
  //       console.log("getting user")
  //       const response = await fetch(process.env.API_URL + '/api/getuser', {
  //         headers: {
  //           "Authorization": "Bearer " + token
  //         }
  //       })
  //       if (response.ok) {
  //         const result = await response.json()
  //         setUserLoggedIn(result.user)
  //       }
  //       else {
  //         setUserLoggedIn(null)
  //         localStorage.removeItem("access_token")
  //         localStorage.removeItem("refresh_token")
  //       }

  //     }
  //     )()
  //   }
  // })

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <FlashProvider>
            <FlashMessage/>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicRoute />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterationPage />} />
              </Route>

              {/* Private routes */}
              <Route element={<RequireAuth />}>
                <Route path='/user' element={<UserPage />} />
                <Route path='/create_blog' element={<Createblog />} />
              </Route>

              {/*Both Private & Public routes */}
              <Route path='/profile/:username' element={<ProfilePage />} />
              <Route path='/tag/:tag' element={<TagPage />}/>
              <Route path='/post/:id' element={<FullPostPage />} />

              {/* special route */}
              <Route path='/auth/:id' element={<ValidationPage/>} />
              <Route path='/dev/admin' element={<AdminPage />} />
              {/* catch all route */}
              <Route path='*' element={<Navigate to={"/"} />} />
            </Routes>
          </FlashProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App