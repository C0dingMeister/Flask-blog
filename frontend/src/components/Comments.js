import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import CommentsCard from './CommentsCard';
import { getCookie, getUser } from './context/AuthContext';
import InputField from './InputField';

function Comments({show, setShow, id}) {
    const [error, setError] = useState()
    const [comments, setComments] = useState()
    const [user, setUser] = useState(false)
    const commentField = useRef();
    const handleClose = () => setShow(false);

    useEffect(()=>{
        (async()=>{
            console.log("fetchin comments")
            let data = {
                id:id
            }
            const response = await fetch(process.env.API_URL+'/api/getcomments',{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data)

            })

            if(response.ok){
                const result = await response.json()
                setComments(result)
            }
        })()
        
    },[])

    useEffect(()=>{
        (async()=>{
            const user = await getUser()
            if(user){
                setUser(true)
            }
        })()
    })
    const onSubmit = async(event)=>{
        event.preventDefault();
        const comment = commentField.current.value
        if(!comment){
            setError('Comment field cannot be empty!')
            return
        }
        if(comment.length > 50){
            setError('Comment exceeded 50 character limit!')
            return
        }
        setError('')
        let data = {
            id:id,
            comment: comment
        }
        const response = fetch(process.env.API_URL+'/api/comment',{
            method: 'POST',
            headers:{
                "Content-Type":"application/json",
                'X-CSRF-TOKEN': getCookie('csrf_access_token'),
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })
        if(response.ok){
            const result = await response.json()
            console.log(result)
            
        }
        setShow(false)
    }
  return (
    <Offcanvas show={show} onHide={handleClose} placement={"end"} scroll={true} backdrop={"static"} >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Comments ({comments ? comments.length : 0})</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body >
            {user ? 
            <>
            <Form onSubmit={onSubmit}>
                <InputField 
                placeholder={'Should not exceed more than 50 characters'} 
                label="Leave a Comment"
                error={error} fieldRef={commentField}/>
                <Button className='btn-sm' type="submit">Submit</Button>
            </Form>
            <hr />
            </>
            :
            <>
            <div>
                <h3>Sign in to comment on this post</h3>
            </div>
            <hr />
            </>
            }
            { comments === undefined || comments ===null ? <Spinner animation="border"/>:
            <>
            {comments.map(comment=><CommentsCard comment={comment} key={comment.id}/>)
                }
            </>}
            
        </Offcanvas.Body>
      </Offcanvas>
  )
}

export default Comments