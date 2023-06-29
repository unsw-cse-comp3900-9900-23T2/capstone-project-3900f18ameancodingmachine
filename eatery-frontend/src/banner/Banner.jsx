import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import { NavLink } from "react-router-dom";

export default function Banner() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);     // TODO get from backend
  const [isRestaurant, setIsRestaurant] = React.useState(false); // TODO get from backend

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

          {isLoggedIn && <Button color="inherit" component={NavLink} to="/login">Logout</Button>}
          {!isLoggedIn && <Button color="inherit" component={NavLink} to="/login">Login</Button>}
          {!isLoggedIn && <Button color="inherit" component={NavLink} to="/register">Register</Button>}
          {isRestaurant && <Button color="inherit" component={NavLink} to="/create-restaurant">New Restaurant</Button>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
