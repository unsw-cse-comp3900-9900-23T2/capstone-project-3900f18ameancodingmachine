import { useState, useContext, useEffect } from 'react';

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
import { UserContext } from '../App.jsx';
import RestaurantPost from './RestaurantPost'
import jwt_decode from 'jwt-decode';
import axios from 'axios';

// get all of the restaurant and the cuisines from the database
const n = 4 // change the number depending on the requirements
const getCuisine = await axios.get('api/user/eatery/cuisines')
const cuisines = getCuisine.data.results
const getEateries = await axios.get('api/user/eatery/all')

const eateries = getEateries.data.results
// top n eateries account that is recently created
// since eatery id is auto increment, sort by id in descending order
const latestEateries = eateries.sort((a, b) => b.id - a.id).slice(0, n)
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

let eateriesSubscribed = []
let latestEateriesArr = []
/*
 * TODO: Stub for loadSubscriptions button
 *  curSubs is a local array which will return the results of the function
 *  index is an int which will tell the database where to start returning subscriptions from
 *  count is an int which will tell the database how many subscriptions from index to return
 *    if count = 0, load all ***even if index is invalid*** 
 * 
 *  If the index does not exist return an error
 *  If the count is not completeble, return as many as possible
 *  For example
 *        loadSubscriptions(curSubs, 2, 3) => curSubs = (Database[2], Database[3], Database[4])
 *  2nd example
 *        Database only has 4 entries from 0 to 3
 *        loadSubscriptions(curSubs, 2, 3) => curSubs = (Database[2], Database[3])
 * 
 *  3rd example
 *        Database only has 4 entries from 0 to 3
 *        loadSubscriptions(curSubs, 4, 2) => ERROR (Not sure exactly how this error should be handled)
 * 
 */
function loadSubscriptions(setCurrentSubs, index, count) {
  let fullyLoadedData = eateriesSubscribed
  console.log(fullyLoadedData)
  if (count === 0) {
    setCurrentSubs(fullyLoadedData);
    return;
  }
  setCurrentSubs(fullyLoadedData.slice(index, index+count));
  return;
  
}

async function getLatestEateries()  {
  const getEateries = await axios.get('api/user/eatery/all')
  const eateries = getEateries.data.results
  let newEateries = eateries.sort((a, b) => b.id - a.id).slice(0, n)

  newEateries = newEateries.map(eatery => ({
    key: eatery.id, 
    user: userId || null, 
    id: eatery.id, 
    name: eatery.name, 
    cuisine: eatery.cuisine || "not added", 
    location: eatery.suburb
  }))
  return newEateries
}

export default function UserHomePage() {
  // Null: not logged in, true: user, false: restaurant
  const { userContext, setUserContext } = useContext(UserContext);
  
  const [viewSubscriptions, setViewSubscriptions] = useState(false);
  const [currentSubs, setCurrentSubs] = useState([]);
  const [currentSubsIndex, setCurrentSubsIndex] = useState(0);
  const [currentSubsCount, setCurrentSubsCount] = useState(3);

  const [newRestaurants, setNewRestaurants] = useState([])

  const [location, setLocation] = useState(null);
  const [cuisine, setCuisine] = useState(null);
  const [dietary, setDietary] = useState(null);

  useEffect(() => {
    /* check whether user has a token
    if user has a token, user is logged in */
    async function loading() {
      try {
        const result = await axios.get('api/user/'); // use checkToken as middleware to verify token
        let data = result.data;
        if (data.success !== 0) {
          const decrypt = jwt_decode(data.token)
          loginId = decrypt.result.id;
          const getUserId = await axios.get(`api/user/login/${loginId}`)
          userId = getUserId.data.data[0].id
          eateriesSubscribed = await getUserSubscribers()
          setUserContext(true)
          console.log("is logged in")
        }
      } catch (err) {
        // error when checking token using checktoken
        setUserContext(null);
        console.log("Not logged in")
      }
      
      latestEateriesArr = await getLatestEateries()
      setNewRestaurants(latestEateriesArr)
    }
    loading()
  }, [setUserContext])

  useEffect(() => {
    /*
     *  Whenever the currentSubsIndex is toggled, load subscriptions with current index
     */
    loadSubscriptions(setCurrentSubs, currentSubsIndex, currentSubsCount);
  }, [currentSubsIndex]);

  function handleOnClickViewSubscriptions(){
    loadSubscriptions(setCurrentSubs, currentSubsIndex, currentSubsCount);
    setViewSubscriptions(true);
  };

  function handleOnClickRightSubscriptions(){
    setCurrentSubsIndex((prevIndex) => prevIndex + 3);
    loadSubscriptions(setCurrentSubs, currentSubsIndex, currentSubsCount);
  };

  function handleOnClickLeftSubscriptions(){
    setCurrentSubsIndex((prevIndex) => Math.max(prevIndex - 3, 0))
    loadSubscriptions(setCurrentSubs, currentSubsIndex, currentSubsCount);
  };



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
              <Grid xs={4}>
                <Autocomplete
                  id="dietary-dropdown"
                  value={dietary}
                  options={["lactose free", "gluten free", "vegetarian"]}
                  getOptionLabel={(option) => option}
                  onChange={(event, newValue) => {
                    setDietary(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Dietary" />
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
          {userContext===true && <Button variant="contained" onClick={() => {}}>View Past Bookings</Button>}
          {userContext===true && !viewSubscriptions && <Button variant="contained" onClick={handleOnClickViewSubscriptions}>View Subscriptions</Button>}
          {userContext===true && viewSubscriptions && <Button variant="contained" onClick={() => {setViewSubscriptions(false)}}>Hide Subscriptions</Button>}
        </CardActions>
        {
        viewSubscriptions === true &&
        <CardContent sx={{bgcolor: '#FAFAFA', border: "10px groove #61dafb"}}>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            My Subscriptions
          </Typography>
          <Grid sx={{alignSelf: 'center'}} container spacing={2}>
            {currentSubsIndex !== 0 ? <Button variant="contained" onClick={handleOnClickLeftSubscriptions} sx={{minHeight: 295}}>&lt;</Button> : <Button variant="contained" sx={{visibility:'hidden'}} >&lt;</Button>}
            {currentSubs.map(currentSub => {
              return (     
                <SubscriptionGridItem key={currentSub.id} user={userId} id={currentSub.id} name={currentSub.name} cuisine={currentSub.cuisine} location={currentSub.location}/>
              );
            })}
            {currentSubs.length === 3 && <Button variant="contained" onClick={handleOnClickRightSubscriptions}>&gt;</Button>}
          </Grid>
        </CardContent>
        }


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
              {newRestaurants.map((restaurant) => <RestaurantGridItem key={restaurant.id} id={restaurant.id} user={userId} name={restaurant.name} cuisine={restaurant.cuisine || "unknown"} location={restaurant.suburb || restaurant.region}/>)}
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
      <RestaurantPost key={props.id} id={props.id} user={props.user} name={props.name} cuisine={props.cuisine} location={props.location} />
    </Grid>
  );
}

function SubscriptionGridItem(props) {
  return (
    <Grid xs={3.33} spacing={2}>
      <RestaurantPost key={props.id} id={props.id} user={props.user} name={props.name} cuisine={props.cuisine} location={props.location} />
    </Grid>
  );
}