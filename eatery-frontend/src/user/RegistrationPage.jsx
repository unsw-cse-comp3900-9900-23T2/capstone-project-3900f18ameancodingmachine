import * as React from 'react';
import {useNavigate} from 'react-router-dom';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import validator from 'validator';
import axios from 'axios';

/**
 *
 * @param {*} email
 * @param {*} pass
 * @return {Int}
 */
export async function createAccount(email, pass) {
  try {
    const {data} = await axios.post('api/user/account', {
      login: email,
      password: pass,
    });
    if (data.success) {
      console.log('Account information created' + data.data.insertId);
      return data.data.insertId;
    }
  } catch (error) {
    console.log('Failed to create account');
  }
  return 0;
}

/**
 *
 * @param {*} street
 * @param {*} suburb
 * @param {*} region
 * @param {*} postcode
 * @return {Int}
 */
export async function createAddress(street, suburb, region, postcode) {
  try {
    const {data} = await axios.post('api/user/address', {
      street: street,
      suburb: suburb,
      region: region,
      postcode: postcode,
    });
    if (data.success) {
      console.log('Address information created');
      return data.data.insertId;
    }
  } catch (error) {
    console.log('Address information failed');
  }
  return 0;
}

/**
 *
 * @param {*} first
 * @param {*} last
 * @param {*} loginId
 * @param {*} addressId
 * @return {Int}
 */
async function createUser(first, last, loginId, addressId) {
  try {
    const {data} = await axios.post('api/user/user', {
      first: first,
      last: last,
      loginId: loginId,
      addressId: addressId,
    });
    if (data.success) {
      console.log('User successfully created');
      return data.data.insertId;
    }
  } catch (error) {
    console.log('User creation failed');
  }
  return 0;
}

/**
 * @return {JSX}
 */
export default function RegistrationPage() {
  const navigate = useNavigate();
  const [registerFail, setRegisterFail] = React.useState(false);
  const [registerMSG, setRegisterMSG] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  // login details
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  // address details
  const [street, setStreet] = React.useState('');
  const [suburb, setSuburb] = React.useState('');
  const [region, setRegion] = React.useState('');
  const [postCode, setPostCode] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    let success; let message;
    // check each field
    for ([success, message] of [
      [validator.isEmail(email), 'Please use a valid email'],
      [confirmPassword === password, 'Passwords do not match'],
      [validator.isStrongPassword(password),
        'Password length must be atleast 8 with 1 uppercase and ' +
        'lowercase character aswell as 1 number and symbol',
      ],
      [validator.isPostalCode(postCode, 'AU'), 'Please use a valid postal address'],
      [!validator.isEmpty(street, {ignore_whitespace: true}) &&
        !validator.isEmpty(suburb, {ignore_whitespace: true}) &&
        !validator.isEmpty(region, {ignore_whitespace: true}) &&
        !validator.isEmpty(firstName, {ignore_whitespace: true}) &&
        !validator.isEmpty(lastName, {ignore_whitespace: true}),
      'Please fill out all the required fields'],
    ]) {
      if (!success) {
        setRegisterFail(true);
        setRegisterMSG(message);
        return;
      }
    }

    // if the function has not returned, fields are appropriate
    setRegisterFail(false);
    setRegisterMSG('');

    const loginId = await createAccount(email, password);
    // if create account returns 0
    if (!loginId) {
      setRegisterFail(true);
      setRegisterMSG('An account with this email already exists');
      return;
    }
    const addressId = await createAddress(street, suburb, region, postCode);
    const userId = await createUser(firstName, lastName, loginId, addressId);
    console.log(userId);
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{bgcolor: 'white'}}>
      <Card sx={{maxWidth: 500, m: 10, border: '10px inset #61dafb', bgcolor: '#F5F5F5'}}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={12} spacing={2}>
              <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
                Create Account
              </Typography>
            </Grid>
            <Grid container xs={12} spacing={2}>
              <Grid xs={6} spacing={2}>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                  First Name
                </Typography>
                <TextField sx={{bgcolor: 'white'}} required id="register-first-name"
                  label="First Name" value={firstName} onChange={(event) => {
                    setFirstName(event.target.value);
                  }}
                />
              </Grid>
              <Grid xs={6} spacing={2}>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                  Last Name
                </Typography>
                <TextField sx={{bgcolor: 'white'}} required id="register-last-name"
                  label="Last Name" value={lastName} onChange={(event) => {
                    setLastName(event.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Grid xs={12} spacing={2}>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Email Address
              </Typography>
              <TextField sx={{bgcolor: 'white'}} required id="register-email"
                label="email" value={email} onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </Grid>
            <Grid container xs={12} spacing={2}>
              <Grid xs={6} spacing={2}>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                  Password
                </Typography>
                <TextField sx={{bgcolor: 'white'}} required type="password"
                  id="register-password" label="Password"
                  value={password} onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </Grid>
              <Grid xs={6} spacing={2}>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                  Confirm Password
                </Typography>
                <TextField sx={{bgcolor: 'white'}} required type="password"
                  id="register-confirm-password" label="Confirm Password"
                  value={confirmPassword} onChange={(event) => {
                    setConfirmPassword(event.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container xs={12} spacing={2}>
              <Grid xs={6} spacing={2}>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                  Street
                </Typography>
                <TextField sx={{bgcolor: 'white'}} required id="register-street"
                  label="Street" value={street} onChange={(event) => {
                    setStreet(event.target.value);
                  }}
                />
              </Grid>
              <Grid xs={6} spacing={2}>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                  Suburb
                </Typography>
                <TextField sx={{bgcolor: 'white'}} required id="register-suburb"
                  label="Suburb" value={suburb} onChange={(event) => {
                    setSuburb(event.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container xs={12} spacing={2}>
              <Grid xs={6} spacing={2}>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                  Region
                </Typography>
                <TextField sx={{bgcolor: 'white'}} required id="register-region"
                  label="Region" value={region} onChange={(event) => {
                    setRegion(event.target.value);
                  }}
                />
              </Grid>
              <Grid xs={6} spacing={2}>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                  PostCode
                </Typography>
                <TextField sx={{bgcolor: 'white'}} required id="register-postcode"
                  label="PostCode" value={postCode} onChange={(event) => {
                    setPostCode(event.target.value);
                  }}
                />
              </Grid>
            </Grid>
            {registerFail && <Typography sx={{fontSize: 14}} color="red" gutterBottom>
              {registerMSG}
            </Typography> }
          </Grid>
        </CardContent>
        <CardActions onClick={handleSubmit}>
          <Button size="small">REGISTER</Button>
        </CardActions>
      </Card>
    </Container>
  );
}
