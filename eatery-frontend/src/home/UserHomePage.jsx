import * as React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


import axios from 'axios';

export default function UserHomePage() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [location, setLocation] = React.useState(null);

  React.useEffect(() => {
    async function checkLogin() {
      try {
        const result = await axios.get('api/user/'); // use checkToken as middleware to verify token
        let data = result.data;
        if (data.success !== 0) {
          setIsLoggedIn(true)
          console.log("is logged in")
        }
      } catch (err) {
        // error when checking token using checktoken
        setIsLoggedIn(false)
        console.log("Not logged in")
      }
      
    }
    checkLogin()
  })

  return (
    <Container maxWidth="lg">
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            User Home
          </Typography>
          <Autocomplete
            id="restaurant-search"
            freeSolo
            options={["maccas", "kfc", "dominoes"]}
            renderInput={(params) => <TextField {...params} label="Restaurant Search" />}
          />
          <Button variant="contained" onClick={() => {}}>Browse</Button>
          <Button variant="contained" onClick={() => {}}>Random</Button>
          <Autocomplete
            id="location-dropdown"
            value={location}
            options={["sydney", "melbourne", "adelaide"]}
            getOptionLabel={(option) => option.title}
            onChange={(event, newValue) => {
              setLocation(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Location" variant="standard" />
            )}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={() => {}}>View Past Bookings</Button>
          <Button variant="contained" onClick={() => {}}>View Subscriptions</Button>
        </CardActions>
        <CardContent>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            Current Offers
          </Typography>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            New Restaurants
          </Typography>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            Suggestions For You
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}