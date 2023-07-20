import * as React from 'react';

import { useState } from 'react';

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
  // to preserve the state on whether the user has subscribed or not
  // store the state in key-value pair where key -> subscribe(userId)(restaurantId)
  const restaurantId = props.id
  const userId = props.user
  const mainKey = `subscribe`
  const uid = mainKey.concat('', userId, restaurantId)

  const [isSubscribed, setIsSubscribed] = useState(() => {
    const subscribedState = localStorage.getItem(uid)
    if (subscribedState !== null) {
      return subscribedState
    }
    return false;
  });

  /*  TODO
   *  Function to subscribe user
   */
  async function userSubscribe() {

    if (!userId) {
      alert("need to sign in first")
      return 
    }
    
    try {
      await axios.put('api/user/subscribe', {
        userId: userId,
        restaurantId: restaurantId
      })
      console.log("subscribed")
      setIsSubscribed(true)
      localStorage.setItem(uid, true)
    } catch (error) {
      if (error.response.status === 409) {
        alert("already subscribed")
      } else {
        console.log(error) 
      }
    }
  }
  
  /*
   *  Function to unsubscribe user
   */
  async function userUnSubscribe() {
    try {
      await axios.put('api/user/unsubscribe', {
        userId: userId,
        restaurantId: restaurantId
      })
      console.log("unsubscribed")
      setIsSubscribed(false)
      localStorage.setItem(uid, false)
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
          {userId && (isSubscribed ? <Button size="small" onClick={userUnSubscribe}>Unsub</Button> : <Button size="small" onClick={userSubscribe}>Sub</Button>)}
        </CardActions>
      </Card>
    </Container>
  );
}