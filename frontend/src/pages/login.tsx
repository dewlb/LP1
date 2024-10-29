//you can get rid of this only exists to test login and register options 
import React from "react";



const Login = () => {
    const register = async () => {
        const response = await fetch("");
    }

    return(
        <div>
            <button onClick={() => register()}>OAuth</button>
        </div>
    )
}


export default Login;