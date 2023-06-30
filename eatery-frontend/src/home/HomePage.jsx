import * as React from 'react';

import Container from '@mui/material/Container';
import UserHomePage from './UserHomePage';
import RestaurantHomePage from './RestaurantHomePage';
import axios from 'axios';

export default function HomePage() {
  // Null if not logged in, True if Restaurant manager, False if User
  const [isRestaurant, setIsRestaurant] = React.useState(null); // TODO get from backend
  const results = axios.post('api/user/account', {login: "someone@gmail.com", password: "1500000000000000000000000000"})
                  .then((res) => {return res})
                  .catch((err) => console.log("not good"));
  console.log(results);
 
  
  return (
    // Defaults to User Home Page if not logged in
    <Container maxWidth="lg">
      {isRestaurant  && <RestaurantHomePage/>}
      {!isRestaurant && <UserHomePage/>}
    </Container>
  );
}