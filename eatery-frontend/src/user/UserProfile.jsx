import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { UserContext } from '../App.jsx';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

import profile_pic from '../profile.png';
import RestaurantPost from '../home/RestaurantPost';

function getRestaurantPosts() {
  // TODO get from backend
}

export default function UserProfile() {
  // Null: not logged in, true: user, false: restaurant
  const { userContext, setUserContext } = useContext(UserContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [restaurantPosts, setRestaurantPosts] = useState([1,2]);

  let loginId, userId;

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
          console.log("User data")
          setUserData(getUserId.data.data[0])
          setUserContext(true)
          console.log("is logged in")
        }
      } catch (err) {
        // error when checking token using checktoken
        setUserContext(null);
        console.log("Not logged in")
      }
    }
    loading()
  }, [setUserContext, setUserData])

  if (!userData) {
    return <></>
  }

  return (
    <Container maxWidth="lg">
      <Card sx={{ minWidth: 175 }} square>
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
                  {userData.first}'s User Profile
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
                  src={profile_pic}
                  sx={{ width: 200, height: 200 }}
                />
              </Box>
            </Grid>
            <Grid xs={12}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Button variant="outlined" onClick={() => {}}>Update Image</Button>
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
                  <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} color="text.primary" gutterBottom>
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
                  <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
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
                  <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} color="text.primary" gutterBottom>
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
                  <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
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
                  <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} color="text.primary" gutterBottom>
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
                  <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
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
                <Typography sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                  Posts from your subscriptions
                </Typography>
              </Grid>
              {
                restaurantPosts.map((post) => 
                  <Grid xs={6}>
                    {/* TODO */}
                    <RestaurantPost key={"id"} id={"id"} user={"userId"} name={"name"} cuisine={"cuisine"} location={"location"}/>
                  </Grid>
                )
              }
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
