import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext, { getUser, getCookie } from './context/AuthContext';
import { useFlash } from './context/FlashProvider';
import UserNavBar from './UserNavBar';

function Createblog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag,setTag] = useState()
  const {auth, setAuth, setIsAuthenticated} = useContext(AuthContext)
  const flash = useFlash()
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "title") {
      setTitle(value);
    }
    if (id === "body") {
      setBody(value);
    }
    if (id === "blog-tags") {
      setTag(value);
    }
    
  }
  const submitForm = async() => {
    const submitButton = document.getElementById('submit-post')
    submitButton.setAttribute('disabled',true)
    const user = await getUser()
    if(user){
      if(title.replace(/ /g,'').length < 3){
        submitButton.removeAttribute('disabled')
        flash("Title must be atleast 3 characters long")
        return
      }
      if(body.replace(/ /g,'').length < 50){
        submitButton.removeAttribute('disabled')
        flash("Content body must be atleast 50 characters long")
        return
      }
  
      let data = {
        user: auth,
        title: title,
        body: body,
        tag:tag,
      }
      let options = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
        credentials: 'include',
        body: JSON.stringify(data),
      }
      
  
      fetch(process.env.API_URL+"/api/post", options)
        .then((resp) => {
          if (resp.status === 200) {
            return resp.json()
          }
        })
        .then((result) => {
          // // props.loggedUser(data.user)
          // console.log(result)
          navigate("/user")
  
        })
        .catch((err) => { console.log(err) })
        submitButton.removeAttribute('disabled')
        flash("Blog posted successfully!","success")
    }
    else{
      
      setAuth(null)
      setIsAuthenticated(false)
      navigate('/')
      flash("Login Session Expired. You have to login again")
    }
  }
  return (
    <>
      <UserNavBar />
      <div className="container">
        <h1 style={{ textAlign: "center" }}>Share your thoughts to the world!!</h1>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">Blog Title</label>
          <input type="text" className="form-control" id="title" onChange={(e) => handleChange(e)} />

        </div>
        <div className="mb-3">
          <label htmlFor="body" className="form-label">Content</label>
          <textarea type="text" className="form-control" onChange={(e) => handleChange(e)} id="body" rows={4} ></textarea>
        </div>
        <div className='mb-3'>
          <label htmlFor="blog-tags">Choose a tag for your blog: </label>
          <select name="blog-tags" id="blog-tags" onChange={(e) => handleChange(e)}>
            <option value="Miscellanious">Miscellanious</option>
            <option value="Music">Music</option>
            <option value="Fashion">Fashion</option>
            <option value="Programming">Programming</option>
            <option value="Educational">Educational</option>
            <option value="Photography">Photography</option>
            <option value="History">History</option>
            <option value="Art">Art</option>
            <option value="Sports">Sports</option>
            <option value="Gaming">Gaming</option>
          </select>
        </div>
        <button onClick={submitForm} className="btn btn-primary" id='submit-post'>Submit</button>

      </div>
    </>
  )
}

export default Createblog