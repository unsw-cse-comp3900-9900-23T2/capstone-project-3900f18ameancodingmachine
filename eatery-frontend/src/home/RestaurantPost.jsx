import * as React from 'react';

import { useState} from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import paella from './paella.jpg'
import axios from 'axios';


export default function RestaurantPost(props) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const restaurantId = props.id
  const userId = props.user
  /*  TODO
   *  Function to subscribe user
   *  I believe you should be able to use the props variable to pass in an id to access the correct voucher 
   */
  async function userSubscribe() {
    try {
      await axios.put('api/user/subscribe', {
        userId: userId,
        restaurantId: restaurantId
      })
      console.log("subscribed")
      setIsSubscribed(true);
    } catch (error) {
      if (error.response.status === 409) {
        console.log("already subscribed")
        setIsSubscribed(true);
      } else {
        console.log(error) 
      }
    }
  }
  
  /*  TODO
   *  Function to unsubscribe user
   */
  async function userUnSubscribe() {
    try {
      await axios.put('api/user/unsubscribe', {
        userId: userId,
        restaurantId: restaurantId
      })
      console.log("unsubscribed")
      setIsSubscribed(false);
    } catch (error) {
      console.log(error) 
    }
  }


  return (
    <Container maxWidth="sm">
      <Card sx={{ minWidth: 100 }}>
        <CardMedia
          sx={{ height: 140 }}
          component="img"
          image={paella} // TODO get actual image
          title="Paella"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.cuisine} | {props.location}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
          {isSubscribed ? <Button size="small" onClick={userUnSubscribe}>Unsub</Button> : <Button size="small" onClick={userSubscribe}>Sub</Button>}
        </CardActions>
      </Card>
    </Container>
  );
}