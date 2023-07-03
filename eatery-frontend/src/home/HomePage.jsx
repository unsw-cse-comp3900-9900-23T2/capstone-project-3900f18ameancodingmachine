import * as React from 'react';

import Container from '@mui/material/Container';
import UserHomePage from './UserHomePage';
import RestaurantHomePage from './RestaurantHomePage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default function HomePage() {
  // Null if not logged in, True if Restaurant manager, False if User
  const [isRestaurant, setIsRestaurant] = React.useState(null); // TODO get from backend

  React.useEffect(() => {
    async function checkCookies() {
      try {
        const result = await axios.get('api/user/');
        let data = result.data;
        const decrypt = jwt_decode(data.token)
        if (data.success !== 0) {
          let loginId = decrypt.result.id;
          console.log(loginId)
          // get EateryAccount, it no result then it will return an 404 error
          // else it will go to restaurant page
          await axios.get(`api/user/eatery/${loginId}`)
          setIsRestaurant(true)
        }
      } catch (err) {
        // if not eatery then it is a user
        console.log(err.response.data.message)
        setIsRestaurant(false)
        // if (err.response.status === 404) {
        //   setIsRestaurant(false)
        // } else {
        //   console.log(err)
        // }
      }
      
    }

    checkCookies()
  })
  
  return (
    // Defaults to User Home Page if not logged in
    <Container maxWidth="lg">
      {isRestaurant  && <RestaurantHomePage/>}
      {!isRestaurant && <UserHomePage/>}
    </Container>
  );
}