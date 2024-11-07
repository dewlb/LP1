//you can get rid of this only exists to test login and register options 
import React from "react";
import PageTitle from '../components/PageTitle.tsx';
import Login from '../components/Login.tsx';

const LoginPage = () => {
    const register = async () => {
        const response = await fetch("");
    }

    return(
        <div>
            <PageTitle />
            <Login />
        </div>
    )
}

export default LoginPage;
