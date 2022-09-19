import React from "react";
import Header from "../Header";
import LatestPost from "../LatestPost";
import AllPosts from "../AllPosts";
import { Container } from "react-bootstrap";
export default function HomePage() {
    return (
        <>
            <Header />
            <Container>
                <hr />
                <LatestPost url={"/api/latest"}/>
                <hr />
                <h2 className="display-3">More to Explore...</h2>
                <AllPosts url={"/api/get"} slice={true}/>

            </Container>

        </>
    );
}