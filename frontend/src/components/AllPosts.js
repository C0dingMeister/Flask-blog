import React, {useState,useEffect} from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Post from "./Post";
export default function AllPosts({url,slice,username}) {
    const [posts,setPosts] = useState();
    const navigate = useNavigate()

    useEffect(() => {
        (async ()=>{
            console.log("on"+url)
            
            let options = {};
            const headers = new Headers();
            headers.append("Content-Type","application/json")
            options ={
                method:"GET",
                headers:headers,
            }
            if(url === '/api/feed'){
                headers.append("Authorization","Bearer "+localStorage.getItem("access_token"))
                options = {
                    method:"GET",
                    headers:headers,
                }
            }
            if(url === '/api/myposts'){
                let data = {
                    username: username
                }
                options ={
                    method:"POST",
                    headers:headers,
                    body: JSON.stringify(data)
                }
            }
            
            
            const response = await fetch("http://localhost:5000"+url,options);
             if (response.ok){
                const result = await response.json();
                const allPosts = result.reverse()
                if(slice){
                    setPosts(allPosts.slice(3))
                }
                else{
                    setPosts(allPosts)
                }
            }else{
                setPosts(null);
                navigate("/")
            }
            
        })();
       
    },[url])



    return (
        <>
            
            { posts === undefined || posts ===null ? <Spinner animation="border"/>:
            <>
            {posts.map(post=><Post post={post} key={post.id}/>)
                }
            </>}
            
               

        </>
    );
}