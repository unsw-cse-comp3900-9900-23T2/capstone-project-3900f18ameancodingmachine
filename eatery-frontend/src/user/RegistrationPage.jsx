import * as React from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import bugerIcon from './img/burgerIcon.jpeg';

export default function RegistrationPage() {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  return (
    <Container maxWidth="md">
      <Card sx={{ minWidth: 275 }}>
          
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <img src={bugerIcon} style={{position: 'absolute', top: '50%', right: '35%',  transform: 'translateY(-50%)',  width: '256px', height: '256px'}} />
          </div>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            Create Account
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            First Name
          </Typography>
          <TextField required id="register-first-name" label="First Name" value={firstName} onChange={(event) => {
              setFirstName(event.target.value);
            }}
          />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Last Name
          </Typography>
          <TextField required id="register-last-name" label="Last Name" value={lastName} onChange={(event) => {
              setLastName(event.target.value);
            }}
          />
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
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Confirm Password
          </Typography>
          <TextField required type="password" id="register-confirm-password" label="Confirm Password" value={confirmPassword} onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
          />
        </CardContent>
        
        <CardActions>
          <Button size="small">REGISTER</Button>
        </CardActions>

        
      </Card>
      
    </Container>
  );
}