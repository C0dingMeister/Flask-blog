import React,{useState} from "react";
import { Stack,Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EditPostPage from "./pages/EditPostPage";

export default function Post({ post,edit }) {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const editPost = ()=> {
        setShow(true)
    }
    const fullPage = () =>{
        
        navigate(`/post/${String(post.id)}`)
    }
    const readingTime = (post)=>{
        const wordsArray = post.split(" ")
        const length = wordsArray.length
        return Math.ceil(length/200)
    }
    return (
        <>
        {show && <EditPostPage show={show} setShow={setShow} title={post.article_title} content={post.article_body} id={post.id}/>}
        {edit && <Button className="btn-sm editPost" name="editPost" onClick={editPost}><i className="fa fa-edit"></i> Edit</Button> }
        <Stack direction="verticle" className="AllPosts" gap={2} onClick={fullPage}>
                <div className="post-header">
                    <Image src={window.location.origin+"/"+post.picture} height={"20px"} width={"20px"} style={{marginRight:"5px"}}/>
                   <span>{post.username}</span>
                   
                </div>
                <div>
                    <h5>{post.article_title.length > 50 ? post.article_title.slice(0, 50) + "..." : post.article_title}</h5>
                    <h6>{post.article_body.length > 90 ? post.article_body.slice(0, 100) + "..." : post.article_body}
                    </h6>
                </div>
                <div>
                    <span className="PostInfo">{new Date(post.date).toLocaleDateString('en-us',{month:"short",day:"numeric"})} </span>  
                    <span className="PostInfo">{readingTime(post.article_body) > 1 ? String(readingTime(post.article_body))+" mins read" : "1 min read"} </span>
                    <span className="Tag">{post.tag}</span>
                </div>
            </Stack>
        </>
    );
}