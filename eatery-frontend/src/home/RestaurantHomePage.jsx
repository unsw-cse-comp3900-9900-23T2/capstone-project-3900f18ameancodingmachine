import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

// helper function to get the eatery id
async function getEateryId() {
  const result = await axios.get('api/user/')
  let data = result.data;
  const decrypt = jwt_decode(data.token)
  let loginId = decrypt.result.id;

  // get the restaurantId
  const eateryRes = await axios.get(`api/user/eatery/login/${loginId}`)
  const eateryId =  eateryRes.data.data.id
  return eateryId;
}

/*
 * Stub for editDescription button
 */
async function editDescription() {
  // alert("editDescription: Pressed editDescription");
  const description = prompt("Enter your description:")
  try {
    const eateryId =  await getEateryId()

    // insert into the database
    const res = await axios.put('api/user/eatery/description', {
      restaurantId: eateryId,
      description: description
    })

    alert("description updated")
  } catch (error) {
    alert("something is wrong in the database")
    console.log(error)
  }
  return false;
}

/*
 * Stub for uploadMenu button
 */
async function uploadMenu() {
  alert("uploadMenu: Pressed uploadMenu")
  let category = prompt("Enter a category")
  let name = prompt("Enter a name of the menu")
  let price = prompt("Enter a price of the menu")
  let desc = prompt("Enter a description for this menu")

  if (isNaN(price)) {
    return
  }
  
  try {
    const eateryId = await getEateryId()

    // insert into the database
    const res = await axios.post('api/user/menu', {
      category: category,
      name: name,
      price: price,
      description: desc,
    })

    console.log(res.data)
    alert("upload success")
  } catch (error) {
    alert("something is wrong in the database")
    console.log(error)
  }
  return false;
}

/*
 * Stub for uploadLayout button
 */
function uploadLayout() {
  alert("uploadLayout: Pressed uploadLayout");
  return false;
}

/*
 * assume that the user is in EateryAccount checked in login
 */
async function uploadHours() {
  // alert("uploadHours: Pressed uploadHours");
  let day = prompt("choose day, (e.g mon,tue, wed, etc) case insensitive")
  if (day === null) {
    return
  } else {
    day = day.toLowerCase()
  }

  let open = prompt("enter opening time (HH:MM)")
  if (open === null) {
    return
  }
  let close = prompt("enter closing time (HH:MM)")
  if (close === null) {
    return
  }

  // not correct day
  if (!days.includes(day)) {
    alert("incorrect day")
    return;
  }

  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  // not correct time
  if (!timeRegex.test(open) || !timeRegex.test(close)) {
    alert("incorrect time")
    return;
  } else if (open > close) {
    alert("please input opening hour first then closing hour")
    return;
  }

  try {
    const eateryId = await getEateryId()

    // insert into the database
    const res = await axios.post('api/user/hour', {
      day: day,
      open: open,
      close: close,
      restaurantId: eateryId
    })

    console.log(res.data)
    alert("upload success")
  } catch (error) {
    alert("something is wrong in the database")
    console.log(error)
  }

  return false;
}

/* 
  Stub code for creating new voucher
  Note that logic for reoccuring has not been implemented yet
*/
async function createVoucher(percentage, numVouchers, startDate, endDate, reoccuring) {

  if (percentage === "" || numVouchers === "") { // field must be filled
    alert("fill the voucher details");
    return
  } else if (startDate > endDate) { // start date must be earlier than end date
    alert("start date older than the end date")
    return
  }

  try {
    const eateryId =  await getEateryId();

    // insert into the database
    const res = await axios.post('api/user/voucher', {
      offeredBy: eateryId,
      discount: percentage,
      startOffer: startDate.toISOString().slice(0, 19).replace('T', ' '),
      endOffer: endDate.toISOString().slice(0, 19).replace('T', ' '),
      count: numVouchers
    })

    alert("voucher created")
  } catch (error) {
    alert("something is wrong in the database")
    console.log(error)
  }
  return false;
}

/*
 * Stub for createVoucher button
 */
function viewVouchers() {
  alert("viewVouchers: Pressed viewVouchers");
  return false;
}

/* 
  upload new post, character limit hasn't been implemented yet
*/
async function uploadPost(title, body) {
  // alert(`uploadPost: Pressed uploadPost\nTitle: ${title}\nBody: ${body}`);
  if (!title || !body) {
    alert("please fill in the details");
    return;
  }
  
  try {
    const eateryId = await getEateryId()

    // insert into the database
    const res = await axios.post('api/user/posts', {
      postedBy: eateryId,
      title: title,
      content: body
    })

    alert("new post created")
  } catch (error) {
    alert("something is wrong in the database")
    console.log(error)
  }
  return false
}



export default function RestaurantHomePage() {
  const [percentage, setPercentage] = React.useState('');
  const [numVouchers, setNumVouchers] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [reoccuring, setReoccuring] = React.useState(true);
  const [titlePost, setTitlePost] = React.useState('');
  const [bodyPost, setBodyPost] = React.useState('');

  return (
    <Container maxWidth="lg">
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            Restaurant Home
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={() => {editDescription()}}>Edit Description</Button>
          <Button variant="contained" onClick={() => {uploadMenu()}}>Upload Menu</Button>
          <Button variant="contained" onClick={() => {uploadLayout()}}>Upload Layout</Button>
          <Button variant="contained" onClick={() => {uploadHours()}}>Upload Hours</Button>
        </CardActions>
      </Card>

      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            Vouchers
          </Typography>
        </CardContent>

        <TextField required id="voucher-percentage" label="Percentage" value={percentage} onChange={(event) => {
              setPercentage(event.target.value);
            }}
          />
        <TextField required id="voucher-num" label="Number of Vouchers" value={numVouchers} onChange={(event) => {
            setNumVouchers(event.target.value);
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Start Date" value={startDate} onChange={(event) => {
              setStartDate(event);
            }}/>
          <DatePicker label="End Date" value={endDate} onChange={(event) => {
              setEndDate(event);
            }}/>
        </LocalizationProvider>
        <FormGroup>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Reoccuring" value={reoccuring} onChange={(event) => {
            const { name, checked } = event.target; setReoccuring(checked);
          }}/>
        </FormGroup>  
        <CardActions >          
          <Button variant="contained" onClick={() => {createVoucher(percentage, numVouchers, startDate, endDate, reoccuring)}}>Create Voucher</Button>
        </CardActions>
        
        <CardActions>
          <Button size="large" onClick={() => {viewVouchers()}}>View Created Vouchers</Button>
        </CardActions>
        
      </Card>
      
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            Create Post
          </Typography>

          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Title
          </Typography>
          <TextField required id="title-post" placeholder="Title" value={titlePost} onChange={(event) => {
              setTitlePost(event.target.value);
            }}
          />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Body
          </Typography>
          <TextField sx={{ minWidth: 500 }} multiline rows={8} required id="body-post" placeholder="Body" value={bodyPost} onChange={(event) => {
              setBodyPost(event.target.value);
            }}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={() => {uploadPost(titlePost,bodyPost)}}>Post</Button>
        </CardActions>
      </Card>

    </Container>
    
  );
}