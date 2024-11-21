//import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import { CiUser, CiLock } from "react-icons/ci";

const LoginPage = () => {
    return (
        <>
            <h1 id="title">GamePlan: Tournament Manager</h1>
            <div className='wrapper'>
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' required />
                        <CiUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Password' required />
                        <CiLock className='icon' />
                    </div>
                </form>
                <button type='submit'>Login</button>
                <div className="register-link">
                    <p>Don't have an account? <Link to="/register">Register now!</Link></p>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
