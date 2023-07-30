import {useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

import tempImage from '../home/paella.jpg';
import tempLayout from './tempLayout.png';
import {
  RestaurantReviewGridItem,
  RestaurantPostGridItem,
} from './RestaurantGridItem';

/**
 *  Loads reviews from backend (TODO: currently unknown how many
 *  we want to load / display at once)
 * @return {List} reviews
 */
function loadReviews() {
  const tempData = [
    {
      author: 'John Smith',
      review:
        'Delicious food, friendly staff, and cozy ambiance. ' +
        'A perfect place to enjoy a delightful dining experience.',
    },
    {
      author: 'Emily Johnson',
      review:
        'Excellent service and mouthwatering dishes. ' +
        'The flavors danced on my palate. I\'ll definitely be back for more!',
    },
    {
      author: 'Michael Williams',
      review:
        'Top-notch restaurant with a diverse menu. ' +
        'The presentation was artful, and the taste was simply divine.',
    },
    {
      author: 'Sophia Brown',
      review:
        'A gem of a restaurant! The fusion of flavors was extraordinary, ' +
        'leaving me craving for another visit.',
    },
    {
      author: 'Daniel Lee',
      review:
        'Impeccable service, elegant decor, and the food was a symphony of ' +
        'flavors. An outstanding culinary experience!',
    },
    {
      author: 'Olivia Martinez',
      review:
        'A culinary masterpiece! The dishes were both visually stunning and ' +
        'incredibly delicious. Highly recommended!',
    },
    {
      author: 'William Taylor',
      review:
        'An exceptional dining experience. Every bite was a revelation of ' +
        'flavors. I can\'t wait to return!',
    },
    {
      author: 'Ava Anderson',
      review:
        'Charming atmosphere, impeccable service, and a menu that satisfies ' +
        'all tastes. A restaurant worth revisiting.',
    },
    {
      author: 'James Johnson',
      review:
        'Incredible attention to detail. The restaurant\'s commitment to ' +
        'quality shines through in every dish.',
    },
    {
      author: 'Emma Clark',
      review:
        'A true culinary delight! From appetizers to desserts, each dish ' +
        'was a work of art.',
    },
  ];

  return tempData;
}

/**
 *  From loaded list display the given review at given index to count
 *  If count is not possible from index display the most possible
 *  if index fails then fail
 * @param {*} reviewList
 * @param {*} index
 * @param {*} count
 * @return {List}
 */
function loadDisplayReviews(reviewList, index, count) {
  return reviewList.slice(index, index + count);
}

/**
 *
 * @param {*} restaurantId
 * @return {List} posts
 */
function loadPosts(restaurantId) {
  const tempData = [
    {
      title: 'Sensational Fusion',
      post: 'An exceptional fusion of flavors that took my taste ' +
      'buds on a thrilling adventure. A must-visit culinary destination.',
    },
    {
      title: 'Rustic Charm',
      post: 'A charming eatery with rustic decor, and the dishes were ' +
      'heartwarming. A delightful experience reminiscent of home.',
    },
    {
      title: 'Oceans Bounty',
      post: 'Savoring the freshest seafood delights by the ocean. The ' +
      'delectable dishes had a delightful taste of the sea.',
    },
    {
      title: 'Culinary Elegance',
      post: 'Elegance on a plate! From presentation to taste, each dish ' +
      'exuded sophistication, making it a truly refined experience.',
    },
    {
      title: 'Aromatic Indulgence',
      post: 'A sensory journey of tantalizing aromas and bold flavors. ' +
      'An indulgence that left a lasting impression on my palate.',
    },
    {
      title: 'Wholesome Delights',
      post: 'Wholesome ingredients transformed into delightful dishes ' +
      'that left me feeling nourished and satisfied. Health and taste ' +
      'combined!',
    },
    {
      title: 'Flavors of the Orient',
      post: 'Embarked on a culinary trip to the Orient. Authentic dishes ' +
      'with bold spices made for an unforgettable gastronomic experience.',
    },
    {
      title: 'Cozy Culinary Haven',
      post: 'Found a cozy haven for food enthusiasts. The warm ambiance ' +
      'paired with delectable dishes made for a perfect dining escape.',
    },
    {
      title: 'Gourmet Artistry',
      post: 'Every plate was an exquisite work of culinary art, ' +
      'elevating the dining experience into a true gourmet indulgence.',
    },
    {
      title: 'A Symphony of Sweets',
      post: 'Indulged in a symphony of sweet delights. From delicate ' +
      'pastries to luscious desserts, it was a heavenly treat.',
    },
  ];
  return tempData;
}

/**
 * @return {JSX} Restaurant Profile component
 */
export default function RestaurantProfile() {
  const {restaurantId} = useParams();

  const currentReviews = loadReviews(restaurantId);
  const [indexReviews, setIndexReviews] = useState(0);
  const countReviews = 3;
  const [displayReviews, setDisplayReviews] = useState([]);

  const currentPosts = loadPosts(restaurantId);

  // setDisplayReviews(loadDisplayReviews(currentReviews, 0, 3))

  useEffect(() => {
    /*
     *  Whenever the indexReviews is toggled, load displayReviews
     *  with current index
     */
    setDisplayReviews(
        loadDisplayReviews(currentReviews, indexReviews, countReviews),
    );
  }, [indexReviews]);

  // Menu DONE
  // Reviews DONE
  // Booking DONE
  // Previous Post

  return (
    <Container maxWidth="lg">
      <Card sx={{mb: 2}}>
        <CardContent>
          <Typography sx={{fontSize: 45}} color="text.primary" gutterBottom>
            {restaurantId}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid xs={6}>
          <Card>
            <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
              Menu
            </Typography>
            <CardMedia
              sx={{height: 140}}
              component="img"
              image={tempImage} // TODO get actual image
              title="Logo of this Restaurant"
            />
          </Card>
        </Grid>
        <Grid xs={6}>
          <Card>
            <CardContent>
              <Typography
                sx={{fontSize: 30}}
                color="text.primary"
                gutterBottom
              >
                Reviews
              </Typography>
              {displayReviews.map((currentReview) => {
                return (
                  <RestaurantReviewGridItem
                    key={currentReview.author}
                    author={currentReview.author}
                    review={currentReview.review}
                  />
                );
              })}
            </CardContent>
            <CardActions>
              {indexReviews !== 0 ? (
                <Button
                  variant="contained"
                  onClick={() =>
                    setIndexReviews((prevIndex) => prevIndex - countReviews)
                  }
                >
                  Last Reviews
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{visibility: 'hidden'}}
                  onClick={() =>
                    setIndexReviews((prevIndex) => prevIndex - countReviews)
                  }
                >
                  Last Reviews
                </Button>
              )}
              {displayReviews.length === 3 && (
                <Button
                  variant="contained"
                  onClick={() =>
                    setIndexReviews((prevIndex) => prevIndex + countReviews)
                  }
                >
                  Next Reviews
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{mb: 2}}>
        <CardContent>
          <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
            Booking
          </Typography>
          <CardMedia
            component="img"
            sx={{height: 400}}
            image={tempLayout} // TODO get actual image
            title="Logo of this Restaurant"
          />
          <TextField label="Book Table (TEMP NOT SURE HOW WE WANT TO DO THIS)"/>
        </CardContent>
      </Card>

      <Card sx={{mb: 2}}>
        <CardContent>
          <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
            Posts
          </Typography>

          {currentPosts.map((currentPost) => {
            return (
              <RestaurantPostGridItem
                key={currentPost.title}
                title={currentPost.title}
                post={currentPost.post}
              />
            );
          })}
        </CardContent>
      </Card>
    </Container>
  );
}
