//you can get rid of this only exists to test login and register options 
//import React from "react";
//import PageTitle from '../components/PageTitle.tsx';
//import Register from '../components/Register.tsx';
import './RegisterPage.css';
import { Link } from 'react-router-dom';



const RegisterPage = () => {
    /*const register = async () => {
        const response = await fetch("");
    } */

    return(
        <>
        <h1 id="title">GamePlan: Tournament Manager</h1>
        <div className='wrapper'>
            <form action = "">
                <h1>Register</h1>
                <div className="input-box">
                    <input type="text" placeholder='First Name' required/>                  
                </div>
                <div className = "input-box">
                    <input type="text" placeholder='Last Name' required/>
                </div>
                <div className="input-box">
                    <input type="text" placeholder='your@email.com' required/>  
                </div>
                <div className="input-box">
                    <input type="text" placeholder='Username' required/>  
                </div>
                <div className="input-box">
                    <input type="password" placeholder='Password' required/>                  
                </div>
            </form>
            <button type='submit'>Register</button>
            <div className="register-link">
                <p>Already have an account? <Link to="/login">Login now!</Link></p>
            </div>
        </div>
        </>      
    )
}

export default RegisterPage;
