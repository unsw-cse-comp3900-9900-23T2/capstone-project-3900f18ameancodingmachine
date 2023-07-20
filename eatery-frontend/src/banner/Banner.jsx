import {useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { UserContext } from '../App.jsx';

import axios from 'axios';
import { NavLink } from "react-router-dom";

async function logOut(setUserContext) {
  try {
    const result = await axios.put('api/user/logout')
    let data = result.data;
    console.log(data.message);
    if (data.success) {
      console.log('reset to null');
      setUserContext(null); // Reset user context
    }
    // reload page to re-render
    window.location.reload(false)
  } catch (err) {
    console.log(err.response)
  }
}

export default function Banner() {
  // Null: not logged in, true: user, false: restaurant
  const { userContext, setUserContext } = useContext(UserContext);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            component={NavLink}
            to="/"
          >
            <HomeOutlinedIcon />
          </IconButton>
          {userContext !== null && <Button color="inherit" onClick={() => {
            logOut(setUserContext);
          }}>
              Logout
            </Button>}
          {userContext === null && <Button color="inherit" component={NavLink} to="/login">Login</Button>}
          {userContext === null && <Button color="inherit" component={NavLink} to="/register">Register</Button>}
          {userContext === false && <Button color="inherit" component={NavLink} to="/create-restaurant">New Restaurant</Button>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
