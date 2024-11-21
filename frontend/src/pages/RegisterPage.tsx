//you can get rid of this only exists to test login and register options 
//import React from "react";
//import PageTitle from '../components/PageTitle.tsx';
//import Register from '../components/Register.tsx';
import './RegisterPage.css';
import { Link } from 'react-router-dom';
import {useState} from 'react';

//FOR REFERENCE! I used a different approach here to connect the API + front end. Not 100% about this one,
//but I'm more certain about the LoginPage's since that one is just a copy and paste from Leinecker.
//So as long as one of them works, I can just use that approach.


function RegisterPage() {
    /*const register = async () => {
        const response = await fetch("");
    } */

        const [firstName, setfirstName] = useState("");
        const [lastName, setlastName] = useState("");
        const [email, setEmail] = useState("");
        const [username, setuserName] = useState("");
        const [password, setPassword] = useState("");
        const [message, setMessage] = useState('');

        async function signUp()
        {
            let newUser = {firstName, lastName, email, username, password};
            console.warn(newUser);

            try
            {
            let result = await fetch("http://cop4331-team14.xyz:3000/api/register", {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: {
                    "Content-Type" : 'application/json',
                    //"Access-Control-Allow-Origin" : 'application/json',
                    "Accept": 'application/json'
                }
            } ) 
            

            if(result.status == 409)
            {
                setMessage('User with email or username already exists.')
            }

            else
            {
                setMessage('Registration successful. Please check email for verification.');
            }

            result = await result.json();
            console.warn("result", result);
            localStorage.setItem("user-info", JSON.stringify(newUser));
            

            }//try ends here
            catch (error) {
                console.error("Error:", error);
                setMessage('Failed to connect to the server. Please try again later.');
            }
        }

    return(
        <>
        <h1 id="title">GamePlan: Tournament Manager</h1>
        <div className='wrapper'>
            <form action = "">
                <h1>Register</h1>
                <div className="input-box">
                    <input type="text" value={firstName} onChange={(e)=>setfirstName(e.target.value)} placeholder='First Name' required/>                  
                </div>
                <div className = "input-box">
                    <input type="text" value={lastName} onChange={(e)=>setlastName(e.target.value)} placeholder='Last Name' required/>
                </div>
                <div className="input-box">
                    <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='your@email.com' required/>  
                </div>
                <div className="input-box">
                    <input type="text" value={username} onChange={(e)=>setuserName(e.target.value)} placeholder='Username' required/>  
                </div>
                <div className="input-box">
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' required/>                  
                </div>
            </form>
            <button onClick={signUp} type='submit'>Register</button>
            <span id="registerResult">{message}</span> 
            <div className="register-link">
                <p>Already have an account? <Link to="/login">Login now!</Link></p>
            </div>
        </div>
        </>      
    )
}

export default RegisterPage;
