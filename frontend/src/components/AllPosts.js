import React, {useState,useEffect, useContext, useRef} from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext, { getCookie, logout } from "./context/AuthContext";
import Post from "./Post";

export default function AllPosts({url,username,edit,slice}) {
    const [posts,setPosts] = useState([]);
    const [page, setPage] = useState()
    const [feedPage, setFeedPage] = useState(0)
    const [bottom, setBottom] = useState(false)
    const [hasmore, setHasMore] = useState(true)
    const pageEnd = useRef()
    const {setAuth, setIsAuthenticated} = useContext(AuthContext)
    const navigate = useNavigate()
    
    
    //Make a microblog api for this
    const getPosts = async(strip=false)=>{
        setBottom(false)
        if(hasmore){

            let data = {
                page:page,
                hasmore:hasmore,
                strip: strip
            }
            const response = await fetch(process.env.API_URL+url,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data),
               
               
                
            })
            
            if (response.ok){
    
                const result = await response.json()
                
                setHasMore(result.hasmore)
                if(result.hasmore){
                    setPage(result.page)
                    setPosts(prev=> prev ? [...prev,...result.result]: result.result )
                }
        }
            setBottom(true)
        }
       
    }
    const getMyPosts = async()=>{
        setBottom(false)
        if(hasmore){
            console.log(hasmore)
            let data = {
                page:page,
                hasmore:hasmore,
                username: username
            }
            const response = await fetch(process.env.API_URL+url,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data),
               
               
                
            })
            
            if (response.ok){
    
                const result = await response.json()
                // console.log(result)
                setHasMore(result.hasmore)
                if(result.hasmore){
                    setPage(result.page)
                    setPosts(prev=> prev ? [...prev,...result.all_blogs]: result.all_blogs )
                }
        }
            setBottom(true)
        }

    }

    const getFavoritePosts = async()=>{
        setBottom(false)
        if(hasmore){
            console.log(hasmore)
            let data = {
                page:page,
                hasmore:hasmore,
                
            }
            const response = await fetch(process.env.API_URL+url,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json",
                    'X-CSRF-TOKEN': getCookie('csrf_access_token'),
                },
                credentials:'include',
                body:JSON.stringify(data),
            })
            
            if (response.ok){
    
                const result = await response.json()
                // console.log(result)
                setHasMore(result.hasmore)
                if(result.hasmore){
                    setPage(result.page)
                    setPosts(prev=> prev ? [...prev,...result.result]: result.result )
                }
        }
            setBottom(true)
        }

    }

    const getFeedPosts = async()=>{
        setBottom(false)
        if(hasmore){
            console.log(hasmore)
            let data = {
                page:feedPage,
            }
            const response = await fetch(process.env.API_URL+url,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json",
                    'X-CSRF-TOKEN': getCookie('csrf_access_token'),
                },
                credentials:'include',
                body:JSON.stringify(data),
            })
            
            if (response.ok){
                const result = await response.json()
                // console.log(result)
                setHasMore(result.hasmore)
                if(result.hasmore){
                    setFeedPage(feedPage+1)
                    setPosts(prev=> prev ? [...prev,...result.result]: result.result )
                }
        }
            setBottom(true)
        }
    }

    const getTagPosts = async()=>{
        setBottom(false)
        if(hasmore){

            let data = {
                page:page,
            }
            const response = await fetch(process.env.API_URL+url,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data),
                
            })
            
            if (response.ok){
    
                const result = await response.json()
                
                setHasMore(result.hasmore)
                if(result.hasmore){
                    setPage(result.page)
                    setPosts(prev=> prev ? [...prev,...result.result]: result.result )
                }
        }
            setBottom(true)
        }
    }
    useEffect(() => {
        (async ()=>{
            
            console.log("on "+url)

            // let options = {};
            // const headers = new Headers();
            // headers.append("Content-Type","application/json")
            // let pageNum = {
            //     page:page
            // }
            // options ={
            //     method:"POST",
            //     headers:headers,
            //     body: JSON.stringify(pageNum)
            // }
            // if(url === '/api/feed' || url === '/api/getfavorites'){
            //     headers.append('X-CSRF-TOKEN', getCookie('csrf_access_token'))
            //     options = {
            //         method:"GET",
            //         headers:headers,
            //         credentials: 'include'
            //     }
            // }
            // if(url === '/api/myposts'){
            //     let data = {
            //         username: username
            //     }
            //     options ={
            //         method:"POST",
            //         headers:headers,
            //         body: JSON.stringify(data)
            //     }
            // }
            
            
            // const response = await fetch(process.env.API_URL+url,options);
            //  if (response.ok){
            //     const result = await response.json();
            //     const allPosts = result.result
            //     setPage(result.page)
            //     addPosts(allPosts)
                
            // }
            // else{
            //     await logout()
            //     setAuth(null)
            //     setIsAuthenticated(false)
            //     navigate("/")
            // }
        if (url==='/api/myposts'){
           return await getMyPosts()
        }
        if(url==='/api/get'){
            if(slice){
                return await getPosts(true)
            }
            return await getPosts()
        }
        if(url==='/api/getfavorites'){
            return await getFavoritePosts()
        }
        if(url==='/api/feed'){
            return await getFeedPosts()
        }
        if(url.startsWith('/api/tag/')){
            return await getTagPosts()
        }
        })();
       
    },[url])

    useEffect(()=>{
        if(bottom){
            const observer = new IntersectionObserver((entries)=>{
                // console.log(entries[0].isIntersecting)
                if(entries[0].isIntersecting){
                    if(url==='/api/myposts'){
                        getMyPosts()
                        console.log("fetching my posts")
                    }else if(url==='/api/get'){
                        getPosts()
                    }
                    else if(url === '/api/feed'){
                        getFeedPosts()
                    }
                    else if(url.startsWith('/api/tag/')){
                        getTagPosts()
                    }
                    else{
                        console.log("fetching favorites")
                        getFavoritePosts()
                    }
                }
            },{
            threshold: 1,
            rootMargin: "200px 0px"
            
        })
            observer.observe(pageEnd.current)
            if(pageEnd.current){
                
                return ()=>{
                    if(pageEnd.current)
                    observer.unobserve(pageEnd.current)
                }
            }
        }
    
    
},[bottom])
   

    return (
        <>
            { posts === undefined || posts ===null ? <Spinner animation="border"/>:
            <>
            {posts.map(post=><Post post={post} key={post.id} edit={edit}/>)
                }
                
            <button ref={pageEnd}>
                More
            </button>
            </>}
            
               

        </>
    );
}