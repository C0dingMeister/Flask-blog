import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';

function Createblog(props) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body,setBody] = useState("");
  const handleChange = (e) => {
    const {id , value} = e.target;
    if(id === "title"){
        setTitle(value);
    }
    if(id === "body"){
        setBody(value);
    }

}
  const submitForm = ()=>{
      let data = {
          user: props.user,
          title: title,
          body: body,
      }
      let options = {
          method:"POST",
          headers:{
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + localStorage.getItem("token")
          },
          body: JSON.stringify(data),
      }
      console.log(title,body,props.user)
      
      fetch("http://localhost:5000/post",options)
      .then((resp)=>{
          if (resp.status === 200){
              return resp.json()
          }
      })
      .then((result)=>{
          // props.loggedUser(data.user)
          props.updatedData(result.newBlog)
          console.log(result)
          navigate("/")
          
      })
      .catch((err)=>{console.log(err)})
    }

  return (
    <>
    <div className="container">
      <h1 style={{textAlign:"center"}}>Share your thoughts to the world!!</h1>
      
  <div className="mb-3">
    <label htmlFor="title" className="form-label">Blog Title</label>
    <input type="text" className="form-control" id="title" onChange={(e)=>handleChange(e)} aria-describedby="emailHelp"/>
    
  </div>
  <div className="mb-3">
    <label htmlFor="body" className="form-label">Content</label>
    <textarea type="text" className="form-control" onChange={(e)=>handleChange(e)} id="body" rows={4} ></textarea>
  </div>
  
  <button  onClick={submitForm} className="btn btn-primary">Submit</button>

    </div>
    </>
  )
}

export default Createblog