import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import UserNavBar from './UserNavBar';

function Createblog({ userLoggedIn, setUserLoggedIn }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag,setTag] = useState()
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
  const submitForm = () => {
    let data = {
      user: userLoggedIn,
      title: title,
      body: body,
      tag:tag,
    }
    let options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + localStorage.getItem("access_token")
      },
      body: JSON.stringify(data),
    }
    

    fetch(window.location.origin+"/api/post", options)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json()
        }
      })
      .then((result) => {
        // // props.loggedUser(data.user)
        // console.log(result)
        navigate("/")

      })
      .catch((err) => { console.log(err) })
  }
  return (
    <>
      <UserNavBar userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
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
            <option value="Art">Art</option>
            <option value="Sports">Sports</option>
          </select>
        </div>
        <button onClick={submitForm} className="btn btn-primary">Submit</button>

      </div>
    </>
  )
}

export default Createblog