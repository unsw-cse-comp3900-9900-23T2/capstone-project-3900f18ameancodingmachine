import React, {useState, useContext, useEffect} from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import {UserContext} from '../App.jsx';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

import profilePic from '../profile.png';
import RestaurantPost from '../home/RestaurantPost';

// function getRestaurantPosts() {
//   // TODO get from backend
// }

// get all of the restaurant and the cuisines from the database
const n = 4; // change the number depending on the requirements

let loginId; let userId;

/**
 *
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
 * @return {List}
 */
async function getLatestEateries() {
  const getEateries = await axios.get('api/user/eatery/all');
  let eateries = getEateries.data.results;
  eateries = eateries.filter((eatery, index) => {
    // filter duplicate value based on their id on whether it matches
    // the array index
    return eateries.findIndex((e) => e.id === eatery.id) === index;
  });
  console.log(eateries);
  let newEateries = eateries.sort((a, b) => b.id - a.id).slice(0, n);

  newEateries = newEateries.map((eatery) => ({
    key: eatery.id,
    user: userId || null,
    id: eatery.id,
    name: eatery.name,
    cuisine: eatery.cuisine || 'not added',
    location: eatery.suburb,
    image: eatery.image,
  }));
  return newEateries;
}

/**
 * @return {JSX}
 */
export default function UserProfile() {
  // Null: not logged in, true: user, false: restaurant
  const {userContext, setUserContext} = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [imageUrl, setImageUrl] = useState(profilePic);
  const [allSubs, setAllSubs] = useState([]);
  const [newRestaurants, setNewRestaurants] = useState([]);
  const [cuisineList, setCuisineList] = useState([]);
  console.log(userContext, cuisineList);

  /**
   *
   * @param {*} event
   */
  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    /**
     * check whether user has a token
     * if user has a token, user is logged in
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
          // get the address
          const addressId = getUserId.data.data[0].address;
          const getUserAddress = (await axios.get(`api/user/address/${addressId}`)).data;
          getUserId.data.data[0].address =
          getUserAddress.data.street +
          ', ' +
          getUserAddress.data.suburb +
          ', ' +
          getUserAddress.data.region;
          setAllSubs(await getUserSubscribers());
          console.log('User data');
          setUserData(getUserId.data.data[0]);
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
  }, [setUserContext, setUserData]);

  if (!userData) {
    return <></>;
  }

  return (
    <Container maxWidth="lg">
      <Card sx={{minWidth: 175}} square>
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
                  {userData.first}&apos;s User Profile
                </Typography>
              </Box>
            </Grid>
            <Grid xs={12}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Avatar
                  alt="Batman"
                  src={imageUrl}
                  sx={{width: 200, height: 200}}
                />
              </Box>
            </Grid>
            <Grid xs={12}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Button variant="outlined" component="label" onClick={() => {}}>
                  Update Image
                  <input hidden accept="image/*" type="file" onChange={handleFileUpload}/>
                </Button>
              </Box>
            </Grid>
            <Grid container spacing={2} xs={12}>
              <Grid xs={3}></Grid>
              <Grid xs={3}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography sx={{fontSize: 18, fontWeight: 'bold'}}
                    color="text.primary" gutterBottom>
                    First
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={3}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography sx={{fontSize: 18}} color="text.primary" gutterBottom>
                    {userData.first}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={3}></Grid>
              <Grid xs={3}></Grid>
              <Grid xs={3}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography sx={{fontSize: 18, fontWeight: 'bold'}}
                    color="text.primary" gutterBottom>
                    Last
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={3}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography sx={{fontSize: 18}} color="text.primary" gutterBottom>
                    {userData.last}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={3}></Grid>
              <Grid xs={3}></Grid>
              <Grid xs={3}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography sx={{fontSize: 18, fontWeight: 'bold'}}
                    color="text.primary" gutterBottom>
                    Address
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={3}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography sx={{fontSize: 18}} color="text.primary" gutterBottom>
                    {userData.address}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={3}></Grid>
            </Grid>
            <Grid xs={12}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Button variant="outlined" onClick={() => {}}>Edit</Button>
              </Box>
            </Grid>
            <Grid xs={12}></Grid>
            <Grid container spacing={2} xs={12}>
              <Grid xs={12}></Grid>
              <Grid container spacing={2} xs={12}>
                <Typography sx={{fontSize: 20, fontWeight: 'bold'}}
                  color="text.primary" gutterBottom>
                  Posts from your subscriptions
                </Typography>
              </Grid>
              {
                newRestaurants.map((restaurant) =>
                  <Grid xs={6} key={'key'}>
                    <RestaurantPost
                      allSubs={allSubs} setAllSubs={setAllSubs}
                      rpost={restaurant} user={userId}/>
                  </Grid>,
                )
              }
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
