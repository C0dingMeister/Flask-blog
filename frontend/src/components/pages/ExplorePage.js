import React from "react";
import { Container } from "react-bootstrap";
import AllPosts from "../AllPosts";
export default function ExplorePage() {
    return (
        <Container>
            <h1>Explore</h1>
            <hr />
            <AllPosts url={"/api/get"} slice={false}/>
        </Container>
    );
}