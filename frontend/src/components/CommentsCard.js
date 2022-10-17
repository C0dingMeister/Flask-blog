import React from 'react'
import { Stack } from 'react-bootstrap'

function CommentsCard({ comment }) {
    return (
        <>
            <Stack direction='vertical' className='comment-card' gap={2}>
                <div>
                    <img src={process.env.API_URL + '/' + comment.picture} width={"20px"} height={"20px"} style={{borderRadius:"25px"}}/>
                    <span> {comment.user}</span>
                    <span> {new Date(comment.date).toLocaleDateString('en-us',{month:"short",day:"numeric",hour:"numeric",minute:"numeric",hour12:true})}</span>
                </div>
                <div>
                    <h6>{comment.comment}</h6>
                </div>
            </Stack>
        </>
    )
}

export default CommentsCard