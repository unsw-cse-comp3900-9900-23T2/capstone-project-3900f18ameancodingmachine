import * as React from 'react';

import {useState} from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';


import paella from './paella.jpg';
import axios from 'axios';

/**
 * @param {*} props
 * @return {JSX}
 */
export default function BrowsePost(props) {
  BrowsePost.propTypes = {
    id: PropTypes.string,
    user: PropTypes.string,
    cuisine: PropTypes.string,
    location: PropTypes.string,
    name: PropTypes.string,
  };
  const navigate = useNavigate();
  // to preserve the state on whether the user has subscribed or not
  // store the state in key-value pair where key -> subscribe(userId)(restaurantId)
  const restaurantId = props.id;
  const userId = props.user;
  const mainKey = `subscribe`;
  const uid = mainKey.concat('', userId, restaurantId);

  // localStorage.removeItem(uid)
  // console.log(props)
  // console.log(localStorage.getItem(uid))

  const [isSubscribed, setIsSubscribed] = useState(() => {
    const subscribedState = localStorage.getItem(uid);
    return subscribedState ? subscribedState : false;
  });

  /**
   *
   * @return {*}
   */
  async function userSubscribe() {
    if (!userId) {
      return;
    }
    try {
      await axios.put('api/user/subscribe', {
        userId: userId,
        restaurantId: restaurantId,
      });
      setIsSubscribed(true);
      localStorage.setItem(uid, true);
      window.location.reload(false);
    } catch (error) {
      if (error.response.status === 409) {
        alert('already subscribed');
      } else {
        console.log(error);
      }
    }
  }

  /**
   *
   */
  async function userUnSubscribe() {
    try {
      await axios.put('api/user/unsubscribe', {
        userId: userId,
        restaurantId: restaurantId,
      });
      console.log('unsubscribed');
      setIsSubscribed(false);
      localStorage.removeItem(uid);
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <Container maxWidth="sm">
      <Card sx={{minWidth: 100}}>
        <CardMedia
          sx={{height: 140}}
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
          <Button size="small" onClick={async () => {
            navigate('/RestaurantProfile', {state: {id: parseInt(restaurantId)}});
          }}>Learn More</Button>
          {userId && (isSubscribed ? <Button size="small"
            onClick={userUnSubscribe}>Unsub</Button> : <Button size="small"
              onClick={userSubscribe}>Sub</Button>)}
        </CardActions>
      </Card>
    </Container>
  );
}
