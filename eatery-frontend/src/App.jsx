import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Banner from './banner/Banner';
import HomePage from './home/HomePage';
import LoginPage from './user/LoginPage';
import ForgotPassPage from './user/ForgotPassPage';
import RegistrationPage from './user/RegistrationPage';
import RestaurantRegistrationPage from './restaurant/RestaurantRegistrationPage';

export default function App() {
  return (
    <Router>
      <Banner/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loginRecovery" element={<ForgotPassPage/>} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/create-restaurant" element={<RestaurantRegistrationPage />} />
      </Routes>
    </Router>
  );
}
