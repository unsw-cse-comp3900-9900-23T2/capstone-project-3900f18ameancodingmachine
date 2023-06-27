import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import { NavLink } from "react-router-dom";

export default function Banner() {

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

          <Button color="inherit" component={NavLink} to="/login">Login</Button>
          <Button color="inherit" component={NavLink} to="/register">Register</Button>
          <Button color="inherit" component={NavLink} to="/create-restaurant">New Restaurant</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
