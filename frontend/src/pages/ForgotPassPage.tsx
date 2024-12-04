import { Link } from 'react-router-dom';
import './LoginPage.css';
import { CiUser, CiLock } from "react-icons/ci";
import {useState} from 'react';
//import footbalPic from '../assets/huddle.jpg';



function ForgotPassPage() {

        const [email, setEmail] = useState("");
        const [message, setMessage] = useState('');


        async function sendPass()
        {

            try
            {
            let result = await fetch("http://cop4331-team14.xyz:3000/api/reset", {
                method: 'POST',
                body: JSON.stringify({
                    email: email
                }),
                headers: {
                    "Content-Type" : 'application/json',
                    "Access-Control-Allow-Origin" : 'application/json',
                    "Accept": 'application/json'
                }
            } ); 

            if(result.status == 200)
            {
                console.warn("email sent");
                setMessage('Email has been sent.');
            }
            else
            {
                setMessage('Error connecting to server.')
            }
  
                        
            console.warn("result code", result);
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
                    <h1>Forgot Password</h1>
                    <div className="input-box">
                        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email' required />
                        <CiLock className='icon' />
                    </div>
                </form>
                <button onClick={sendPass} type='submit'>Send</button>
                <span id="loginResult">{message}</span> 
                <div className="register-link">
                    <p><Link to="/login">Back to login.</Link></p>
                </div>
            </div>
            </div>
            
           
        </>
    );
};

export default ForgotPassPage;
