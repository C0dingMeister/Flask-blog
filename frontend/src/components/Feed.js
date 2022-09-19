import React from "react";
import { Container } from "react-bootstrap";
import AllPosts from "./AllPosts";

export default function Feed() {
    return (
        <>
        <Container>
            <h1>Feed</h1>
            <hr />
            <AllPosts url={"/api/feed"}/>
        </Container>
        </>
    );
}