import React,{useState,useEffect} from 'react'
import EditBlog from './EditBlog'
import { useNavigate } from 'react-router-dom'
function Myblogs(props) {

  const navigate = useNavigate()
  const [blogs,setBlogs] = useState([])
  const [updateBlog, setupdateBlog]  = useState(null)
  const [title, setTitle]  = useState(null)
  const [body, setBody]  = useState(null)
  
  const editBlog = (blog)=>{
    console.log(blog)
    setupdateBlog(blog.id)
    setTitle(blog.article_title)
    setBody(blog.article_body)
  }
  
  const deleteBlog = (blogId)=>{
    let options = {
        method:"DELETE",
        headers:{
            "Authorization": "Bearer "+ localStorage.getItem("token")
        }
    }
    fetch(`http://localhost:5000/delete/${blogId}`,options)
    .then((resp)=>{return resp.json()})
    .then((data)=>{props.updateAfterDelete(data.blog)})
    .catch((err)=>{console.log(err)})
    navigate('/')
}

useEffect(() => {
      
  async function FetchUserData(){
    // console.log(props.user)
      await fetch("http://localhost:5000/myposts",{
        method:'POST',
         headers: {
          "Authorization": "Bearer "+localStorage.getItem("access_token")
                 },
          
          }).then(async (res) =>{
            
            const userData = await res.json()
            // console.log(data) 
          
          return userData
      }
   )
   .then((resp)=>{
    if(resp.msg){
      props.setUser(null)
      props.setDp(null)
      localStorage.removeItem("access_token")
      navigate('/')
    }
    else{
      setBlogs(resp)
    }
  })
   .catch((err)=>{console.log(err)})
  
   
  } 
  FetchUserData();
}, []);

useEffect(()=>{props.setReadMore(false)},[])
  return (
    <>
    <div className="container">
      
      {
         updateBlog&&title&&body ? 
         <>
         <EditBlog id={updateBlog} title={title} body={body} updateAfterEdit={props.updateAfterEdit}/>
         </> 
         :
         <>
         <h1>Myblogs</h1>
    {blogs && blogs.map((blog => {
                    return <div key={blog.id} className={"my-3"}>
                        
                        <div className="card text-center">
                            <div className="card-header">
                            {blog.username}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{blog.article_title}</h5>
                                <p className="card-text">{blog.article_body}</p>
                                {/* <button className="btn btn-primary mx-2" onClick={()=>fullBlog(blog)}>Read More!</button>
                                <button className="btn btn-primary" onClick={()=>editBlog(blog)}> Edit!</button> */}
                                <button className="btn btn-danger mx-2" onClick={()=>deleteBlog(blog.id)}>Delete!</button>
                                <button className="btn btn-primary mx-2" onClick={()=>editBlog(blog)}>Edit!</button>
                                
                            </div>
                            
                        </div>
                    </div>
                    
                }))}
         </>
      }
      
    
    
    </div>
    
    </>
  )
}

export default Myblogs