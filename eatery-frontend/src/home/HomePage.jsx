import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';

import UserHomePage from './UserHomePage';
import RestaurantHomePage from './RestaurantHomePage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { UserContext } from '../App.jsx';

export default function HomePage() {
  // Null: not logged in, true: user, false: restaurant
  const { userContext, setUserContext } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkCookies() {
      try {
        const result = await axios.get('api/user/')
        let data = result.data;
        const decrypt = jwt_decode(data.token)
        if (data.success !== 0) {
          let loginId = decrypt.result.id;
          // get EateryAccount, if no result then it will return an 404 error
          // else it will go to restaurant page
          await axios.get(`api/user/eatery/login/${loginId}`);
          console.log("is a restaurant")
          setUserContext(false);
        }
      } catch (err) {
        if (err.response) { // not an eatery
          console.log(err.response.data.message);
          console.log(err.response.data);
          console.log("set to true")
          setUserContext(true);
        } else { // not loggedIn
          setUserContext(null);
          navigate("/");
          console.log("Not logged in");
        }
      }
    }
    checkCookies()
  }, [setUserContext])
  
  return (
    // Defaults to User Home Page if not logged in
    <Container maxWidth="lg">
      {userContext === false  && <RestaurantHomePage/>}
      {userContext === true && <UserHomePage/>}
    </Container>
  );
}