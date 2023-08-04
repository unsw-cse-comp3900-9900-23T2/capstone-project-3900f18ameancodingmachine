import * as React from 'react';
import {useNavigate} from 'react-router-dom';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import validator from 'validator';
import axios from 'axios';
import Grid from '@mui/material/Unstable_Grid2';
import {createAddress, createAccount} from '../user/RegistrationPage';

/**
 *
 * @param {*} name
 * @param {*} addressId
 * @param {*} phone
 * @param {*} email
 * @param {*} loginId
 * @param {*} url
 * @param {*} cuisine
 * @return {Int}
 */
async function createEatery(name, addressId, phone, email, loginId, url, cuisine) {
  try {
    const {data} = await axios.post('api/user/eatery', {
      name: name,
      addressId: addressId,
      phone: phone,
      email: email,
      loginId: loginId,
      url: url,
    });
    console.log(data);
    if (data.success) {
      const eateryId = data.results.insertId;
      console.log(data);
      await axios.post('api/user/cuisine', {
        cuisineName: cuisine,
        restaurantId: eateryId,
      });
      console.log('Eatery successfully created');
      return eateryId;
    }
  } catch (error) {
    console.log(error);
  }
  return 0;
}

/**
 * @return {JSX}
 */
export default function RestaurantRegistrationPage() {
  const cuisines = [
    'italian',
    'french',
    'mexican',
    'thai',
    'japanese',
    'vietnamese',
    'turkish',
    'greek',
  ];
  const navigate = useNavigate();
  const [registerFail, setRegisterFail] = React.useState(false);
  const [registerMSG, setRegisterMSG] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [website, setWebsite] = React.useState('');
  // address details
  const [street, setStreet] = React.useState('');
  const [suburb, setSuburb] = React.useState('');
  const [region, setRegion] = React.useState('');
  const [postCode, setPostCode] = React.useState('');
  const [cuisine, setCuisine] = React.useState(cuisines[0]);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  /**
   *
   * @param {*} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    let success; let message;
    for ([success, message] of [
      [validator.isEmail(email), 'Please use a valid email'],
      [confirmPassword === password, 'Passwords do not match'],
      [validator.isStrongPassword(password),
        'Password length must be atleast 8 with 1 uppercase and ' +
        'lowercase character aswell as 1 number and symbol'],
      [validator.isMobilePhone(phoneNumber), 'Please use a valid phone number'],
      [validator.isPostalCode(postCode, 'AU'), 'Please use a valid postal address'],
      [!validator.isEmpty(street, {ignore_whitespace: true}) &&
        !validator.isEmpty(suburb, {ignore_whitespace: true}) &&
        !validator.isEmpty(region, {ignore_whitespace: true}) &&
        !validator.isEmpty(name, {ignore_whitespace: true}),
      // TODO: check for website valdiity
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
    console.log(addressId);
    const eateryId = await createEatery(
        name, addressId, phoneNumber, email, loginId, website, cuisine,
    );
    console.log(eateryId);
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{bgcolor: 'white'}}>
      <Card sx={{maxWidth: 500, m: 10, border: '10px inset #61dafb', bgcolor: '#F5F5F5'}}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={12} spacing={2}>
              <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
                Sign up your Restaurant
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Restaurant Name
              </Typography>
              <TextField required sx={{bgcolor: 'white'}}
                id="register-name" label="Name" value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Email Address
              </Typography>
              <TextField required sx={{bgcolor: 'white'}}
                id="register-email" label="email" value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </Grid>
            <Grid xs={6}>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Phone Number
              </Typography>
              <TextField required id="register-phone" sx={{bgcolor: 'white'}}
                label="phone" value={phoneNumber}
                inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
                onChange={(event) => {
                  setPhoneNumber(event.target.value);
                }}
              />
            </Grid>
            <Grid xs={6}>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Street
              </Typography>
              <TextField required sx={{bgcolor: 'white'}} id="register-street"
                label="Street" value={street}
                onChange={(event) => {
                  setStreet(event.target.value);
                }}
              />
            </Grid>
            <Grid xs={6}>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Suburb
              </Typography>
              <TextField required sx={{bgcolor: 'white'}} id="register-suburb"
                label="Suburb" value={suburb}
                onChange={(event) => {
                  setSuburb(event.target.value);
                }}
              />
            </Grid>
            <Grid xs={6}>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Region
              </Typography>
              <TextField required sx={{bgcolor: 'white'}} id="register-region"
                label="Region" value={region}
                onChange={(event) => {
                  setRegion(event.target.value);
                }}
              />
            </Grid>
            <Grid xs={6}>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                PostCode
              </Typography>
              <TextField required sx={{bgcolor: 'white'}} id="register-postcode"
                label="PostCode" value={postCode}
                onChange={(event) => {
                  setPostCode(event.target.value);
                }}
              />
            </Grid>
            <Grid xs={6}>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Website
              </Typography>
              <TextField required sx={{bgcolor: 'white'}} id="register-website"
                label="Website" value={website}
                InputProps={{
                  startAdornment: <InputAdornment position="start">
                    https://</InputAdornment>,
                }} onChange={(event) => {
                  setWebsite(event.target.value);
                }}
              />
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-cuisine-label">Cuisine</InputLabel>
                <Select sx={{bgcolor: 'white'}}
                  labelId="select-cuisine-label"
                  id="select-cuisine"
                  value={cuisine}
                  label="Cuisine"
                  onChange={(event) => {
                    setCuisine(event.target.value);
                  }}
                >
                  {cuisines.map((c) =>
                    <MenuItem key={c} value={c}>{c.toUpperCase()}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={6}>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Password
              </Typography>
              <TextField required sx={{bgcolor: 'white'}} type="password"
                id="register-password" label="Password"
                value={password} onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </Grid>
            <Grid xs={6}>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Confirm Password
              </Typography>
              <TextField required sx={{bgcolor: 'white'}} type="password"
                id="register-confirm-password"
                label="Confirm Password" value={confirmPassword} onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
              />
            </Grid>
            {registerFail && <Typography sx={{fontSize: 14}} color="red" gutterBottom>
              {registerMSG}
            </Typography> }
          </Grid>
        </CardContent>
        <CardActions onClick={handleSubmit}>
          <Button size="small" >REGISTER</Button>
        </CardActions>
      </Card>
    </Container>
  );
}
