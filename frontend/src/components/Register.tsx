function Register()
{
  
  function doLogin(event:any) : void
  {
    event.preventDefault();
    
    alert('doIt()');
  }
  
  return(
    <div id="loginDiv">
    <span id="inner-title">Register</span><br />
    <input type="text" id="firstName" placeholder="First Name" /><br />
    <input type="text" id="lastName" placeholder="Last Name" /><br />
    <input type="text" id="email" placeholder="example@gmail.com" /><br />
    <input type="password" id="password" placeholder="Password" /><br />
    <input type="password" id="confPassword" placeholder="Confirm Password" /><br />
    <input type="submit" id="loginButton" className="buttons" value = "Register!"
      onClick={doLogin} />
    <span id="loginResult"></span>
    </div>
  );
};

export default Register;
