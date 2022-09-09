import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


function Blog(props) {
  // console.log(props.blog.title)
  const [profile, setProfile] = useState();
  

  const navigate = useNavigate();

  const goBack = () => {
    props.setReadMore(false)
  }

  useEffect(()=>{
    try {
     const moibleBtn = document.getElementById('mobile');
     const desktopBtn = document.getElementById('desktop');

     if(props.blog.author===props.user){
       moibleBtn.style.display = 'none'
       desktopBtn.style.display = 'none'
     }
    } catch (error) {
      
    }
     
  })
   

  useEffect(() => {
    console.log("from blog post")
   
    // console.log(props.blog.author===props.user)
    let data = {
      username: props.blog.author,
      follower: props.user,
    }
    let options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    const fetchAuthor= async () => {
      await fetch("http://localhost:5000/getauthor", options)
        .then((response) => { return response.json() })
        .then((result) => { setProfile(result) })
        .catch((err) => { console.log(err) })
        
        
    }
    fetchAuthor()
    
  }, [])
  
  const follow = ()=>{
    const moibleBtn = document.getElementById('mobile')
    const desktopBtn = document.getElementById('desktop')
    if(!props.user){
      navigate('/login')
    }
    else{
   
      const followFunction = async()=>{
        let data = {
          follower:props.user,
          following:props.blog.author,
        }
        await fetch("http://localhost:5000/follow",{
        method:'PUT',
         headers: {
          "Authorization": "Bearer "+localStorage.getItem("token"),
          'Content-Type': 'application/json',
                 },
          body: JSON.stringify(data),
          })
          .then( (resp)=> {return resp.json()})
          .then((data)=>{
            console.log(data)
            if(data.message==='following'){
              
              moibleBtn.textContent = 'following'
              desktopBtn.textContent = 'following'
            }else{
              moibleBtn.textContent = 'follow'
              desktopBtn.textContent = 'follow'
            }
          })
          .catch((err)=>{console.log(err)})
    }
      followFunction()
    }
  }
  return (
    <>
    {profile&&
      <div className="container mobile text-center">
        <img src={"http://localhost:5000/" + profile.profile} alt="user dp" width={80} height={80} style={{ borderRadius: "50%", marginBottom:"10px"}} />
            <h6 className='my-2 text-muted'>{profile.user}</h6>
          
            <button className='btn btn-success mb-3' id='mobile' onClick={follow}>{profile.following?"following":"follow"}</button>
      </div>
    }
      <div className='container my-3 fullBlog row'>
        <div style={{ textAlign: "center" }} className="col-12 col-lg-8 ">

          <h1 className='display-2'>{props.blog.title}</h1>
          <hr />
          <div className="container blog-h3">
            <h3>{props.blog.body}</h3>
          </div>
          <button className='btn btn-info back-btn' onClick={() => { goBack() }}>Back</button>

        </div>

        {
          profile &&
          <div className="container desktop col-lg-4 ">
            <img src={"http://localhost:5000/" + profile.profile} alt="user dp" width={80} height={80} style={{ borderRadius: "50%"}} />
            <h6 className='my-2 text-muted'>{profile.user}</h6>
            
            <button className='btn btn-success' id='desktop' onClick={follow}>{profile.following?"following":"follow"}</button>
          </div>
        }


      </div>
    </>

  )
}

export default Blog