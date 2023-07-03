import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default function UserHomePage() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // TODO get from backend

  React.useEffect(() => {
    async function checkCookies() {
      try {
        // return token
        const result = await axios.get('api/user/');
        let data = result.data;
        // const decrypted = jwt_decode(data.token)
        if (data.success !== 0) {
          setIsLoggedIn(true)
        }
      } catch (err) {
        // not do anything
      }
      
    }
    checkCookies()
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