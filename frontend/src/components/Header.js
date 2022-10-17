import React from 'react';
import Container from 'react-bootstrap/Container'
import { Image } from 'react-bootstrap';
import HomeNavBar from './HomeNavBar';


export default function Header() {

    return (
        <>
            <Container>
                <HomeNavBar />
                <Image className='mainImg' src='ideas.jpg' />
            </Container>
        </>
    )
}