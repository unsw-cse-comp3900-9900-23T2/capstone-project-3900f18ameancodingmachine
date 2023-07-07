import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import axios from 'axios';

export default function UserHomePage() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // TODO get from backend

  React.useEffect(() => {
    async function checkLogin() {
      try {
        const result = await axios.get('api/user/'); // use checkToken as middleware to verify token
        let data = result.data;
        if (data.success !== 0) {
          setIsLoggedIn(true)
          console.log("is logged in")
        }
      } catch (err) {
        // error when checking token using checktoken
        console.log("Not logged in")
      }
      
    }
    checkLogin()
  })

  return (
    <Container maxWidth="lg">
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            User Home
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}