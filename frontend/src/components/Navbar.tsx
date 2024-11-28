//import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return(
        <header className="header">
            <a href="/" className="logo">GamePlan</a>

            <nav className="navbar">
                <a href="/">Home</a>
                <a href="/">About</a>
                <Link to="/login"><button className='buttons'>Login</button></Link>
                <Link to="/register"><button className='buttons'>Register</button></Link>
            </nav>
        </header>
    );
}

export default Navbar

