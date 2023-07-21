import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import RestaurantPost from './RestaurantPost'

import axios from 'axios';

let loginId
let userId

const getUserSubscribers = async() => {
  try {
    const result = await axios.get(`api/user/subscribe/${userId}`)
    let subscribedEateries = result.data.data
    subscribedEateries = subscribedEateries.map(eatery => ({
      key: eatery.restaurantId, 
      user:userId, 
      id: eatery.restaurantId, 
      name: eatery.name, 
      cuisine: eatery.cuisine || "not added", 
      location: eatery.suburb
    }))
    return subscribedEateries
  } catch (error) {
    console.log(error)
  }
}

/*
 *  Returns an array of the results based on what was searched
 *
 */
function loadResults(search, location, cuisine, dietary) {
    alert("loadResults: This should load entries from database based on\n"+search+" "+location+" "+cuisine+" "+dietary);
    //Temporary data
    return([
        {name: "TempName0", cuisine: "TempCuisine0", location: "TempLocation0"},
        {name: "TempName1", cuisine: "TempCuisine1", location: "TempLocation1"},
        {name: "TempName2", cuisine: "TempCuisine2", location: "TempLocation2"},
        {name: "TempName3", cuisine: "TempCuisine3", location: "TempLocation3"},
        {name: "TempName4", cuisine: "TempCuisine4", location: "TempLocation4"},
        {name: "TempName5", cuisine: "TempCuisine5", location: "TempLocation5"},
        {name: "TempName6", cuisine: "TempCuisine6", location: "TempLocation6"},
        {name: "TempName7", cuisine: "TempCuisine7", location: "TempLocation7"},
        {name: "TempName8", cuisine: "TempCuisine8", location: "TempLocation8"},
        {name: "TempName9", cuisine: "TempCuisine9", location: "TempLocation9"}
        ]);
    
  }

export default function Browse(){

    //Grab the variables from url for use later
    const {state} = useLocation();
    const search = state.search;
    const location = state.location;
    const distance = state.distance;
    const cuisine = state.cuisine;
    const dietary = state.dietary;
    
    const results = loadResults(search, location, cuisine, dietary)

    return(
        <Container maxWidth="600">
            <CardContent sx={{bgcolor: '#FAFAFA', border: "10px groove #61dafb"}}>
                <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
                    Search Results
                </Typography>
                <Grid sx={{alignSelf: 'center'}} container spacing={2}>
                    {results.length==0 && 
                    <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
                        No Results
                    </Typography>}
                    {results.map(result => {
                    return (     
                        <RestaurantPost key={result.id} user={userId} id={result.id} name={result.name} cuisine={result.cuisine} location={result.location}/>
                    );
                    })}
                </Grid>
            </CardContent>
        </Container>
    );
}