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
import { useState, useEffect } from 'react';

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
async function loadResults(string, address, cuisine, diet, distance) {
  try {
    const params = {};

    params.string = string != null ? string : "empty";
    params.cuisine = cuisine != null  ? cuisine : "empty";;
    params.diet = diet != null ? diet : "empty";
    params.address = address != null ? address : "empty";
    params.distance = distance != null ? distance : "empty";

    const { data } = await axios.get(`api/user/searcher`, { params });
    if (data.success) {
      const display = data.results.map(element => ({
        name: element.name,
        cuisine: element.cuisine,
        location: element.street + ', ' + element.suburb + ', ' + element.region,
      }));
      return display;
    } else {
      throw new Error('Failed to fetch data'); // Throw an error if 'success' is not true
    }
  } catch (error) {
    console.log(error);
    throw error; // Propagate the error to the calling code
  }
}

export default function Browse() {
  const { state } = useLocation();
  const search = state.search;
  const location = state.location;
  const distance = state.distance;
  const cuisine = state.cuisine;
  const dietary = state.dietary;

  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
      const data = await loadResults(search, location, cuisine, dietary, distance);
      setResults(data);
      } catch (err) {
        console.log(err)
        setResults([])
      }
    }
    fetchData();
  }, [search, location, cuisine, dietary, distance]);

  return (
    <Container maxWidth="600">
      <CardContent sx={{ bgcolor: '#FAFAFA', border: "10px groove #61dafb" }}>
        <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
          Search Results
        </Typography>
        <Grid sx={{ alignSelf: 'center' }} container spacing={2}>
          {results.length === 0 &&
            <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
              No Results
            </Typography>}
          {results.map(result => (
            <RestaurantPost key={result.id} user={userId} id={result.id} name={result.name} cuisine={result.cuisine} location={result.location} />
          ))}
        </Grid>
      </CardContent>
    </Container>
  );
}