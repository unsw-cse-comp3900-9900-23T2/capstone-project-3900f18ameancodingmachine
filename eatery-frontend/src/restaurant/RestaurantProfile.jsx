import {useLocation} from 'react-router-dom';
import React, {useState, useEffect, useContext} from 'react';


import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import jwtDecode from 'jwt-decode';

import axios from 'axios';
import tempImage from '../home/paella.jpg';
import tempLayout from './tempLayout.png';
import {RestaurantReviewGridItem, RestaurantPostGridItem} from './RestaurantGridItem';
import Autocomplete from '@mui/material/Autocomplete';
// import {axiosProxy} from '../axios-config/config';
import {UserContext} from '../App.jsx';
// import {useNavigate} from 'react-router-dom';

import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import TempMenu from './tempMenu.jsx';

/**
 *  Loads reviews from backend
 * (TODO: currently unknown how many we want to load / display at once)
 * @param {*} toSet
 * @param {*} restaurantId
 * @return {*}
 */
async function loadReviews(toSet, restaurantId) {
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
  console.log(tempData);
  // try {
  const reviewArrayProcessed = [];
  const data = await axios.get(`api/user/review/${restaurantId}`);
  const reviewInfoArray = data.data.data;
  // Loop through each reviewInfo in reviewInfoArray
  for (const reviewInfo of reviewInfoArray) {
    const name = await getUserName(reviewInfo.userId);
    // Push name and review as an object into the reviewArrayProcessed
    reviewArrayProcessed.push({
      author: name,
      review: reviewInfo.comment,
    });
  }
  toSet(reviewArrayProcessed.reverse());
  // } catch (error) {
  //  toSet(tempData);
  // }
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
 * @param {*} toSet set function for array which stores posts
 * @param {Int} restaurantId
 * @return {*}
 */
async function loadPosts(toSet, restaurantId) {
  let results = [];
  try {
    const {data} = await axios.get(`api/user/post/${restaurantId}`);
    results = data.data.reverse();
  } catch (error) {
    results = [];
  }
  if (results.length === 0) {
    results.push({
      id: 'N/A',
      postedBy: 'N/A',
      title: 'N/A',
      content: 'N/A',
    });
  }
  toSet(results);
  try {
  } catch (error) {
    alert('something is wrong in the database');
    console.log(error);
    toSet([]);
  }
}

/**
 * @param {Int} restaurantId
 * @param {*} setEateryInfo
 * @return {*} Places result in setEateryInfo
 */
async function getEateryInfo(restaurantId, setEateryInfo) {
  try {
    const eateryId = restaurantId;
    const result = await axios.get(`api/user/eatery/${eateryId}`);
    setEateryInfo(result.data.data);
  } catch (error) {
    console.log('getEateryInfo failed');
    setEateryInfo({});
  }
  return;
}

/**
 *
 * @param {*} restaurantId
 * @param {*} setEateryProfileImage
 */
/*
async function getEateryProfileImage(restaurantId, setEateryProfileImage) {
  try {
    const response = await axios.get(`api/user/eatery/image/profile/${restaurantId}`);
    const imageURL = response.data.results;
    return imageURL;
  } catch (error) {
    return tempImage;
  }
}
*/
/**
 * Stub for editDescription button
 * @param {*} restaurantId
 * @param {String} description
 * @param {*} setSuccess
 * @return {Boolean}
 */
async function editDescription(restaurantId, description) {
  try {
    const eateryId = restaurantId;

    // insert into the database
    await axios.put('api/user/eatery/description', {
      restaurantId: eateryId,
      description: description,
    });

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Stub for editDescription button
 * @param {string} setDes set function for description
 * @param {Int} restId
 * @return {Boolean}
 */
async function loadDescription(setDes, restId) {
  try {
    // insert into the database
    const data = await axios.get(`api/user/eatery/description/${restId}`);
    const description = data.data.results.description;
    setDes(description);
  } catch (error) {
    console.log('something is wrong in the database');
    console.log(error);
  }
}

/**
 * @param {*} toSet
 * @param {Int} restId
*/
async function loadVouchers(toSet, restId) {
  const result = await axios.get(`api/user/eatery/vouchers/${restId}`);
  toSet(result.data.results);
}

/**
 * Limit to given voucher list to the ones avaliable during booking date
 * @param {*} toSet
 * @param {*} allVouchers The list of all available vouchers
 * @param {*} bookingDate Date for the booking
 */
function generateAvailableVoucherList(toSet, allVouchers, bookingDate) {
  // If no booking date provided, show all vouchers
  if (bookingDate == '') {
    toSet(allVouchers);
    return;
  }
  const filteredObjects = allVouchers.filter((obj) =>
    new Date(obj.startOffer) <= bookingDate && new Date(obj.endOffer) >= bookingDate);
  try {
    toSet(filteredObjects);
  } catch (error) {
    toSet([]);
  }
}

/**
 * TODO - Not Working
 * @param {Int} restId
 * @param {Int} userId
 * @param {Int} voucherId
 * @param {Date} date Date for the booking
 */
async function postBooking(restId, userId, voucherId, date) {
  await axios.post('api/user/user/booking', {
    userId: userId,
    restaurantId: restId,
    voucherId: voucherId,
    bookingTime: date,
  });
  return;
}

/**
 * upload new comment, character limit hasn't been implemented yet
 * @param {*} body
 * @param {*} restId
 * @param {*} setError set function for error output
 * @return {Boolean}
 */
async function uploadReview(body, restId, setError) {
  // Guard Statements
  let isError = false;
  setError('');
  if (body === '') {
    setError((prevState) => prevState + 'Enter a comment. ');
    isError = true;
  }
  if (isError) {
    return;
  }

  const userId = await getUserId();

  await axios.post('api/user/reviews', {
    userId: userId,
    restaurantId: restId,
    comment: body,
    rating: '0',
  });
  try {
  } catch (error) {
    alert('something is wrong in the database');
    console.log(error);
  }
  return false;
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

// helper function to get the user id
/**
 * @return {Int}
 */
async function getUserId() {
  try {
    const result = await axios.get('api/user/');
    const data = result.data;
    const decrypt = jwtDecode(data.token);
    const loginId = decrypt.result.id;

    const user = await axios.get(`api/user/login/${loginId}`);
    const userId = user.data.data[0].id;
    return userId;
  } catch (error) {
    return 0;
  }
}

// helper function to get the user name
/**
 * @param {Int} id The user Id you want info on
 * @return {Int}
 */
async function getUserName(id) {
  let userName = 'temp';
  try {
    const result = await axios.get(`api/user/${id}`);
    const data = result.data.data;
    userName = data.first + ' ' + data.last;
  } catch (error) {
    userName = 'Real Person';
  }

  return userName;
}

/**
 * get restaurant table layout from the database
 * @param {Int} restaurantId
 * @param {*} setLayout set the restaurant layout image
 */
async function loadRestaurantLayouts(restaurantId, setLayout) {
  try {
    const response = await axios.get(`api/user/eatery/image/layout/${restaurantId}`);
    const imageUrl = response.data.results;
    setLayout(imageUrl);
  } catch (error) {
    const image = tempLayout;
    setLayout(image);
  }
}

/**
 * @return {JSX}
 */
export default function RestaurantProfile() {
  const {state} = useLocation();
  const restaurantId = state.id;

  const [voucherId, setVoucherId] = useState();
  const [voucherList, setVoucherList] = useState([]);
  const [availableVoucherList, setAvailableVoucherList] = useState([]);

  const [currentReviews, setCurrentReviews] = useState([]);
  const [indexReviews, setIndexReviews] = useState(0);
  const countReviews = 3;
  const [displayReviews, setDisplayReviews] = useState([]);

  const [currentPosts, setCurrentPosts] = useState([]);
  const [indexPosts, setIndexPosts] = useState(0);
  const countPosts = 3;
  const [displayPosts, setDisplayPosts] = useState([]);

  const [description, setDescription] = useState('No Description Given');
  const [restaurantLayout, setRestaurantLayout] = useState(null);
  const [eateryInfo, setEateryInfo] = useState({});
  // Null: not logged in, true: user, false: restaurant
  const {userContext, setUserContext} = useContext(UserContext);

  const [descriptionSuccess, setDescriptionSuccess] = useState(null);

  const [bookingDate, setBookingDate] = useState('');
  const [showPostReview, setShowPostReview] = useState(false);
  const [uploadReviewError, setUploadReviewError] = useState('_');
  const [reviewBody, setReviewBody] = useState('');
  // const [imageUrl, setImageUrl] = useState('');

  const noBorderTextField = {
    padding: 10,
    border: 'none',
    outline: 'none',
  };

  /**
   *
   * @param {*} event
   */
  /*
  async function handleFileUpload(event) {
    const file = event.target.files[0];
    const formData = new FormData();

    const imageURL = URL.createObjectURL(file);
    setImageUrl(imageURL);

    try {
      // key is user-avatar, must be exact
      formData.append('eatery-avatar', file);
      // for request body
      formData.append('restaurantId', restaurantId);
      // store into the database
      await axios.post('/api/user/eatery/image/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.log('Error uploading file into the server');
    }

    // reader
    // reader.onloadend = () => {
    //   setImageUrl(reader.result);
    // };

    // reader.readAsDataURL(file);
  };
  */
  // setDisplayReviews(loadDisplayReviews(currentReviews, 0, 3))
  useEffect(() => {
    /** check whether user has a token
    *   if user has a token, user is logged in
    */
    async function loading() {
      loadDescription(setDescription, restaurantId);
      loadReviews(setCurrentReviews, restaurantId);
      loadPosts(setCurrentPosts, restaurantId);
      loadVouchers(setVoucherList, restaurantId);
      // setImageUrl(getEateryProfileImage(restaurantId));
    }

    /**
     *
     */
    async function checkCookies() {
      try {
        const result = await axios.get('/api/user/');
        const data = result.data;
        const decrypt = jwtDecode(data.token);
        if (data.success !== 0) {
          const loginId = decrypt.result.id;
          // get EateryAccount, if no result then it will return an 404 error
          // else it will go to restaurant page
          await axios.get(`/api/user/eatery/login/${loginId}`);
          setUserContext(false);
        }
      } catch (err) {
        if (err.response) { // not an eatery
          setUserContext(true);
        } else { // not loggedIn
          setUserContext(null);
          navigate('/');
        }
      }
    }
    checkCookies();
    loading();
    loadRestaurantLayouts(restaurantId, setRestaurantLayout);
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
  }, [indexReviews, currentReviews]);

  useEffect(() => {
    /*
    * Whenever the indexReviews is toggled,
    * load displayReviews with current index
    */
    setDisplayPosts(loadDisplay(
        currentPosts, indexPosts, countPosts,
    ));
  }, [currentPosts, indexPosts]);

  useEffect(() => {
    generateAvailableVoucherList(setAvailableVoucherList, voucherList, bookingDate);
  }, [bookingDate, voucherList]);

  /**
   *
   */
  function handleBookingButtonClick() {
    // Call both functions in sequence using try-catch block to handle any errors.
    postBooking(parseInt(restaurantId), parseInt(getUserId()),
        parseInt(voucherId.id), bookingDate);
    loadVouchers(setVoucherList, restaurantId);
  };

  return (
    <Container maxWidth="lg">
      <Card elevation={0} sx={{mb: 2}}>
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
              <Card elevation={0} sx={{minHeight: 300, display: 'flex',
                flexDirection: 'column', padding: 2}}>
                {userContext !== false && <Typography sx={{fontSize: 16}}
                  color="text.primary" gutterBottom>
                  {description}
                </Typography>}

                {userContext === false && <TextField multiline InputProps={{style:
                  noBorderTextField}} id="outlined-basic" value={description}
                onChange={(event) => {
                  setDescriptionSuccess(null);
                  setDescription(event.target.value);
                }}/>}
              </Card>
            </CardContent>
            <CardActions>
              {userContext === false && <Button variant="contained"
                onClick={() =>
                  setDescriptionSuccess(editDescription(
                      restaurantId, description, setDescriptionSuccess))}>
                Update Description
              </Button>}
              {descriptionSuccess &&
                <Typography sx={{fontSize: 20, marginLeft: 'auto'}}
                  color="green" gutterBottom>
                  Description Updated
                </Typography>}
              {descriptionSuccess === false &&
              <Typography sx={{fontSize: 20, marginLeft: 'auto'}}
                color="red" gutterBottom>
                Description Not Updated
              </Typography>}
            </CardActions>
          </Card>
        </Grid>
        <Grid xs={6}>
          <Card sx={{minHeight: 680, display: 'flex', flexDirection: 'column'}}>
            <CardContent style={{flexGrow: 1}}>
              <Button variant="contained"
                disabled={displayPosts.length !== 3}
                onClick={() =>
                  setShowPostReview((prevIndex) => !prevIndex)}>
                    Toggle Review Post
              </Button>
              {showPostReview && <Card>
                <CardContent>
                  <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                    Review
                  </Typography>
                  <TextField sx={{minWidth: 500}} multiline rows={8}
                    required id="body-review"
                    placeholder="Review" value={reviewBody} onChange={(event) => {
                      setReviewBody(event.target.value);
                      setUploadReviewError('_');
                    }}
                  />
                </CardContent>
                <CardActions>
                  <Button variant="contained" onClick={() => {
                    uploadReview(reviewBody, restaurantId, setUploadReviewError);
                    loadReviews(setCurrentReviews, restaurantId);
                  }}>Post</Button>
                  {uploadReviewError == '' &&
                  <Typography sx={{fontSize: 20, textAlign: 'right', marginLeft: 'auto'}}
                    color="green" gutterBottom>
                    Post Created
                  </Typography>}
                  {uploadReviewError !== '_' &&
                  <Typography sx={{fontSize: 14, textAlign: 'right', marginLeft: 'auto'}}
                    color="red" gutterBottom>
                    {uploadReviewError}
                  </Typography>}
                </CardActions>
              </Card>}
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <CardActions sx={{mt: 'auto'}}>
                <Button variant="contained" disabled={indexReviews === 0}
                  onClick={() =>
                    setIndexReviews((prevIndex) => prevIndex - countReviews)}>
                  <NavigateBeforeIcon/>
                </Button>
                <Button variant="contained"
                  disabled={displayReviews.length !== 3}
                  onClick={() =>
                    setIndexReviews((prevIndex) => prevIndex + countReviews)}>
                  <NavigateNextIcon/>
                </Button>
              </CardActions>
            </Box>
          </Card>
        </Grid>
        <Grid xs={6}>
          <Card sx={{maxWidth: '100%', display: 'flex', flexDirection: 'column'}}>
            <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
              Menu
            </Typography>
            <TempMenu/>
            <CardMedia
              sx={{minHeight: 140}}
              component="img"
              image={tempImage} // TODO get actual image
              title="The Menu"
            />
          </Card>
          {userContext === false && <CardActions>
            <Button variant="contained" onClick={() => {
              uploadMenu();
            }}>Update Menu
            </Button>
          </CardActions>}
        </Grid>
        <Grid xs={6}>
          <Card sx={{minHeight: 605, display: 'flex', flexDirection: 'column'}}>
            <CardContent style={{flexGrow: 1}}>
              <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
                Posts
              </Typography>

              {displayPosts.map((currentPost) => {
                return (
                  <RestaurantPostGridItem key={currentPost.postId}
                    title={currentPost.title} post={currentPost.content}
                  />
                );
              })}
            </CardContent>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <CardActions sx={{mt: 'auto'}}>
                <Button variant="contained" disabled={indexPosts === 0}
                  onClick={() =>
                    setIndexPosts((prevIndex) => prevIndex - countPosts)}>
                  <NavigateBeforeIcon/>
                </Button>
                <Button variant="contained"
                  disabled={displayPosts.length !== 3}
                  onClick={() =>
                    setIndexPosts((prevIndex) => prevIndex + countPosts)}>
                  <NavigateNextIcon/>
                </Button>
              </CardActions>
            </Box>
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
            image={restaurantLayout} // TODO get actual image
            title="Logo of this Restaurant"
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Booking Date" value={bookingDate} onChange={(event) => {
              setBookingDate(event);
            }}/>
          </LocalizationProvider>

          {userContext === true &&
            <Autocomplete
              id="voucher-dropdown"
              value={voucherId}
              options={availableVoucherList}
              getOptionLabel={(option) => option.discount && option.startOffer ?
                `Discount: ${option.discount}%, Valid Until: ${option.endOffer}, 
              Remaining: ${option.count}`: ''}
              onChange={(event, newValue) => {
                setVoucherId(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Vouchers" />
              )}
            />
          }

        </CardContent>
        <CardActions>
          {userContext === true &&
            <Button variant="contained" onClick={() => handleBookingButtonClick()}>
              Create Booking</Button>}
          {userContext === false &&
            <Button variant="contained" onClick={() => {
              uploadSeating();
            }}>Update Seating</Button>}
        </CardActions>
      </Card>


    </Container>
  );
}

