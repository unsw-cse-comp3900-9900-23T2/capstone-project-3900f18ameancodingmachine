import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export function RestaurantReviewGridItem(props){

    return(
    <Container maxWidth="sm">
      <Card sx={{ minWidth: 100 }}>

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
    )
}

export function RestaurantPostGridItem(props){

  return(
  <Container maxWidth="sm">
    <Card sx={{ minWidth: 100 }}>

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
  )
}