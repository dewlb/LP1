//import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import { CiUser, CiLock } from "react-icons/ci";
import {useState} from 'react';
//import footbalPic from '../assets/huddle.jpg';



function LoginPage() {


        const [username, setuserName] = useState("");
        const [password, setPassword] = useState("");
        const [message, setMessage] = useState('');


        async function userLogin()
        {
            let loginUser = {username, password};
            console.warn(loginUser);

            try
            {
            let result = await fetch("http://cop4331-team14.xyz:3000/api/login", {
                method: 'POST',
                body: JSON.stringify(loginUser),
                headers: {
                    "Content-Type" : 'application/json',
                    "Access-Control-Allow-Origin" : 'application/json',
                    "Accept": 'application/json'
                }
            } ); 

            // result = await result.json();
            // console.warn("result", result);
            // localStorage.setItem("user-info", JSON.stringify(loginUser));
            if(result.status == 200)
            {
                console.warn("I'm in here.");
                window.location.href = '/dashboard';
            }

            if(result.status == 202)
            {
                setMessage('User not verified. Please verify your email.');
            }

            if( result.status == 401 )
            {
                setMessage("Invalid username or password.");
            }

            if( result.status == 500 )
            {
                setMessage("Error logging in.");
            } 
  
                        
            console.warn("result code", result);
            const info = await result.json();
            console.warn("result", result);
            localStorage.setItem("user-info", JSON.stringify(info.info)); 

        }//end of try
        catch (error) {
            console.error("Error:", error);
            setMessage('Failed to connect to the server. Please try again later.');
        }

        }


    return (
        <>
        <div className='body'>
            <div className='wrapper'>
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input value={username} onChange={(e)=>setuserName(e.target.value)} type="text" placeholder='Username' required />
                        <CiUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password' required />
                        <CiLock className='icon' />
                    </div>
                </form>
                <button onClick={userLogin} type='submit'>Login</button>
                <span id="loginResult">{message}</span> 
                <div className="register-link">
                    <p>Don't have an account? <Link to="/register">Register now!</Link></p>
                </div>
                <div className="register-link">
                    <p><Link to="/forgotPassword">Forgot Password?</Link></p>
                </div>
            </div>
            </div>
            
           
        </>
    );
};

export default LoginPage;
