import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Unstable_Grid2';

import {useNavigate, NavLink} from 'react-router-dom';
// import {axiosProxy} from '../axios-config/config';

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// //HELPER FUNCTIONS////

// helper function to get the eatery id
/**
 * @return {Int}
 */
async function getEateryId() {
  const result = await axios.get('api/user/');
  console.log(result);
  const data = result.data;
  const decrypt = jwtDecode(data.token);
  const loginId = decrypt.result.id;

  // get the restaurantId
  const eateryRes = await axios.get(`api/user/eatery/login/${loginId}`);
  console.log(eateryRes);
  const eateryId = eateryRes.data.data.id;
  return eateryId;
}

// TODO: fix small chance of clashes
/**
 * @return {String}
 */
function generateVoucherCode() {
  let result = '';
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < 5; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  result += '$';
  return result;
}
// //////////////////////

/**
 * Stub for editDescription button
 * @return {Boolean}
 */
async function editDescription() {
  // alert("editDescription: Pressed editDescription");
  const description = prompt('Enter your description:');
  try {
    const eateryId = await getEateryId();

    // insert into the database
    await axios.put('api/user/eatery/description', {
      restaurantId: eateryId,
      description: description,
    });

    alert('description updated');
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
 * Stub for uploadLayout button
 * @return {Boolean}
 */
function uploadLayout() {
  alert('uploadLayout: Pressed uploadLayout');
  return false;
}

/**
 * assume that the user is in EateryAccount checked in login
 * @return {Boolean}
 */
async function uploadHours() {
  // alert("uploadHours: Pressed uploadHours");
  let day = prompt('choose day, (e.g mon,tue, wed, etc) case insensitive');
  if (day === null) {
    return;
  } else {
    day = day.toLowerCase();
  }

  const open = prompt('enter opening time (HH:MM)');
  if (open === null) {
    return;
  }
  const close = prompt('enter closing time (HH:MM)');
  if (close === null) {
    return;
  }

  // not correct day
  if (!days.includes(day)) {
    alert('incorrect day');
    return;
  }

  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  // not correct time
  if (!timeRegex.test(open) || !timeRegex.test(close)) {
    alert('incorrect time');
    return;
  } else if (open > close) {
    alert('please input opening hour first then closing hour');
    return;
  }

  try {
    const eateryId = await getEateryId();

    // insert into the database
    const res = await axios.post('api/user/hour', {
      day: day,
      open: open,
      close: close,
      restaurantId: eateryId,
    });

    console.log(res.data);
    alert('upload success');
  } catch (error) {
    alert('something is wrong in the database');
    console.log(error);
  }

  return false;
}


/**
 * upload restaurant profile image into the server
 * @param {*} event
 */
async function uploadProfileImage(event) {
  const file = event.target.files[0];
  const formData = new FormData();

  try {
    // key is user-avatar, must be exact
    const eateryId = await getEateryId();
    formData.append('eatery-avatar', file);
    // for request body
    formData.append('restaurantId', eateryId);
    // store into the database
    await axios.post('/api/user/eatery/image/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('image upload success');
  } catch (error) {
    console.log('Error uploading file into the server');
  }
}

/**
 * Stub code for creating new voucher
 * Note that logic for reoccuring has not been implemented yet
 * @param {*} percentage
 * @param {*} numVouchers
 * @param {*} startDate
 * @param {*} endDate
 * @param {*} reoccuring
 * @param {*} setError set function for string for error message
 * @return {Boolean}
 */
async function createVoucher(percentage, numVouchers, startDate, endDate,
    reoccuring, setError) {
  // Guard Statements
  let isError = false;
  setError('');
  if (percentage === '') {
    setError((prevState) => prevState + 'Enter Percentage. ');
    isError = true;
  }
  if (isNaN(+percentage)) {
    setError((prevState) => prevState + 'Percentage must be a number. ');
    isError = true;
  }
  if (numVouchers === '') {
    setError((prevState) => prevState + 'Enter Number of Vouchers. ');
    isError = true;
  }
  if (isNaN(+numVouchers)) {
    setError((prevState) => prevState + 'Number of Vouchers must be a number. ');
    isError = true;
  }
  if (startDate === '') { // start date must be earlier than end date
    setError((prevState) => prevState + 'Enter Start date. ');
    isError = true;
  }
  if (endDate === '') { // start date must be earlier than end date
    setError((prevState) => prevState + 'Enter End date. ');
    isError = true;
  }
  if (startDate > endDate && endDate !== '') {
    setError((prevState) => prevState + 'Start date older than the end date. ');
    isError = true;
  }
  if (isError) {
    return;
  }

  try {
    const eateryId = await getEateryId();
    let voucherCode = generateVoucherCode();
    voucherCode += (reoccuring ? 'RE':'');
    // insert into the database
    await axios.post('api/user/voucher', {
      offeredBy: eateryId,
      discount: percentage,
      startOffer: startDate.toISOString().slice(0, 19).replace('T', ' '),
      endOffer: endDate.toISOString().slice(0, 19).replace('T', ' '),
      count: numVouchers,
      code: voucherCode,
    });
  } catch (error) {
    console.log(error);
  }
  return false;
}

/**
 * Stub for createVoucher button
 * @param {*} setVouchers
 */
async function viewVouchers(setVouchers) {
  console.log('Viewing vouchers');
  try {
    const eateryId = await getEateryId();
    const {data} = await axios.get(`api/user/eatery/vouchers/${eateryId}`);
    const results = data.results.reverse();
    // adding column titles
    results.unshift({
      id: 'Id',
      offeredBy: 'offeredBy',
      discount: 'discount(%)',
      startOffer: 'start',
      endOffer: 'end',
      count: 'quantity',
      code: 'code',
    });
    if (results.length === 1) {
      results.push({
        id: 'N/A',
        offeredBy: 'N/A',
        discount: 'N/A',
        startOffer: 'N/A',
        endOffer: 'N/A',
        count: 'N/A',
        code: 'N/A',
      });
    }
    setVouchers(results);
  } catch (error) {
    alert('something is wrong in the database');
    console.log(error);
    setVouchers([]);
  }
}

/**
 * Loads all posts made by account
 * @param {*} setPosts
 */
async function viewPosts(setPosts) {
  console.log('Viewing vouchers');
  try {
    // const eateryId = await getEateryId();
    const {data} = await axios.get(`api/user/post/5`);
    console.log(data);
    const results = data.results;
    // adding column titles
    results.unshift({
      id: 'Id',
      postedBy: 'postedBy',
      title: 'title',
      content: 'content',
    });
    if (results.length === 1) {
      results.push({
        id: 'N/A',
        postedBy: 'N/A',
        title: 'N/A',
        content: 'N/A',
      });
    }
    setPosts(results);
  } catch (error) {
    alert('something is wrong in the database');
    console.log(error);
    setPosts([]);
  }
}

/**
 * upload new post, character limit hasn't been implemented yet
 * @param {*} title
 * @param {*} body
 * @param {*} setError set function for error output
 * @return {Boolean}
 */
async function uploadPost(title, body, setError) {
  // Guard Statements
  let isError = false;
  setError('');
  if (title === '') {
    setError((prevState) => prevState + 'Enter title. ');
    isError = true;
  }
  if (body === '') {
    setError((prevState) => prevState + 'Enter body. ');
    isError = true;
  }
  if (isError) {
    return;
  }

  try {
    const eateryId = await getEateryId();

    // insert into the database
    await axios.post('api/user/posts', {
      postedBy: eateryId,
      title: title,
      content: body,
    });
  } catch (error) {
    alert('something is wrong in the database');
    console.log(error);
  }
  return false;
}

/**
 * Genereates the URL from the restaurant id
 * @param {String} toSet toSet function for the string to hold URL
 */
async function generateProfileLink(toSet) {
  const eateryId = await getEateryId();
  console.log(`eateryId: ${eateryId}`);
  const urlToReturn = `/RestaurantProfile/${eateryId}`;
  toSet(urlToReturn);
}
/**
 * @return {JSX}
 */
export default function RestaurantHomePage() {
  const [percentage, setPercentage] = React.useState('');
  const [numVouchers, setNumVouchers] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [reoccuring, setReoccuring] = React.useState(true);
  const [titlePost, setTitlePost] = React.useState('');
  const [bodyPost, setBodyPost] = React.useState('');
  const [posts, setPosts] = React.useState([]);
  const [vouchers, setVouchers] = React.useState([]);
  const navigate = useNavigate();
  const [profileURL, setProfileURL] = React.useState('');

  // Set to '_', so 'Type' Created isn't displayed initially
  const [voucherError, setVoucherError] = React.useState('_');
  const [postError, setPostError] = React.useState('_');
  generateProfileLink(setProfileURL);

  return (
    <Container maxWidth="lg">
      <Card sx={{minWidth: 275}}>
        <CardContent>
          <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
            Restaurant Home
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={() => {
            editDescription();
          }}>Edit Description</Button>
          <Button variant="contained" onClick={() => {
            uploadMenu();
          }}>Upload Menu</Button>
          <Button variant="contained" onClick={() => {
            uploadLayout();
          }}>Upload Layout</Button>
          <Button variant="contained" onClick={() => {
            uploadHours();
          }}>Upload Hours</Button>
          <Button variant="contained" component="label">
            Upload Profile Image
            <input hidden accept="image/*" type="file" onChange={uploadProfileImage}/>
          </Button>
          <Button variant="contained" onClick={async () => {
            const eateryId = await generateProfileLink();
            navigate('/RestaurantProfile', {state: {id: eateryId}});
          }}>View Profile</Button>
        </CardActions>
      </Card>

      <Grid container spacing={0} xs={12}>
        <Grid xs={6}>
          <Card sx={{minWidth: 275, minHeight: 625}}>
            <CardContent>
              <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
                Vouchers
              </Typography>
            </CardContent>
            <Grid container spacing={2} xs={12}>
              <Grid xs={12}>
                <TextField sx={{minWidth: 258.4}}
                  required id="voucher-percentage" label="Percentage"
                  value={percentage} onChange={(event) => {
                    setPercentage(event.target.value);
                  }}
                />
                <TextField sx={{minWidth: 258.4}}
                  required id="voucher-num" label="Number of Vouchers"
                  value={numVouchers} onChange={(event) => {
                    setNumVouchers(event.target.value);
                  }}
                />
              </Grid>
              <Grid xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Start Date" value={startDate} onChange={(event) => {
                    setStartDate(event);
                  }}/>
                  <DatePicker label="End Date" value={endDate} onChange={(event) => {
                    setEndDate(event);
                  }}/>
                </LocalizationProvider>
              </Grid>
            </Grid>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />}
                label="Reoccuring" value={reoccuring} onChange={(event) => {
                  const {name, checked} = event.target; setReoccuring(checked);
                  console.log(name);
                }}/>
            </FormGroup>
            {voucherError !== '_' &&
              <Typography sx={{fontSize: 14}} color="red" gutterBottom>
                {voucherError}
              </Typography>}
            <CardActions >
              <Button variant="contained" onClick={() => {
                createVoucher(percentage, numVouchers, startDate,
                    endDate, reoccuring, setVoucherError);
                setPercentage('');
                setNumVouchers('');
                setStartDate('');
                setEndDate('');
              }}>Create Voucher</Button>
              {voucherError == '' &&
                <Typography sx={{fontSize: 20, marginLeft: 'auto'}}
                  color="green" gutterBottom>
                  Voucher Created
                </Typography>}
            </CardActions>

            <CardActions>
              { vouchers.length == 0 && <Button size="large" onClick={() => {
                viewVouchers(setVouchers);
                setVoucherError('_');
              }}>View Created Vouchers</Button> }
              { vouchers.length > 0 && <Button size="large" onClick={() => {
                setVouchers([]);
              }}>Hide Vouchers</Button> }
            </CardActions>

            <CardContent>
              <List sx={{height: 200, overflowX: 'auto', overflowY: 'auto'}}>

                {vouchers.map((voucher) => {
                  return (
                    <ListItem key={voucher.code}>
                      <Grid container spacing={0} xs={12}>
                        <Grid xs={2.5}>
                          <ListItemText primary={voucher.discount} />
                        </Grid>
                        <Grid xs={2}>
                          <ListItemText primary={voucher.count} />
                        </Grid>
                        <Grid xs={2.5}>
                          <ListItemText primary={voucher.code} />
                        </Grid>
                        <Grid xs={2.5}>
                          <ListItemText primary={voucher.startOffer.slice(0, 10)} />
                        </Grid>
                        <Grid xs={2.5}>
                          <ListItemText primary={voucher.endOffer.slice(0, 10)} />
                        </Grid>
                      </Grid>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>

          </Card>
        </Grid>
        <Grid xs={6}>
          <Card sx={{minWidth: 275}}>
            <CardContent>
              <Typography sx={{fontSize: 30}} color="text.primary" gutterBottom>
                Create Post
              </Typography>

              <Typography sx={{fontSize: 14}} color="text.primary" gutterBottom>
                Title
              </Typography>
              <TextField required id="title-post" placeholder="Title" value={titlePost}
                onChange={(event) => {
                  setTitlePost(event.target.value);
                  setPostError('_');
                }}
              />
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Body
              </Typography>
              <TextField sx={{minWidth: 500}} multiline rows={8} required id="body-post"
                placeholder="Body" value={bodyPost} onChange={(event) => {
                  setBodyPost(event.target.value);
                  setPostError('_');
                }}
              />
            </CardContent>
            <CardActions>
              <Button variant="contained" onClick={() => {
                uploadPost(titlePost, bodyPost, setPostError);
              }}>Post</Button>
              {postError == '' &&
                <Typography sx={{fontSize: 20, textAlign: 'right', marginLeft: 'auto'}}
                  color="green" gutterBottom>
                  Post Created
                </Typography>}
              {postError !== '_' &&
              <Typography sx={{fontSize: 14, textAlign: 'right', marginLeft: 'auto'}}
                color="red" gutterBottom>
                {postError}
              </Typography>}
            </CardActions>

            <CardActions>
              { posts.length == 0 && <Button size="large" onClick={() => {
                viewPosts(setPosts);
                setPostError('_');
              }}>View Created Posts</Button> }
              { posts.length > 0 && <Button size="large" onClick={() => {
                setPosts([]);
              }}>Hide Posts</Button> }
            </CardActions>

            <CardContent>
              <List sx={{height: 200, overflowX: 'auto', overflowY: 'auto'}}>

                {posts.map((post) => {
                  return (
                    <ListItem key={post.code}>
                      <Grid container spacing={0} xs={12}>
                        <Grid xs={2.5}>
                          <ListItemText primary={post.id} />
                        </Grid>
                        <Grid xs={2}>
                          <ListItemText primary={post.postedBy} />
                        </Grid>
                        <Grid xs={2.5}>
                          <ListItemText primary={post.title} />
                        </Grid>
                        <Grid xs={2.5}>
                          <ListItemText primary={post.content} />
                        </Grid>
                      </Grid>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
