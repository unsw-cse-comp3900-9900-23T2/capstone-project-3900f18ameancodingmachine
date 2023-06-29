import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function UserHomePage() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // TODO get from backend
  
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