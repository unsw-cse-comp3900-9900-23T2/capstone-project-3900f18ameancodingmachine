import {useNavigate} from 'react-router-dom';

import * as React from 'react';
import axios from 'axios';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

/**
 *
 * @param {*} email
 * @return {Boolean}
 */
async function sendRecoveryEmail(email) {
  try {
    const {data} = await axios.post('api/user/reset', {login: email});
    if (data.success) {
      console.log('Email successfully sent');
      return true;
    }
  } catch {
    console.log('Failed to send email');
  }
  return false;
}

/**
 * @return {JSX}
 */
function EmailEntry() {
  const [email, setEmail] = React.useState('');
  const [resetFail, setResetFail] = React.useState(false);
  const navigate = useNavigate();

  /**
   *
   * @param {*} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (await sendRecoveryEmail(email)) {
      navigate('/RecoveryCodeEntry', {state: {login: email}});
    }
    setResetFail(true);
  };

  return (
    <Container maxWidth="md">
      <Card sx={{maxWidth: 500, m: 10, border: '10px inset #61dafb', bgcolor: '#F5F5F5'}}>
        <CardContent>
          <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
          Password Recovery
          </Typography>
          <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
          Enter Email Address
          </Typography>
          <TextField sx={{bgcolor: 'white'}} required
            id="register-email" label="email" value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          {resetFail && <Typography sx={{fontSize: 14}} color="red" gutterBottom>
            No account created with this email
          </Typography> }
        </CardContent>

        <CardActions>
          <Button size="small" onClick={handleSubmit}
            sx={{maxWidth: 200, bgcolor: 'white', borderRadius: '4px'}}>
            Recover Password
          </Button>
        </CardActions>

      </Card>
    </Container>

  );
}

/**
 * @return {JSX}
 */
export default function ForgotPassPage() {
  return (

    // Defaults to User Home Page if not logged in
    <EmailEntry/>
  );
}
