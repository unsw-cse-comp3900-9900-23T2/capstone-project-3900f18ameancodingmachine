import {useNavigate, useLocation} from 'react-router-dom';

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
 *  Stub to check if the given code matches the code sent via email,
 *  if true will then allow the user to reset their password.
 *  This will most likely be done by saving the submitted code as a
 *  cookie and resend it with the new password to reverify.
 * @param {*} login
 * @param {*} code
 * @return {Boolean}
 */
async function checkCode(login, code) {
  try {
    const {data} = await axios.get(`api/user/checkreset/${login}/${code}`);
    if (data.success) {
      console.log('Correct reset code was entered');
      return true;
    }
  } catch {
    console.log('Code check error');
  }
  return false;
}

/**
 * @return {JSX}
 */
export default function ForgotPassCodeEntry() {
  const codeRef = React.useRef('');
  const navigate = useNavigate();
  const {state} = useLocation();
  const [resetFail, setResetFail] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (await checkCode(state.login, codeRef.current.value)) {
      console.log('Moving to password reset page');
      navigate('/RecoveryNewPass', {state: {login: state.login}});
    }
    setResetFail(true);
  };

  return (
    <Container maxWidth="md">
      <Card sx={{minWidth: 275}}>
        <CardContent>
          <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
              Code Entry
          </Typography>
          <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
              Enter Code
          </Typography>
          <TextField required id="set-code" label="code" inputRef={codeRef} />

          {resetFail && <Typography sx={{fontSize: 14}} color="red" gutterBottom>
            &quot;Incorrect Code&quot;
          </Typography> }
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleSubmit}>Submit Code</Button>
        </CardActions>

      </Card>
    </Container>
  );
}
