import React from 'react';
import './LoginPage.css'
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';


function LoginForm(){
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    /*
     *  Modify this function to use a hook to access the backend
     *  Once the backend is up set up checking that 
     */
    alert(`The email you entered was: ${email}\nThe password you entered was: ${pass}`);
    history.push('/');
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
    <input onClick={handleSubmit} type="submit" value="Submit" />
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
      <h1>Login Page</h1>
      <Link to="/">Go to Home</Link>

      <LoginForm/>
      <ForgotPassword/>
   
    </div>
  );
}



export default LoginPage;
