import {useParams} from 'react-router-dom';
import React, {useState, useEffect, useContext} from 'react';


import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

import axios from 'axios';
import tempImage from '../home/paella.jpg';
import tempLayout from './tempLayout.png';
import {RestaurantReviewGridItem, RestaurantPostGridItem} from './RestaurantGridItem';
import {axiosProxy} from '../axios-config/config';
import {UserContext} from '../App.jsx';
// import {useNavigate} from 'react-router-dom';

/**
 *  Loads reviews from backend
 * (TODO: currently unknown how many we want to load / display at once)
 * @param {*} restaurantId
 * @return {*}
 */
function loadReviews(restaurantId) {
  const tempData = [
    {
      'author': 'John Smith',
      'review': 'Delicious food, friendly staff, and cozy ambiance. ' +
      'A perfect place to enjoy a delightful dining experience.',
    },
    {
      'author': 'Emily Johnson',
      'review': 'Excellent service and mouthwatering dishes. ' +
      'The flavors danced on my palate. I\'ll definitely be back for more!',
    },
    {
      'author': 'Michael Williams',
      'review': 'Top-notch restaurant with a diverse menu. ' +
      'The presentation was artful, and the taste was simply divine.',
    },
    {
      'author': 'Sophia Brown',
      'review': 'A gem of a restaurant! The fusion of flavors was extraordinary, ' +
      'leaving me craving for another visit.',
    },
    {
      'author': 'Daniel Lee',
      'review': 'Impeccable service, elegant decor, and the food was a symphony ' +
      'of flavors. An outstanding culinary experience!',
    },
    {
      'author': 'Olivia Martinez',
      'review': 'A culinary masterpiece! The dishes were both visually stunning ' +
      'and incredibly delicious. Highly recommended!',
    },
    {
      'author': 'William Taylor',
      'review': 'An exceptional dining experience. Every bite was a revelation of ' +
      'flavors. I can\'t wait to return!',
    },
    {
      'author': 'Ava Anderson',
      'review': 'Charming atmosphere, impeccable service, and a menu that satisfies ' +
      'all tastes. A restaurant worth revisiting.',
    },
    {
      'author': 'James Johnson',
      'review': 'Incredible attention to detail. The restaurant\'s commitment to ' +
      'quality shines through in every dish.',
    },
    {
      'author': 'Emma Clark',
      'review': 'A true culinary delight! From appetizers to desserts, each dish ' +
      'was a work of art.',
    },
  ];

  return tempData;
}

/**
 *  From loaded list display the given review at given index to count
 *  If count is not possible from index display the most possible,
 *  if index fails then fail
 * @param {*} list List that you want to be sliced
 * @param {*} index The start index
 * @param {*} count How many entries to get
 * @return {List}
 */
function loadDisplay(list, index, count) {
  return list.slice(index, index+count);
}

/**
 *
 * @param {*} restaurantId
 * @return {*}
 */
function loadPosts(restaurantId) {
  const tempData = [
    {
      'title': 'Sensational Fusion',
      'post': 'An exceptional fusion of flavors that took my taste ' +
      'buds on a thrilling adventure. A must-visit culinary destination.',
    },
    {
      'title': 'Rustic Charm',
      'post': 'A charming eatery with rustic decor, and the dishes were ' +
      'heartwarming. A delightful experience reminiscent of home.',
    },
    {
      'title': 'Oceans Bounty',
      'post': 'Savoring the freshest seafood delights by the ocean. ' +
      'The delectable dishes had a delightful taste of the sea.',
    },
    {
      'title': 'Culinary Elegance',
      'post': 'Elegance on a plate! From presentation to taste, each dish ' +
      'exuded sophistication, making it a truly refined experience.',
    },
    {
      'title': 'Aromatic Indulgence',
      'post': 'A sensory journey of tantalizing aromas and bold flavors. ' +
      'An indulgence that left a lasting impression on my palate.',
    },
    {
      'title': 'Wholesome Delights',
      'post': 'Wholesome ingredients transformed into delightful dishes that ' +
      'left me feeling nourished and satisfied. Health and taste combined!',
    },
    {
      'title': 'Flavors of the Orient',
      'post': 'Embarked on a culinary trip to the Orient. Authentic dishes with ' +
      'bold spices made for an unforgettable gastronomic experience.',
    },
    {
      'title': 'Cozy Culinary Haven',
      'post': 'Found a cozy haven for food enthusiasts. The warm ambiance paired ' +
      'with delectable dishes made for a perfect dining escape.',
    },
    {
      'title': 'Gourmet Artistry',
      'post': 'Every plate was an exquisite work of culinary art, elevating the ' +
      'dining experience into a true gourmet indulgence.',
    },
    {
      'title': 'A Symphony of Sweets',
      'post': 'Indulged in a symphony of sweet delights. From delicate pastries ' +
      'to luscious desserts, it was a heavenly treat.',
    },
  ];
  return tempData;
}

// helper function to get the eatery id
/**
 * @return {Int}
 */
async function getEateryId() {
  const result = await axiosProxy.get('api/user/');
  console.log(result);
  const data = result.data;
  const decrypt = jwtDecode(data.token);
  const loginId = decrypt.result.id;

  // get the restaurantId
  const eateryRes = await axiosProxy.get(`api/user/eatery/login/${loginId}`);
  const eateryId = eateryRes.data.data.id;
  return eateryId;
}

/**
 * @param {Int} restaurantId
 * @param {*} setEateryInfo
 * @return {*} Places result in setEateryInfo
 */
async function getEateryInfo(restaurantId, setEateryInfo) {
  try {
    const eateryId = restaurantId;
    const result = await axiosProxy.get(`api/user/eatery/${eateryId}`);
    console.log(result);
    setEateryInfo(result.data.data);
  } catch (error) {
    setEateryInfo({});
  }
  return;
}

/**
 * Stub for editDescription button
 * @return {Boolean}
 */
async function editDescription() {
  const description = prompt('Enter your description:');
  try {
    const eateryId = await getEateryId();

    // insert into the database
    await axios.put('api/user/eatery/description', {
      restaurantId: eateryId,
      description: description,
    });

    console.log('description updated');
  } catch (error) {
    console.log('something is wrong in the database');
    console.log(error);
  }
  return false;
}

/**
 * Stub for editDescription button
 * @param {string} setDes set function for description
 * @return {Boolean}
 */
async function loadDescription(setDes) {
  try {
    /*
    const eateryId = await getEateryId();

    // insert into the database
    setDes(await axios.get('api/user/eatery/description'));


    */
    setDes('Discover a culinary oasis at Savory Bites & Co., '+
    'where passion meets perfection, and every morsel tells '+
    'a tale of delightful flavors. Situated in the heart of '+
    'a bustling city, this enchanting restaurant is a celebration '+
    'of gastronomy, offering an unforgettable dining experience that '+
    'lingers in your memory long after the last bite. As you step '+
    'inside, the ambiance embraces you like a warm hug, a harmonious '+
    'blend of contemporary elegance and rustic charm. The soothing '+
    'color palette, soft lighting, and tasteful decor create an '+
    'inviting setting that beckons you to indulge in the culinary '+
    'wonders that await.');
    console.log('description updated');
  } catch (error) {
    console.log('something is wrong in the database');
    console.log(error);
  }
}

/**
 * Stub for uploadMenu button
 * @return {Boolean}
 */
function uploadMenu() {
  alert('uploadMenu: Pressed uploadMenu');
  return false;
}

/**
 * Stub for uploadSeating button
 * @return {Boolean}
 */
function uploadSeating() {
  alert('uploadSeating: Pressed uploadSeating');
  return false;
}

/**
 * @return {JSX}
 */
export default function RestaurantProfile() {
  const {restaurantId} = useParams();

  const currentReviews = loadReviews(restaurantId);
  const [indexReviews, setIndexReviews] = useState(0);
  const countReviews = 3;
  const [displayReviews, setDisplayReviews] = useState([]);

  const currentPosts = loadPosts(restaurantId);
  const [indexPosts, setIndexPosts] = useState(0);
  const countPosts = 3;
  const [displayPosts, setDisplayPosts] = useState([]);

  const [description, setDescription] = useState('No Description Given');
  const [eateryInfo, setEateryInfo] = useState({});
  // Null: not logged in, true: user, false: restaurant
  const {userContext, setUserContext} = useContext(UserContext);
  // const navigate = useNavigate();

  const noBorderTextField = {
    padding: 0,
    border: 'none',
    outline: 'none',
  };

  // setDisplayReviews(loadDisplayReviews(currentReviews, 0, 3))
  useEffect(() => {
    /**
     *
     */
    async function loading() {
      loadDescription(setDescription);
    }
    /**
     *
     */
    async function checkCookies() {
      try {
        const result = await axiosProxy.get('../api/user/');
        const data = result.data;
        console.log(data.data);
        const decrypt = jwtDecode(data.token);
        if (data.success !== 0) {
          const loginId = decrypt.result.id;
          // get EateryAccount, if no result then it will return an 404 error
          // else it will go to restaurant page
          console.log('should be a restaurant');
          await axiosProxy.get(`../api/user/eatery/login/${loginId}`);
          console.log('is a restaurant');
          setUserContext(false);
        }
      } catch (err) {
        if (err.response) { // not an eatery
          console.log(err.response.data.message);
          console.log(err.response.data);
          console.log('set to true');
          setUserContext(true);
        } else { // not loggedIn
          setUserContext(null);
          // navigate('/');
          console.log('Not logged in');
        }
      }
    }
    checkCookies();
    loading();
    getEateryInfo(restaurantId, setEateryInfo);
  }, [setUserContext]);

  useEffect(() => {
    /*
    * Whenever the indexReviews is toggled,
    * load displayReviews with current index
    */
    setDisplayReviews(loadDisplay(
        currentReviews, indexReviews, countReviews,
    ));
  }, [indexReviews]);

  useEffect(() => {
    /*
    * Whenever the indexReviews is toggled,
    * load displayReviews with current index
    */
    setDisplayPosts(loadDisplay(
        currentPosts, indexPosts, countPosts,
    ));
  }, [indexPosts]);

  // Menu DONE
  // Reviews DONE
  // Booking DONE
  // Previous Post

  return (
    <Container maxWidth="lg">
      <Card sx={{mb: 2}}>
        <CardContent>
          <Typography sx={{fontSize: 45}} color="text.primary" gutterBottom>
            {eateryInfo.name}
          </Typography>
        </CardContent>

      </Card>

      <Grid container spacing={2}>
        <Grid xs={6}>
          <Card sx={{minHeight: 640}}>
            <CardContent>
              <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
                Description
              </Typography>
              <Card sx={{minHeight: 300, display: 'flex',
                flexDirection: 'column', padding: 2}}>
                {userContext && <Typography sx={{fontSize: 16}}
                  color="text.primary" gutterBottom>
                  {description}
                </Typography>}

                {!userContext && <TextField multiline InputProps={{style:
                  noBorderTextField}} id="outlined-basic" value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}/>}
              </Card>
            </CardContent>
            <CardActions>
              <Button variant="contained"
                onClick={() =>
                  editDescription(description)}>
                Update Description
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid xs={6}>
          <Card sx={{minHeight: 680, display: 'flex', flexDirection: 'column'}}>
            <CardContent>
              <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
                            Reviews
              </Typography>
              {displayReviews.map((currentReview) => {
                return (
                  <RestaurantReviewGridItem
                    key={'key'}
                    author={currentReview.author}
                    review={currentReview.review}/>
                );
              })}
            </CardContent>
            <CardActions disableSpacing sx={{mt: 'auto'}}>
              {indexReviews !== 0 ? <Button variant="contained"
                onClick={() => setIndexReviews((prevIndex) => prevIndex - countReviews)}>
                  Last Reviews
              </Button> :
                <Button variant="contained" sx={{visibility: 'hidden'}}
                  onClick={() =>
                    setIndexReviews((prevIndex) => prevIndex - countReviews)}>
                  Last Reviews
                </Button> }
              {displayReviews.length === 3 &&
                <Button variant="contained"
                  onClick={() =>
                    setIndexReviews((prevIndex) => prevIndex + countReviews)}>
                    Next Reviews
                </Button>}
            </CardActions>
          </Card>
        </Grid>
        <Grid xs={6}>
          <Card sx={{maxWidth: '100%', display: 'flex', flexDirection: 'column'}}>
            <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
              Menu
            </Typography>
            <CardMedia
              sx={{minHeight: 140}}
              component="img"
              image={tempImage} // TODO get actual image
              title="The Menu"
            />
          </Card>
          {!userContext && <CardActions>
            <Button variant="contained" onClick={() => {
              uploadMenu();
            }}>Update Menu</Button>
          </CardActions>}
        </Grid>
        <Grid xs={6}>
          <Card sx={{minHeight: 605, display: 'flex', flexDirection: 'column'}}>
            <CardContent>
              <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
                Posts
              </Typography>

              {displayPosts.map((currentPost) => {
                return (
                  <RestaurantPostGridItem key={currentPost.title}
                    title={currentPost.title} post={currentPost.post}
                  />
                );
              })}
            </CardContent>
            <CardActions disableSpacing sx={{mt: 'auto'}}>
              {indexPosts !== 0 ? <Button variant="contained"
                onClick={() => setIndexPosts((prevIndex) => prevIndex - countPosts)}>
                  Last Posts
              </Button> :
                <Button variant="contained" sx={{visibility: 'hidden'}}
                  onClick={() =>
                    setIndexPosts((prevIndex) => prevIndex - countPosts)}>
                  Last Posts
                </Button> }
              {displayPosts.length === 3 &&
                <Button variant="contained"
                  onClick={() =>
                    setIndexPosts((prevIndex) => prevIndex + countPosts)}>
                    Next Posts
                </Button>}
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
          <TextField label="Book Table (TEMP NOT SURE HOW WE WANT TO DO THIS)" />
        </CardContent>
        {!userContext && <CardActions>
          <Button variant="contained" onClick={() => {
            uploadSeating();
          }}>Update Seating</Button>
        </CardActions>}
      </Card>


    </Container>
  );
}

