import React from 'react';
import './LoginPage.css'
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';


function LoginForm(){


 return (
    <form className='formSubmission'>
    <label>
      Email:
      <input type="text" name="email"/>
    </label>
    <br/>
    <label>
      Password:
      <input type="text" name="email"/>
    </label>
    <input type="submit" value="Submit" />
    </form>

  )
  
}

function LoginPage(){  
  return (
    <div>
      <h1>Login Page</h1>
      <Link to="/">Go to Home</Link>

      <LoginForm/>
   
    </div>
  );
}



export default LoginPage;
