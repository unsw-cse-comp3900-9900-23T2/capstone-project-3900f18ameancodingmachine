/* eslint-disable react/prop-types */
import * as React from 'react';

import {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import paella from './paella.jpg';
import axios from 'axios';

/**
 *
 * @param {*} props
 * @return {JSX}
 */
export default function RestaurantPost(props) {
  // to preserve the state on whether the user has subscribed or not
  // store the state in key-value pair where key -> subscribe(userId)(restaurantId)
  const restaurantPost = props.rpost;
  const restaurantId = restaurantPost.id;
  const userId = props.user;

  const [isSubscribed, setIsSubscribed] = useState(() => {
    // Compare ID to determin if items is subscribed or not
    return props.allSubs.some((item) => restaurantPost.id === item.id);
  });

  useEffect(() => {
    setIsSubscribed(() => {
      // Compare ID to determin if items is subscribed or not
      return props.allSubs.some((item) => restaurantPost.id === item.id);
    });
  }, [props.allSubs]);

  /**  TODO
   *  Function to subscribe user
   */
  async function userSubscribe() {
    if (!userId) {
      alert('need to sign in first');
      return;
    }

    try {
      await axios.put('api/user/subscribe', {
        userId: userId,
        restaurantId: restaurantId,
      });
      console.log('subscribed');
      setIsSubscribed(true);
      props.setAllSubs([...props.allSubs, restaurantPost]);
    } catch (error) {
      if (error.response.status === 409) {
        alert('already subscribed');
      } else {
        console.log(error);
      }
    }
  }

  /**
   *  Function to unsubscribe user
   */
  async function userUnSubscribe() {
    try {
      await axios.put('api/user/unsubscribe', {
        userId: userId,
        restaurantId: restaurantId,
      });
      console.log('unsubscribed');
      setIsSubscribed(false);
      props.setAllSubs(props.allSubs.filter(
          (restaurant) => restaurant.id !== restaurantId),
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container maxWidth="sm">
      <Card sx={{minWidth: 100}}>
        <CardMedia
          sx={{height: 140}}
          // component="img"
          component={NavLink}
          to={`/RestaurantProfile/${restaurantId}`}
          image={restaurantPost.image || paella}
          title="Paella"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {restaurantPost.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {restaurantPost.cuisine} | {restaurantPost.location}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small" component={NavLink}
            to={`/RestaurantProfile/${restaurantId}`}>Learn More</Button>
          {userId && (isSubscribed ?
            <Button size="small" onClick={userUnSubscribe}>
              Unsub
            </Button> :
            <Button size="small" onClick={userSubscribe}>Sub</Button>)}
        </CardActions>
      </Card>
    </Container>
  );
}
