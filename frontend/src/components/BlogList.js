import React, {useState } from 'react'
import Loader from './Loading'
import Blog from './Blog'


function BlogList(props) {
    const [blog,setBlog] = useState({
        title:"",
        body:"",
        author:"",
        date:""
    })

    const fullBlog = (user) => {
        setBlog({
            title:user.article_title,
            body:user.article_body,
            author:user.username,
            date:user.date,
        })
        props.setReadMore(true)
    }


    return (
        <>       
        {
            props.loading ? 
            <Loader/>
            :
            <>
                {
                    props.readMore  ?
                    <>
                        <Blog blog={blog} user={props.loggedUser} setReadMore={props.setReadMore} />
                    </>
                    :
                    <>
                        <h1 className='display-3' style={{ textAlign: "center", fontFamily: "serif" }}>Latest Blogs</h1>
                        <div className='blog-container row'>
                            {props.data && props.data.map((user => {
                                return <div key={user.id} className="my-3 blog-card col-lg-12 ">

                                    <div className="container border border-opacity-30 my-1">
                                        
                                        <div className="container my-2">
                                            <h2 id="title" className='ms-4'><strong>{user.article_title.length > 50 ? user.article_title.slice(0, 50) + "..." : user.article_title}</strong></h2>
                                            <hr className='style-seven'/>
                                            <h5 id="body" >{user.article_body.length > 90 ? user.article_body.slice(0, 100) + "..." : user.article_body}</h5>
                                            <p ><em>by {user.username}</em></p>
                                            


                                        </div>
                                        <div  style={{display:"flex",justifyContent:"space-between"}} className="card-footer text-muted pb-2">
                                            <h6>{user.date}</h6>
                                            <button className="btn btn-outline-dark" onClick={() => fullBlog(user)}><i className="fa fa-solid fa-book-open"></i> Read more</button>
                                        </div>
                                    </div>
                                </div>

                            }))

                            }
                        </div>
                    </>
                }
            </>
            
        }









        </>


    )
}

export default BlogList