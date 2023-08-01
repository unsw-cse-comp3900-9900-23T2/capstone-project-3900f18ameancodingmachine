/* eslint-disable react/prop-types */
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

/**
 *
 * @param {*} props
 * @return {JSX}
 */
export function RestaurantReviewGridItem(props) {
  return (
    <Container maxWidth="sm">
      <Card sx={{minWidth: 100}}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.review}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Written by: {props.author}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

/**
 *
 * @param {*} props
 * @return {JSX}
 */
export function RestaurantPostGridItem(props) {
  return (
    <Container maxWidth="sm">
      <Card sx={{minWidth: 100}}>

        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {props.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {props.post}
          </Typography>
        </CardContent>

      </Card>
    </Container>
  );
}
