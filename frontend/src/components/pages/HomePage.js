import React from "react";
import Header from "../Header";
import LatestPost from "../LatestPost";
import AllPosts from "../AllPosts";
import { Col, Container, Row } from "react-bootstrap";
import TagComponent from "../TagComponent";
export default function HomePage() {


    return (
        <>
            <Header />
            <Container>
                <hr />
                <LatestPost url={"/api/latest"}/>
                <hr />
                <div className="top-tag-section">
                        <h2>Learn something new today! </h2>
                        
                        <div style={{margin:"auto", maxWidth: "350px"}}>
                            <TagComponent/>
                        </div>
                    </div>
                <Row>
                    <Col lg={{span:7}} >
                        <h2 className="display-3">More to Explore...</h2>
                        <AllPosts url={"/api/get"} slice={true}/>
                    </Col>
                    <Col lg={{offset:1}} className="tag-section">
                    <div >
                        <h2>Learn something new today! </h2>
                        <hr />
                        <div style={{marginTop:"30px", maxWidth: "450px"}}>
                            <TagComponent/>
                        </div>
                    </div>
                    </Col>
                </Row>
                
                    
             

            </Container>

        </>
    );
}