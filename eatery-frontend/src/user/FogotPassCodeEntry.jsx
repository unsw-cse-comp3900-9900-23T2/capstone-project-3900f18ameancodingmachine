import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import * as React from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


/*
 *  Stub to check if the given code matches the code sent via email, 
 *  if true will then allow the user to reset their password.
 *  This will most likely be done by saving the submitted code as a
 *  cookie and resend it with the new password to reverify.
 */
function checkCode(code){
    alert(`checkCode: Defaulting to True\nValue = ${code}`);
    return true
}

function ForgotPassCodeEntry() {
    const codeRef = React.useRef('');
    const navigate = useNavigate();
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      const code = codeRef.current.value; // Retrieve the value from the ref
      /*
       *  Send email with a link to reset password for associated
       *  Email to that email address
       *  For now simply send the email  
       */
      checkCode(code);
      navigate("/RecoveryNewPass");
    }
  
    return (
      <Container maxWidth="md">
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
              Code Entry
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Enter Code
            </Typography>
            <TextField required id="set-code" label="code" inputRef={codeRef} />
  
          </CardContent>
  
          <CardActions>
            <Button size="small" onClick={handleSubmit}>Submit Code</Button>
          </CardActions>
  
        </Card>
      </Container>
    );
  }
  

export default ForgotPassCodeEntry;
