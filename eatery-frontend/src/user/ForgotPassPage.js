import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import * as React from 'react';
import axios from 'axios';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


function EmailEntry(){
  const [email, setEmail] = React.useState('');
  const [resetFail, setResetFail] = React.useState(false);
  const navigate = useNavigate();
    

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {data} = await axios.post("api/user/reset", {login: email});
    if (data.success) {
      console.log("reset email success")
      navigate("/RecoveryCodeEntry");
    }
    setResetFail(true);
    
  }

 return (
  <Container maxWidth="md">
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
          Password Recovery
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Enter Email Address
        </Typography>
        <TextField required id="register-email" label="email" value={email} onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
      {resetFail && <Typography sx={{ fontSize: 14 }} color="red" gutterBottom>"No account created with this email"</Typography> }
      </CardContent>
      
      <CardActions>
        <Button size="small" onClick={handleSubmit}>Recover Password</Button>
      </CardActions>

    </Card>
  </Container>

  )
}

function ForgotPassPage(){  
  return (
    
    // Defaults to User Home Page if not logged in
    <EmailEntry/>
  );
}



export default ForgotPassPage;
