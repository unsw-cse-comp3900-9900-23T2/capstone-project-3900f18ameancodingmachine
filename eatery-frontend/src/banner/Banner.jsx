import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

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
          >
            <HomeOutlinedIcon />
          </IconButton>

          <Button color="inherit">Login</Button>
          <Button color="inherit">Register</Button>
          <Button color="inherit">New Restaurant</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
