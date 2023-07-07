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

/*
 * Stub for editDescription button
 */
function editDescription() {
  alert("editDescription: Pressed editDescription");
  return false;
}

/*
 * Stub for uploadMenu button
 */
function uploadMenu() {
  alert("uploadMenu: Pressed uploadMenu");
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
 * Stub for uploadHours button
 */
function uploadHours() {
  alert("uploadHours: Pressed uploadHours");
  return false;
}

/*
 * Stub for createVoucher button
 */
function createVoucher(percentage, numVouchers, startDate, endDate, reoccuring) {
  alert(`createVoucher: Pressed createVoucher \npercentage =${percentage}\nnumVouchers =${numVouchers}\nstartDate =${startDate}\nendDate =${endDate}\nreoccuring =${reoccuring}`);
  return false;
}

/*
 * Stub for createVoucher button
 */
function viewVouchers() {
  alert("viewVouchers: Pressed viewVouchers");
  return false;
}




export default function RestaurantHomePage() {
  const [percentage, setPercentage] = React.useState('');
  const [numVouchers, setNumVouchers] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [reoccuring, setReoccuring] = React.useState(true);
  const [test, setTest] = React.useState('');
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
            setReoccuring(event.target.value);
          }}/>
        </FormGroup>  
        <CardActions >          
          <Button variant="contained" onClick={() => {createVoucher(percentage, numVouchers, startDate, endDate, reoccuring)}}>Create Voucher</Button>
        </CardActions>
        
        <CardActions>
          <Button size="large" onClick={() => {viewVouchers()}}>View Created Vouchers</Button>
        </CardActions>
        
      </Card>
    </Container>
    
  );
}