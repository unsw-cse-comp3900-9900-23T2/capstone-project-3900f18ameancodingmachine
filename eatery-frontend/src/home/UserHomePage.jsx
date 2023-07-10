import * as React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RestaurantPost from './RestaurantPost'
import axios from 'axios';

const getCuisine = await axios.get('api/user/eatery/cuisines')
const cuisines = getCuisine.data.result
console.log(cuisines)

export default function UserHomePage() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [location, setLocation] = React.useState(null);
  const [cuisine, setCuisine] = React.useState(null);

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
          <Grid container spacing={2}>
            <Grid container xs={12} spacing={2}>
              <Grid xs={6}>
                <Autocomplete
                  id="restaurant-search"
                  freeSolo
                  options={["maccas", "kfc", "Dominos"]}
                  renderInput={(params) => <TextField {...params} label="Restaurant Search" />}
                />
              </Grid>
              <Grid xs={2}>
                <Button variant="contained" onClick={() => {}}>Browse</Button>
              </Grid>
              <Grid xs={2}>
                <Button variant="contained" onClick={() => {}}>Random</Button>
              </Grid>
            </Grid>
            <Grid container xs={12} spacing={2}>
              <Grid xs={4}>
                <Autocomplete
                  id="location-dropdown"
                  value={location}
                  options={["sydney", "melbourne", "adelaide"]}
                  getOptionLabel={(option) => option.title}
                  onChange={(event, newValue) => {
                    setLocation(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Location" />
                  )}
                />
              </Grid>
              <Grid xs={4}>
                <Autocomplete
                  id="cuisine-dropdown"
                  value={cuisine}
                  options={cuisines}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setCuisine(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Cuisine" />
                  )}
                />
              </Grid>
              <Grid xs={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          {isLoggedIn && <Button variant="contained" onClick={() => {}}>View Past Bookings</Button>}
          {isLoggedIn && <Button variant="contained" onClick={() => {}}>View Subscriptions</Button>}
        </CardActions>
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={12} spacing={2}>
              <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
                Current Offers
              </Typography>
            </Grid>
            <Grid container xs={12} spacing={2}>
              <RestaurantGridItem name="Dominos" cuisine="italian" location="sydney"/>
              <RestaurantGridItem name="Malay Chinese" cuisine="Malaysian" location="sydney"/>
              <RestaurantGridItem name="Atom Thai" cuisine="thai" location="parrammatta"/>
            </Grid>
            <Grid xs={12} spacing={2}>
              <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
                New Restaurants
              </Typography>
            </Grid>
            <Grid container xs={12} spacing={2}>
              <RestaurantGridItem name="Dominos" cuisine="italian" location="sydney"/>
              <RestaurantGridItem name="Malay Chinese" cuisine="Malaysian" location="sydney"/>
              <RestaurantGridItem name="Atom Thai" cuisine="thai" location="parrammatta"/>
            </Grid>
            <Grid xs={12} spacing={2}>
              <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
                Suggestions For You
              </Typography>
            </Grid>
            <Grid container xs={12} spacing={2}>
              <RestaurantGridItem name="Dominos" cuisine="italian" location="sydney"/>
              <RestaurantGridItem name="Malay Chinese" cuisine="Malaysian" location="sydney"/>
              <RestaurantGridItem name="Atom Thai" cuisine="thai" location="parrammatta"/>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

function RestaurantGridItem(props) {
  return (
    <Grid xs={4} spacing={2}>
      <RestaurantPost name={props.name} cuisine={props.cuisine} location={props.location} />
    </Grid>
  );
}