import React, { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import Login from './components/Login'
import Register from './components/register'
import Myblogs from './components/Myblogs'
import Createblog from './components/Createblog'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";



function App() {
  const [user, setUser] = useState()
  const [dp, setDp] = useState()
  const [data, setData] = useState()
  const [readMore, setReadMore] = useState(false)
  const [loading, setLoading] = useState()
  let token = localStorage.getItem("token")
  useEffect(() => {
    console.log("getting user")
    token = localStorage.getItem("token")
    if (token) {
      async function getUser() {
        await fetch('http://localhost:5000/getuser', {
          headers: {
            "Authorization": "Bearer " + token
          }
        }).then((resp) => { return resp.json() })
          .then((user) => {
            if (user.logged_in_as) { 
              setUser(user.logged_in_as)
              setDp(user.dp) 
            }
            else {
              setUser(null)
              setDp(null)
              localStorage.removeItem("token")
            }

          })
      }
      getUser()

    }
  })
  useEffect(() => {
    console.log("getting data")
    setLoading(true)
    async function FetchData() {

        await fetch("http://localhost:5000/get", {
            method: 'GET',

            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => {
            // console.log(res)
            const result = await res.json()

            //   console.log(result) 
            return result
        }
        )
            .then((resp) => { 
              setData(resp) 
              setLoading(false)
            })
            .catch((err) => { console.log(err) })


    }
    FetchData();
},[])
  const updateAfterEdit = (blog) => {
    const new_blogs = data.map(my_blog => {
      if (my_blog.id === blog.id) {
        return blog
      } else {
        return my_blog
      }
    })
    setData(new_blogs)
  }
  const updateAfterDelete = (blog) => {
    const new_blogs = data.filter(myblog => {
      if (myblog.id === blog.id) {
        return false;
      }
      return true;
    })
    setData(new_blogs)
  }
  const updatedData= (newBlog)=>{
    const all_blogs = [...data,newBlog]
    setData(all_blogs)
  }

  return (
    <>
    <div className="wrapper">
      <Sidebar user={user} setUser={setUser} setDp={setDp} dp={dp}/>
      <div id="content">
        <Navbar user={user} setUser={setUser} setDp={setDp}/>
      
      <Routes>
        <Route path="/" element={< BlogList data={data}  readMore={readMore} setReadMore={setReadMore} loading={loading} />} />

        <Route path="/login" element={token && token !== '' && token !== undefined && user ? <Navigate to={'/'} /> : < Login setUser={setUser} setDp={setDp} />} />

        <Route path="/register" element={token && token !== '' && token !== undefined && user ? <Navigate to={'/'} /> : < Register />} />

        <Route exact path='/my_blogs' element={token && token !== '' && token !== undefined && user ? <Myblogs user={user}
          updateAfterEdit={updateAfterEdit} updateAfterDelete={updateAfterDelete} setUser={setUser} setDp={setDp}/> : <Navigate to={'/'} />} />

        <Route path='/create_blog' element={token && token !== '' && token !== undefined && user ? <Createblog user={user}
          updatedData={updatedData}/> : <Navigate to={'/'} />} />

      </Routes>
      </div>
      </div>
    </>
  )
}

export default App