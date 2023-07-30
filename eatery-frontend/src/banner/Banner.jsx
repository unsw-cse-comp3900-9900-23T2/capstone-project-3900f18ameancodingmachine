import React, {useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import {UserContext} from '../App.jsx';

import axios from 'axios';
import {useNavigate, NavLink} from 'react-router-dom';

/**
 *
 * @param {*} setUserContext
 * @param {*} navigate
 */
async function logOut(setUserContext, navigate) {
  try {
    const result = await axios.put('api/user/logout');
    const data = result.data;
    console.log(data.message);
    if (data.success) {
      console.log('reset to null');
      setUserContext(null); // Reset user context
      navigate('/');
    }
    // reload page to re-render
    // window.location.reload(false)
  } catch (err) {
    console.log(err.response);
  }
}

/**
 * @return {JSX} Banner component
 */
export default function Banner() {
  // Null: not logged in, true: user, false: restaurant
  const {userContext, setUserContext} = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{mr: 2}}
            component={NavLink}
            to="/home"
          >
            <HomeOutlinedIcon />
          </IconButton>
          {userContext !== null && <Button color="inherit" onClick={() => {
            logOut(setUserContext, navigate);
          }}>
              Logout
          </Button>}
          {userContext === null &&
            <Button color="inherit" component={NavLink} to="/login">
              Login
            </Button>
          }
          {userContext === null &&
            <Button color="inherit" component={NavLink} to="/register">
              Register
            </Button>
          }
          {userContext === false &&
            <Button color="inherit" component={NavLink} to="/create-restaurant">
              New Restaurant
            </Button>
          }
          {userContext === true &&
            <IconButton sx={{marginLeft: 'auto'}} size="large" onClick={() => {
              navigate('/user-profile');
            }} color="inherit">
              <AccountCircle />
            </IconButton>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}
