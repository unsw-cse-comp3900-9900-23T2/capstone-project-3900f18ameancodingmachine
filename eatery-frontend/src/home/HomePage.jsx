import * as React from 'react';

import Container from '@mui/material/Container';
import UserHomePage from './UserHomePage';
import RestaurantHomePage from './RestaurantHomePage';

export default function HomePage() {
  // Null if not logged in, True if Restaurant manager, False if User
  const [isRestaurant, setIsRestaurant] = React.useState(null); // TODO get from backend
  
  return (
    // Defaults to User Home Page if not logged in
    <Container maxWidth="lg">
      {isRestaurant  && <RestaurantHomePage/>}
      {!isRestaurant && <UserHomePage/>}
    </Container>
  );
}