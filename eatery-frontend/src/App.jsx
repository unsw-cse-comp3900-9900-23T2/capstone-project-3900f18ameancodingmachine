import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './home/HomePage';
// import LoginPage from './LoginPage';
import Banner from './banner/Banner';
import RegistrationPage from './user/RegistrationPage';

function App() {
  return (
    <Router>
      <Banner/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
