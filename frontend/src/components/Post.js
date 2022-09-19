import React from "react";
import { Stack,Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TimeAgo from './TimeAgo';

export default function Post({ post }) {
    const navigate = useNavigate();
    const fullPage = () =>{
        
        navigate(`/post/${String(post.id)}`)
    }
    return (
        <Stack direction="verticle" className="AllPosts" gap={2} onClick={fullPage}>
                <div>
                    <Image src={"http://localhost:5000/"+post.picture} height={"20px"} width={"20px"} style={{marginRight:"5px"}}/>
                   <span>{post.username}</span> 
                </div>
                <div>
                    <h5>{post.article_title.length > 50 ? post.article_title.slice(0, 50) + "..." : post.article_title}</h5>
                    <h6>{post.article_body.length > 90 ? post.article_body.slice(0, 100) + "..." : post.article_body}
                    </h6>
                </div>
                <div>
                    <span className="PostInfo">{post.date} </span>  
                    <span className="PostInfo">2 mins read</span>
                    <span className="Tag">{post.tag}</span>
                </div>
            </Stack>
    );
}