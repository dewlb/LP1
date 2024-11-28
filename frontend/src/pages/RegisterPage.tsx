import './RegisterPage.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function RegisterPage() {
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setuserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState('');
    const [submitAttempted, setSubmitAttempted] = useState(false);

    // These consts track validity, but no red/green until after submit is attempted
    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [usernameValid, setUsernameValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);

    function checkSignUp(firstName:string, lastName:string, email:string, username:string, password:string) {
        let isValid = true;

        if (!firstName) {
            setFirstNameValid(false);
            isValid = false;
        } else {
            setFirstNameValid(true);
        }

        if (!lastName) {
            setLastNameValid(false);
            isValid = false;
        } else {
            setLastNameValid(true);
        }

        if (!email) {
            setEmailValid(false);
            isValid = false;
        } else {
            setEmailValid(true);
        }

        if (!username) {
            setUsernameValid(false);
            isValid = false;
        } else {
            setUsernameValid(true);
        }

        if (!password) {
            setPasswordValid(false);
            isValid = false;
        } else {
            setPasswordValid(true);
        }

        return isValid;
    }

    async function signUp() {
        setSubmitAttempted(true); // Mark that submit has been attempted
        let newUser = { firstName, lastName, email, username, password };

        if (!checkSignUp(firstName, lastName, email, username, password)) {
            setMessage("All fields must be filled out.");
            return;
        }

        try {
            let result = await fetch("http://cop4331-team14.xyz:3000/api/register", {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });

            if (result.status === 409) {
                setMessage('User with email or username already exists.');
                setUsernameValid(false);
                setEmailValid(false);
            } else {
                setMessage('Registration successful. Please check email for verification.');
            }

            result = await result.json();
            localStorage.setItem("user-info", JSON.stringify(newUser));
        } catch (error) {
            console.error("Error:", error);
            setMessage('Failed to connect to the server. Please try again later.');
        }
    }

    return (
        <>
            <div className='body'>
                <div className='wrapper'>
                    <form action="">
                        <h1>Register</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                className={submitAttempted ? (firstNameValid ? 'valid' : 'invalid') : ''}
                                value={firstName}
                                onChange={(e) => setfirstName(e.target.value)}
                                placeholder='First Name'
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                className={submitAttempted ? (lastNameValid ? 'valid' : 'invalid') : ''}
                                value={lastName}
                                onChange={(e) => setlastName(e.target.value)}
                                placeholder='Last Name'
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                className={submitAttempted ? (emailValid ? 'valid' : 'invalid') : ''}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='your@email.com'
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                className={submitAttempted ? (usernameValid ? 'valid' : 'invalid') : ''}
                                value={username}
                                onChange={(e) => setuserName(e.target.value)}
                                placeholder='Username'
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                className={submitAttempted ? (passwordValid ? 'valid' : 'invalid') : ''}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password'
                                required
                            />
                        </div>
                    </form>
                    <button onClick={signUp} type='submit'>Register</button>
                    <span id="registerResult">{message}</span>
                    <div className="register-link">
                        <p>Already have an account? <Link to="/login">Login now!</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;
