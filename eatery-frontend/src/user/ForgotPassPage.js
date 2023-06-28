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


function EmailEntry(){
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
    
  

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
      </CardContent>
      
      <CardActions>
        <Button size="small">Recover Password</Button>
      </CardActions>

    </Card>
  </Container>

  )
}

function ForgotPassPage(){  
  return (
    <EmailEntry/>
  );
}



export default ForgotPassPage;
