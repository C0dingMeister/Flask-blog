import React from 'react'
import { Link } from 'react-router-dom';

function Navbar(props) {

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">

                <button type="button" id="sidebarCollapse" className="navbar-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="fas fa-align-justify"></i>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                    <ul className="nav navbar-nav  " >

                        <li className="nav-item active">
                            <Link className="nav-link" to={"/"}>General</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={"/"}>Tech</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to={"/"}>Sports</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={"/"}>business</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar