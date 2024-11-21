//import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import { CiUser, CiLock } from "react-icons/ci";
import {useState} from 'react';



function LoginPage() {


        const [username, setuserName] = useState("");
        const [password, setPassword] = useState("");

        async function userLogin(event:any) : Promise<void>
        {
            event.preventDefault();
    
            var obj = {login:username,password:password};
            var js = JSON.stringify(obj);
      
            try
            {    
                const response = await fetch('http://cop4331-team14.xyz:3000/api/login',
                    {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
      
                var res = JSON.parse(await response.text());
      
                if( res.id <= 0 )
                {
                    //setMessage('User/Password combination incorrect');
                }
                else
                {
                    var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                    localStorage.setItem('user_data', JSON.stringify(user));
      
                    //setMessage('');
                    window.location.href = '/dash';
                }
            }
            catch(error:any)
            {
                alert(error.toString());
                return;
            }    
          };
    

    return (
        <>
            <h1 id="title">GamePlan: Tournament Manager</h1>
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
                <div className="register-link">
                    <p>Don't have an account? <Link to="/register">Register now!</Link></p>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
