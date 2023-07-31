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

import {NavLink} from 'react-router-dom';

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// //HELPER FUNCTIONS////

// helper function to get the eatery id
/**
 * @return {Int}
 */
async function getEateryId() {
  const result = await axios.get('api/user/');
  const data = result.data;
  const decrypt = jwtDecode(data.token);
  const loginId = decrypt.result.id;

  // get the restaurantId
  const eateryRes = await axios.get(`api/user/eatery/login/${loginId}`);
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
 * upload new post, character limit hasn't been implemented yet
 * @param {*} title
 * @param {*} body
 * @return {Boolean}
 */
async function uploadPost(title, body) {
  // alert(`uploadPost: Pressed uploadPost\nTitle: ${title}\nBody: ${body}`);
  if (!title || !body) {
    alert('please fill in the details');
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

    alert('new post created');
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
  const [vouchers, setVouchers] = React.useState([]);
  const [profileURL, setProfileURL] = React.useState('');
  // Set to '_', so Voucher Created isn't displayed initially
  const [voucherError, setVoucherError] = React.useState('_');
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
          <Button variant="contained" component={NavLink} to={profileURL}>
            View Profile</Button>
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
                }}
              />
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Body
              </Typography>
              <TextField sx={{minWidth: 500}} multiline rows={8} required id="body-post"
                placeholder="Body" value={bodyPost} onChange={(event) => {
                  setBodyPost(event.target.value);
                }}
              />
            </CardContent>
            <CardActions>
              <Button variant="contained" onClick={() => {
                uploadPost(titlePost, bodyPost);
              }}>Post</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
