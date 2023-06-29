import * as React from 'react';

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

import { NavLink } from "react-router-dom";

export default function RestaurantRegistrationPage() {
  const cuisines = [
    "italian",
    "french",
    "mexican",
    "thai",
    "japanese",
    "vietnamese"
  ]
  
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [cuisine, setCuisine] = React.useState(cuisines[0]);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');



  return (
    <Container maxWidth="md">
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            Sign up your Restaurant
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
            Phone Number
          </Typography>
          <TextField required id="register-phone" label="phone" value={phoneNumber} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={(event) => {
              setPhoneNumber(event.target.value);
            }}
          />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Location
          </Typography>
          <TextField required id="register-location" label="location" value={location} onChange={(event) => {
              setLocation(event.target.value);
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
        </CardContent>
        <CardActions>
          <Button size="small" component={NavLink} to="/">REGISTER</Button>
        </CardActions>
      </Card>
    </Container>
  );
}