import React, { useEffect,useState } from "react";
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function LatestPost({ url }) {
    const [latestPost, setLatestPost] = useState()
    const navigate = useNavigate()
    useEffect(() => {
        (async () => {
            const response = await fetch(process.env.API_URL + url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                const result = await response.json();

                setLatestPost(result);
            } else {
                setLatestPost(null);
            }
        })();

    }, [url])
    const fullPage = (e) =>{
        navigate(`/post/${String(e.target.value)}`)
    }
    return (
         <>        
         { latestPost === undefined || latestPost ===null ? <Spinner animation="border"/>:

        <>
            <h1>Latest Posts</h1>
            <Carousel variant="dark" indicators={false}>
                {latestPost.map(post => {
                    return (<Carousel.Item key={post.id}>
                        <Card className="carousel-cards">
                            <Card.Img variant="top" src={process.env.API_URL+"/"+post.picture}  />
                            <Card.Body>
                                <Card.Title>{post.article_title.length > 50 ? post.article_title.slice(0, 50) + "..." : post.article_title}</Card.Title>
                                <Card.Text>
                                {post.article_body.length > 90 ? post.article_body.slice(0, 100) + "..." : post.article_body}
                                </Card.Text>
                                <Button onClick={(e)=>fullPage(e)} value={post.id} variant="primary">Read More</Button>
                            </Card.Body>
                        </Card>
                    </Carousel.Item>
                )})}
            </Carousel>
        </>
        }
        </>


        
    );
}