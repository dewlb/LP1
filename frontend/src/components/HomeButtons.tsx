//import React from 'react';
import { Link } from 'react-router-dom';

function HomeButtons() {
    return (
        <div>
            <Link to="/login">
                <button>Login</button>
            </Link>
            <br/>
            <br/>
            <Link to="/register">
                <button>Register</button>
            </Link>
        </div>
    );
}

export default HomeButtons;
