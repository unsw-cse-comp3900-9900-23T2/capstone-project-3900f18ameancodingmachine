import * as React from 'react';
import { useNavigate } from 'react-router-dom';

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
import { createAddress, createAccount } from '../user/RegistrationPage';

async function createEatery(name, addressId, phone, email, loginId, url) {
  try {
    const {data} = await axios.post('api/user/eatery', {
      name: name,
      addressId: addressId,
      phone: phone,
      email: email,
      loginId: loginId,
      url: url
    });
    if (data.success) {
      console.log("Eatery successfully created");
      return data.data.insertId;
    }
  } catch (error) {
    console.log(error);
  }
  return 0;
}

export default function RestaurantRegistrationPage() {
  const cuisines = [
    "italian",
    "french",
    "mexican",
    "thai",
    "japanese",
    "vietnamese",
    "turkish",
    "greek",
  ]
  const navigate = useNavigate();
  const [registerFail, setRegisterFail] = React.useState(false);
  const [registerMSG, setRegisterMSG] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [website, setWebsite] = React.useState('');
  //address details
  const [street, setStreet] = React.useState('');
  const [suburb, setSuburb] = React.useState('');
  const [region, setRegion] = React.useState('');
  const [postCode, setPostCode] = React.useState('');
  const [cuisine, setCuisine] = React.useState(cuisines[0]);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    let success, message;
    for ([success, message] of [
      [validator.isEmail(email), "Please use a valid email"],
      [confirmPassword === password, "Passwords do not match"],
      [validator.isStrongPassword(password), "Password length must be atleast 8 with 1 uppercase and lowercase character aswell as 1 number and symbol"],
      [validator.isMobilePhone(phoneNumber), "Please use a valid phone number"],
      [validator.isPostalCode(postCode, "AU"), "Please use a valid postal address"],
      [!validator.isEmpty(street, { ignore_whitespace: true }) 
        && !validator.isEmpty(suburb, { ignore_whitespace: true }) 
        && !validator.isEmpty(region, { ignore_whitespace: true }) 
        && !validator.isEmpty(name, { ignore_whitespace: true }),
        //TODO: check for website valdiity
      "Please fill out all the required fields"]
    ]) {
      if (!success) {
        setRegisterFail(true);
        setRegisterMSG(message);
        return;
      }
    }

    //if the function has not returned, fields are appropriate
    setRegisterFail(false);
    setRegisterMSG('');

    const loginId = await createAccount(email, password);
    //if create account returns 0
    if (!loginId) {
      setRegisterFail(true);
      setRegisterMSG("An account with this email already exists");
      return;  
    }
    const addressId = await createAddress(street, suburb, region, postCode);
    const eateryId = await createEatery(name, addressId, phoneNumber, email, loginId, website);
    console.log(eateryId);
    navigate('/login');
  }

  return (
    <Container maxWidth="md">
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            Sign up your Restaurant
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Name
          </Typography>
          <TextField required id="register-name" label="Name" value={name} onChange={(event) => {
              setName(event.target.value);
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
            Phone Number
          </Typography>
          <TextField required id="register-phone" label="phone" value={phoneNumber} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={(event) => {
              setPhoneNumber(event.target.value);
            }}
          />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Street
          </Typography>
          <TextField required id="register-street" label="Street" value={street} onChange={(event) => {
              setStreet(event.target.value);
            }}
          />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Suburb
          </Typography>
          <TextField required id="register-suburb" label="Suburb" value={suburb} onChange={(event) => {
              setSuburb(event.target.value);
            }}
          />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Region
          </Typography>
          <TextField required id="register-region" label="Region" value={region} onChange={(event) => {
              setRegion(event.target.value);
            }}
          />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            PostCode
          </Typography>
          <TextField required id="register-postcode" label="PostCode" value={postCode} onChange={(event) => {
              setPostCode(event.target.value);
            }}
          />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Website
          </Typography>
          <TextField required id="register-website" label="Website" value={website}
            InputProps={{
              startAdornment: <InputAdornment position="start">https://</InputAdornment>,
            }} onChange={(event) => {
              setWebsite(event.target.value);
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="select-cuisine-label">Cuisine</InputLabel>
            <Select
              labelId="select-cuisine-label"
              id="select-cuisine"
              value={cuisine}
              label="Cuisine"
              onChange={(event) => {
                setCuisine(event.target.value);
              }}
            >
              {/* <MenuItem value={cuisines[0]}>{cuisines[0].toUpperCase()}</MenuItem> */}
              {cuisines.map((c) => <MenuItem value={c}>{c.toUpperCase()}</MenuItem>)}
            </Select>
          </FormControl>
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
          {registerFail && <Typography sx={{ fontSize: 14 }} color="red" gutterBottom>{registerMSG}</Typography> }
        </CardContent>
        <CardActions onClick={handleSubmit}>
          <Button size="small" >REGISTER</Button>
        </CardActions>
      </Card>
    </Container>
  );
}