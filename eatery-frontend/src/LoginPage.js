import React from 'react';
import './LoginPage.css'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/*
 *  Checks credentials with backend, if successful set the recieved sessionID and returns true
 *  Otherwise return false
 */
function checkCredentials(email, pass){
  /*
   *  If the credentials are successful set appropriate cookies for homepage
   */
  alert(`LoginPage.js: checkCredentials\nThe email you entered was: ${email}\nThe password you entered was: ${pass}`);
  return false;
}

function LoginForm(){
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const [logInFail, setLogInFail] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
     *  Send email and password to backend to check if they are valid
     *  If so, proceed to homepage as a logged in user
     *  Else print underneath "Incorrect Email or Password" 
     */
    if (checkCredentials(email, pass)){
      navigate("/");
    };
    setLogInFail(true);
    
  }

 return (
    <form className='formSubmission'>
      <div className='formField'>
        <label>
          Email:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </label>
      </div>
      <div className='formField'>
        <label>
          Password:
          <input type="text" value={pass} onChange={(e) => setPass(e.target.value)}/>
        </label>
      </div>
      <input onClick={handleSubmit} type="submit" value="Log In" />
      <div>
        {logInFail && <span className="logInError">Incorrect Email or Password</span> }
      </div>
    </form>

  )
}

function ForgotPassword(){
  return(
    <button>
        Forgot Password
    </button>
  )
}

function LoginPage(){  
  return (
    <div>
      <div className='header'>
        <Link className="homeButton" to="/">Go to Home</Link> 
      </div>
      <div className='middlePageLogin'>
        <h1>Login Page</h1>
        <LoginForm/>
        <ForgotPassword/>
      </div>
    </div>
  );
}



export default LoginPage;
