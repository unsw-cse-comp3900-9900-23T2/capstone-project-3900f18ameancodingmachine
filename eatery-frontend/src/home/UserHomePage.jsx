/* eslint-disable react/prop-types */
import React, {useState, useContext, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {UserContext} from '../App.jsx';
import RestaurantPost from './RestaurantPost';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

import {LoadScript, Autocomplete as MapAutoComplete} from '@react-google-maps/api';

/**
 *
 * @param {*} param0
 * @return {JSX}
 */
const LocationAutocomplete = ({apiKey, onPlaceChanged}) => {
  const autocompleteRef = useRef(null);

  return (
    <MapAutoComplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={() => {
        if (autocompleteRef.current !== null) {
          const place = autocompleteRef.current.getPlace();
          onPlaceChanged(place);
        }
      }}
    >
      <input type="text" placeholder="Enter a location" />
    </MapAutoComplete>
  );
};

// get all of the restaurant and the cuisines from the database
const n = 6; // change the number depending on the requirements

let loginId;
let userId;

/**
 * @return {List}
 */
const getUserSubscribers = async () => {
  try {
    const result = await axios.get(`api/user/subscribe/${userId}`);
    let subscribedEateries = result.data.data;
    subscribedEateries = subscribedEateries.map((eatery) => ({
      key: eatery.restaurantId,
      user: userId,
      id: eatery.restaurantId,
      name: eatery.name,
      cuisine: eatery.cuisine || 'not added',
      location: eatery.suburb,
      image: eatery.image,
    }));
    return subscribedEateries;
  } catch (error) {
    console.log(error);
  }
};

/**
 * TODO: Stub for loadSubscriptions button
 *  curSubs is a local array which will return the results of the function
 *  index is an int which will tell the database where to start
 *  returning subscriptions from
 *  count is an int which will tell the database how many
 *  subscriptions from index to return
 *    if count = 0, load all ***even if index is invalid***
 *
 *  If the index does not exist return an error
 *  If the count is not completeble, return as many as possible
 *  For example
 *        loadSubscriptions(curSubs, 2, 3) =>
 *        curSubs = (Database[2], Database[3], Database[4])
 *  2nd example
 *        Database only has 4 entries from 0 to 3
 *        loadSubscriptions(curSubs, 2, 3) => curSubs = (Database[2], Database[3])
 *
 *  3rd example
 *        Database only has 4 entries from 0 to 3
 *        loadSubscriptions(curSubs, 4, 2) =>
 *        ERROR (Not sure exactly how this error should be handled)
 * @param {*} allSubs
 * @param {*} setCurrentSubs
 * @param {*} index
 * @param {*} count
 */
function loadSubscriptions(allSubs, setCurrentSubs, index, count) {
  const fullyLoadedData = allSubs;
  console.log(fullyLoadedData);
  if (count === 0) {
    setCurrentSubs(fullyLoadedData);
    return;
  }
  setCurrentSubs(fullyLoadedData.slice(index, index+count));
  return;
}

/**
 * @return {List}
 */
async function getLatestEateries() {
  const getEateries = await axios.get('api/user/eatery/all');
  console.log(getEateries);
  let eateries = getEateries.data.results;
  eateries = eateries.filter((eatery, index) => {
    // filter duplicate value based on their id on whether it matches
    // the array index
    return eateries.findIndex((e) => e.id === eatery.id) === index;
  });
  console.log(eateries);
  let newEateries = eateries.sort((a, b) => b.id - a.id).slice(0, n).reverse();
  console.log(newEateries);

  newEateries = newEateries.map((eatery) => ({
    key: eatery.id,
    user: userId || null,
    id: eatery.id,
    name: eatery.name,
    cuisine: eatery.cuisine || 'not added',
    location: eatery.suburb,
    image: eatery.image,
  }));
  console.log(newEateries);
  return newEateries;
}

const googleMapsLibraries = ['places'];

/**
 * @return {JSX}
 */
export default function UserHomePage() {
  // Null: not logged in, true: user, false: restaurant
  const {userContext, setUserContext} = useContext(UserContext);

  const [viewSubscriptions, setViewSubscriptions] = useState(false);
  const [currentSubs, setCurrentSubs] = useState([]);
  const [currentSubsIndex, setCurrentSubsIndex] = useState(0);
  const currentSubsCount = 3;

  const [newRestaurants, setNewRestaurants] = useState([]);
  const [cuisineList, setCuisineList] = useState([]);

  const [location, setLocation] = useState(null);
  const [maxDistance, setMaxDistance] = useState(null);
  const [cuisine, setCuisine] = useState(null);
  const [dietary, setDietary] = useState(null);
  const [search, setSearch] = useState(null);

  const [allSubs, setAllSubs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    /** check whether user has a token
    *   if user has a token, user is logged in
    */
    async function loading() {
      try {
        // use checkToken as middleware to verify token
        const result = await axios.get('api/user/');
        const data = result.data;
        if (data.success !== 0) {
          const decrypt = jwtDecode(data.token);
          loginId = decrypt.result.id;
          const getUserId = await axios.get(`api/user/login/${loginId}`);
          userId = getUserId.data.data[0].id;
          setAllSubs(await getUserSubscribers());
          setUserContext(true);
          console.log('is logged in');
        }
      } catch (err) {
        // error when checking token using checktoken
        setUserContext(null);
        console.log('Not logged in');
      }

      const getCuisine = await axios.get('api/user/eatery/cuisines');
      const cuisines = getCuisine.data.results;
      setCuisineList(cuisines);
      const latestEateriesArr = await getLatestEateries();
      setNewRestaurants(latestEateriesArr);
    }
    loading();
  }, [setUserContext]);

  useEffect(() => {
    /*
     *  Whenever the currentSubsIndex is toggled, load subscriptions with current index
     */
    loadSubscriptions(
        allSubs, setCurrentSubs, currentSubsIndex, currentSubsCount,
    );
  }, [currentSubsIndex, allSubs]);

  /**
   *
   */
  function handleOnClickViewSubscriptions() {
    loadSubscriptions(
        allSubs, setCurrentSubs, currentSubsIndex, currentSubsCount,
    );
    setViewSubscriptions(true);
  };

  /**
   *
   */
  function handleOnClickRightSubscriptions() {
    setCurrentSubsIndex((prevIndex) => prevIndex + 3);
    loadSubscriptions(
        allSubs, setCurrentSubs, currentSubsIndex, currentSubsCount,
    );
  };

  /**
   *
   */
  function handleOnClickLeftSubscriptions() {
    setCurrentSubsIndex((prevIndex) => Math.max(prevIndex - 3, 0));
    loadSubscriptions(
        allSubs, setCurrentSubs, currentSubsIndex, currentSubsCount,
    );
  };

  /**
   *
   */
  function handleOnClickBrowse() {
    // location, cuisine, dietary
    // const url = "/browse?location="+location+"&cuisine="+cuisine+"&dietary="+dietary;
    // FIX
    navigate('/browse', {
      state: {
        search: search,
        location: location,
        cuisine: cuisine,
        dietary: dietary,
        distance: maxDistance,
      },
    });
  };

  /**
   * Handle function for random button
   */
  /*
  function handleOnClickRandom() {
    navigate('/browse', {
      state: {
        search: search,
        location: location,
        cuisine: cuisine,
        dietary: dietary,
        distance: maxDistance,
      },
    });
  }
*/

  // TODO: have to hide the google api code
  return (
    <Container maxWidth="lg">
      <Card sx={{minWidth: 275}} square>
        <CardContent>
          <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
            User Home
          </Typography>
          <Grid container spacing={2}>
            <Grid container xs={12} spacing={2}>
              <Grid xs={6}>
                <Autocomplete
                  id="restaurant-search"
                  freeSolo
                  options={['maccas', 'kfc', 'Dominos']}
                  onChange={(event, newValue) => {
                    setSearch(newValue);
                  }}
                  renderInput={(params) =>
                    <TextField {...params} label="Restaurant Search" />}
                />
              </Grid>
              <Grid xs={2}>
                <Button variant="contained" onClick={handleOnClickBrowse}>Browse</Button>
              </Grid>
              <Grid xs={2}>
                <Button variant="contained" onClick={() => {}}>Random</Button>
              </Grid>
            </Grid>
            <Grid container xs={12} spacing={2}>
              <Grid xs={4}>
                <LoadScript
                  googleMapsApiKey={'AIzaSyDWsyvTM523ypAQXrHtWAzeHLgbB9jLe6Q'}
                  libraries={googleMapsLibraries}>
                  <LocationAutocomplete
                    apiKey={'AIzaSyDWsyvTM523ypAQXrHtWAzeHLgbB9jLe6Q'}
                    onPlaceChanged={setLocation}
                  />
                </LoadScript>
              </Grid>
              <Grid xs={4}>
                <Autocomplete
                  id="cuisine-dropdown"
                  value={cuisine}
                  options={cuisineList}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setCuisine(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Cuisine" />
                  )}
                />
              </Grid>
              <Grid xs={4}>
                <Autocomplete
                  id="dietary-dropdown"
                  value={dietary}
                  options={['lactose free', 'gluten free', 'vegetarian']}
                  getOptionLabel={(option) => option}
                  onChange={(event, newValue) => {
                    setDietary(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Dietary" />
                  )}
                />
              </Grid>
              <Grid xs={4}>
                <TextField onChange={(event, newValue) => {
                  setMaxDistance(newValue);
                }} label="Distance"
                InputProps={{
                  endAdornment: <InputAdornment position="end">km</InputAdornment>,
                }}
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
          {userContext===true &&
            <Button variant="contained" onClick={() => {}}>View Past Bookings</Button>}
          {userContext===true && !viewSubscriptions &&
            <Button variant="contained" onClick={handleOnClickViewSubscriptions}>
              View Subscriptions
            </Button>}
          {userContext===true && viewSubscriptions &&
            <Button variant="contained" onClick={() => {
              setViewSubscriptions(false);
            }}>Hide Subscriptions</Button>}
        </CardActions>
        {
          viewSubscriptions === true &&
        <CardContent sx={{bgcolor: '#FAFAFA', border: '10px groove #61dafb'}}>
          <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
            My Subscriptions
          </Typography>
          <Grid sx={{alignSelf: 'center', minHeight: 350}} container spacing={2}>
            {currentSubsIndex !== 0 ? <Button variant="contained"
              onClick={handleOnClickLeftSubscriptions} sx={{minHeight: 295}}>
                &lt;
            </Button> :
              <Button variant="contained" sx={{visibility: 'hidden'}}>
                &lt;
              </Button>}
            {currentSubs.map((currentSub) => {
              return (
                <SubscriptionGridItem
                  key={'key'}
                  allSubs={allSubs} setAllSubs={setAllSubs}
                  rpost={currentSub} user={userId}/>
              );
            })}
            {currentSubs.length === 3 && <Button variant="contained"
              onClick={handleOnClickRightSubscriptions}>&gt;</Button>}
          </Grid>
        </CardContent>
        }

        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={12} spacing={2}>
              <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
                Current Offers
              </Typography>
            </Grid>

            <Grid container xs={12} spacing={2}>
              {newRestaurants.map((restaurant) =>
                <RestaurantGridItem
                  key={'key'}
                  allSubs={allSubs} setAllSubs={setAllSubs}
                  rpost={restaurant} user={userId} />)}
            </Grid>

            <Grid xs={12} spacing={2}>
              <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
                New Restaurants
              </Typography>
            </Grid>
            <Grid container xs={12} spacing={2}>
              {newRestaurants.map((restaurant) =>
                <RestaurantGridItem
                  key={'key'}
                  allSubs={allSubs} setAllSubs={setAllSubs}
                  rpost={restaurant} user={userId} />)}
            </Grid>
            <Grid xs={12} spacing={2}>
              <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
                Suggestions For You
              </Typography>
            </Grid>
            <Grid container xs={12} spacing={2}>
              {newRestaurants.map((restaurant) =>
                <RestaurantGridItem
                  key={'key'}
                  allSubs={allSubs} setAllSubs={setAllSubs}
                  rpost={restaurant} user={userId} />)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

/**
 *
 * @param {*} props
 * @return {JSX}
 */
function RestaurantGridItem(props) {
  return (
    <Grid xs={4} spacing={2}>
      <RestaurantPost allSubs={props.allSubs} setAllSubs={props.setAllSubs}
        rpost={props.rpost} user={props.user}/>
    </Grid>
  );
}

/**
 *
 * @param {*} props
 * @return {JSX}
 */
function SubscriptionGridItem(props) {
  return (
    <Grid xs={3.33} spacing={2}>
      <RestaurantPost allSubs={props.allSubs} setAllSubs={props.setAllSubs}
        rpost={props.rpost} user={props.user} />
    </Grid>
  );
}
