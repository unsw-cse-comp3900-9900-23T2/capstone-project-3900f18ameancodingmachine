import * as React from 'react';

import Container from '@mui/material/Container';
import UserHomePage from './UserHomePage';
import RestaurantHomePage from './RestaurantHomePage';
import axios from 'axios';

export default function HomePage() {
  // Null if not logged in, True if Restaurant manager, False if User
  const [isRestaurant, setIsRestaurant] = React.useState(null); // TODO get from backend

  React.useEffect(() => {
    async function checkCookies() {
      try {
        // const login = await axios.post('api/user/login', {login: "restaurantAcc", password: "password"});
        // get the loginId
        const result = await axios.get('api/user/');
        let data = result.data;
        if (data.success !== 0) {
          let loginId = data.token.result.id;
          console.log(loginId)
          // get EateryAccount, it no result then it will return an error
          // else it will go to restaurant page
          const account = await axios.get(`api/user/eatery/${loginId}`)
          setIsRestaurant(true)
        }
      } catch (err) {
        // if not eatery then it is a user
        if (err.response.status === 404) {
          setIsRestaurant(false)
        }
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