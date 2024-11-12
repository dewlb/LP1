//you can get rid of this only exists to test login and register options 
//import React from "react";
import PageTitle from '../components/PageTitle.tsx';
import Register from '../components/Register.tsx';

const RegisterPage = () => {
    /*const register = async () => {
        const response = await fetch("");
    } */

    return(
        <div>
            <PageTitle />
            <Register />
        </div>
    )
}

export default RegisterPage;
