import React from 'react'


function Blog(props) {
    // console.log(props)
    const goBack = ()=>{
        props.setReadMore(false)
    }
  return (
    <>
    
    <div className='container my-3 fullBlog'>
      <div style={{textAlign:"center"}}>
          
          <h1>{props.title}</h1>
          <hr />
          <h3 className='mx-4 my-4' >{props.body}</h3>
          <button className='btn btn-info ' onClick={()=>{goBack()}}>Back</button>
      </div>
      
        
    </div>
    </>
    
  )
}

export default Blog