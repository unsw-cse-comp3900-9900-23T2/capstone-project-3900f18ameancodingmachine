import * as React from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import paella from './paella.jpg'


export default function RestaurantPost(props) {
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
        </CardActions>
      </Card>
    </Container>
  );
}