import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function EditBlog(props) {
    const navigate = useNavigate()
    const [title, setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);
   
    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === "title") {
            setTitle(value);
        }
        if (id === "body") {
            setBody(value);
        }

    }
    const submitForm = ()=>{
        let data = {
            title: title,
            body: body,
        }
        let options = {
            method:"PUT",
            headers:{
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(data),
        }
        console.log(title,body)
        
        fetch(`http://localhost:5000/update/${props.id}`,options)
        .then((resp)=>{
            if (resp.status === 200){
                return resp.json()
            }
        })
        .then((data)=>{
            
            // console.log(data)
            props.updateAfterEdit(data.blog)
            navigate("/")
            
        })
        .catch((err)=>{console.log(err)})
      }
    return (
        <>
            <div className="container">
                <h1 style={{ textAlign: "center" }}>Share your thoughts to the world!!</h1>

                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Blog Title</label>
                    <input type="text" className="form-control" id="title" value={title} onChange={(e) => handleChange(e)} />
                  
                </div>
                <div className="mb-3">
                    <label htmlFor="body" className="form-label">Content</label>
                    <textarea type="text" className="form-control" defaultValue={body}  onChange={(e) => handleChange(e)} id="body" rows={4} ></textarea>
                </div>

                <button onClick={submitForm} className="btn btn-primary">Update</button>

            </div>
        </>
    )
}

export default EditBlog