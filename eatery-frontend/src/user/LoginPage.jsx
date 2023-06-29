import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as React from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

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
  const navigate = useNavigate();
  const [logInFail, setLogInFail] = useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
     *  Send email and password to backend to check if they are valid
     *  If so, proceed to homepage as a logged in user
     *  Else print underneath "Incorrect Email or Password" 
     */
    if (checkCredentials(email, password)){
      navigate("/");
    };
    setLogInFail(true);
    
  }

 return (
  <Container maxWidth="md">
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
          Log In
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Email Address
        </Typography>
        <TextField required id="register-email" label="email" value={email} onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Password
        </Typography>
        <TextField required type="password" id="register-password" label="Password" value={password} onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        {logInFail && <Typography sx={{ fontSize: 14 }} color="red" gutterBottom>Incorrect Email or Password</Typography> }
      </CardContent>
      <CardActions onClick={handleSubmit}>
        <Button size="small">Log In</Button>
      </CardActions>
      
      <CardActions>
        <Button size="small">Forgot Password? TODO: Modify to link to Forgot Password Page</Button>
      </CardActions>

    </Card>
  </Container>

  )
}

function LoginPage(){  
  return (
    <LoginForm/>
  );
}



export default LoginPage;
