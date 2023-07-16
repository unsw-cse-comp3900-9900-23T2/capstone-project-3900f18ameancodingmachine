import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Banner from './banner/Banner';
import HomePage from './home/HomePage';
import LoginPage from './user/LoginPage';
import ForgotPassPage from './user/ForgotPassPage';
import ForgotPassCodeEntry from './user/FogotPassCodeEntry'
import ForgotPassNewPass from './user/ForgotPassNewPass';
import RegistrationPage from './user/RegistrationPage';
import RestaurantRegistrationPage from './restaurant/RestaurantRegistrationPage';

export const UserContext = createContext(null);

export default function App() {
  const [userContext, setUserContext] = useState(null);

  return (
    <Router>
      <UserContext.Provider value={{
        userContext,
        setUserContext
      }}>
        <Banner />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Recovery" element={<ForgotPassPage/>} />
          <Route path="/RecoveryCodeEntry" element={<ForgotPassCodeEntry/>} />
          <Route path="/RecoveryNewPass" element={<ForgotPassNewPass/>} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/create-restaurant" element={<RestaurantRegistrationPage />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}
